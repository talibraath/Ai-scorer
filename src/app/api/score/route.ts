// ✅ Correct way for App Router (Next.js 13+)
import { NextRequest, NextResponse } from "next/server";
import { scoreWithGPT, generateRewritePrompt } from "@/../lib/gpt";
import rubric from "@/../public/rubric.json";

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  if (!text) {
    return NextResponse.json({ error: "No text provided" }, { status: 400 });
  }

  const results: Record<string, any> = {};
  const scores: number[] = [];

  for (const [category, description] of Object.entries(rubric)) {
    const definition = typeof description === "string" ? description : description.Definition;
    const result = await scoreWithGPT(category, definition, text);
    results[category] = result;
    scores.push(result.score);
  }

  const average = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);

  const sorted = Object.entries(results).sort((a, b) => a[1].score - b[1].score);
  const lowestCategories = sorted.slice(0, 2).map(([cat]) => cat);
//  const rewritePrompt = await generateRewritePrompt(lowestCategories, rubric, text);



const definitionsOnly: Record<string, string> = Object.fromEntries(
  Object.entries(rubric).map(([key, value]) => [key, value.Definition])
);

const rewritePrompt = await generateRewritePrompt(lowestCategories, definitionsOnly, text);



  return NextResponse.json({
    scores: results,
    average,
    rewritePrompt
  });
}
