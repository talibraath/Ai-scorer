import { NextRequest, NextResponse } from "next/server";
import { scoreWithGPT, generateRewritePrompt } from "@/../lib/gpt";
import rubric from "@/../public/rubric.json";

interface RubricItem {
  Definition: string;
  Measures: string[];
  "Scoring Guidelines": Record<string, string>;
  "Special Protocol"?: string;
}

export async function POST(req: NextRequest) {
  const { textA, textB } = await req.json();

  if (!textA || !textB) {
    return NextResponse.json({ error: "Both textA and textB must be provided" }, { status: 400 });
  }

  const results: Record<string, any> = {};
  const scores: number[] = [];

  for (const [category, definitionObj] of Object.entries(rubric) as [string, RubricItem][]) {
    const definition = definitionObj.Definition;

    const [scoreA, scoreB] = await Promise.all([
      scoreWithGPT(category, definition, textA),
      scoreWithGPT(category, definition, textB),
    ]);

    const averageScore = (scoreA + scoreB) / 2;
    scores.push(averageScore);

    results[category] = {
      scoreA,
      scoreB,
      average: averageScore,
    };
  }

  const average = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);

  const sorted = Object.entries(results).sort((a, b) => a[1].average - b[1].average);
  const lowestCategories = sorted.slice(0, 2).map(([cat]) => cat);
  const rewritePrompt = await generateRewritePrompt(lowestCategories, rubric, textA);

  return NextResponse.json({
    scores: results,
    average,
    rewritePrompt,
  });
}
