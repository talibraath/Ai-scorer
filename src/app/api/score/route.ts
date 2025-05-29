import { NextRequest, NextResponse } from "next/server";
import { scoreWithGPT, generateRewritePrompt } from "@/../lib/gpt";
import rubric from "@/../public/rubric.json";

export async function POST(req: NextRequest) {
  const { textA, textB } = await req.json();

  if (!textA || !textB) {
    return NextResponse.json({ error: "Both textA and textB are required." }, { status: 400 });
  }

  const versionA: Record<string, any> = {};
  const versionB: Record<string, any> = {};
  const deltas: Record<string, number> = {};

  for (const [category, definition] of Object.entries(rubric)) {
    const prompt = `${definition.Definition} Measures: ${definition.Measures.join(", ")}`;
    
    const [scoreA, scoreB] = await Promise.all([
      scoreWithGPT(category, prompt, textA),
      scoreWithGPT(category, prompt, textB),
    ]);

    versionA[category] = scoreA;
    versionB[category] = scoreB;
    deltas[category] = scoreB.score - scoreA.score;
  }

  return NextResponse.json({
    versionA,
    versionB,
    deltas
  });
}
