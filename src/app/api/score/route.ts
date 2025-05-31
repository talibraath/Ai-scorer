import { NextRequest, NextResponse } from "next/server";
import { scoreWithGPT, generateRewritePrompt } from "@/../lib/gpt";
import rubric from "@/../lib/rubric";

// Optional: Define a type for the GPT scoring result
type ScoreResult = {
  score: number;
  explanation: string; // Adjust this based on actual return shape
};

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  if (!text) {
    return NextResponse.json({ error: "No text provided" }, { status: 400 });
  }

  const results: Record<string, ScoreResult> = {};
  const scores: number[] = [];

  for (const [category, description] of Object.entries(rubric)) {
    try {
      const definition =
        typeof description === "string" ? description : description.Definition;

      const result = await scoreWithGPT(category, definition, text);
      results[category] = result;
      scores.push(result.score);
    } catch (err) {
      console.error(`Scoring failed for category "${category}":`, err);
      results[category] = {
        score: 0,
        explanation: "Scoring failed due to an internal error.",
      };
      scores.push(0);
    }
  }

  const average =
    scores.length > 0
      ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)
      : "0.00";

  const sorted = Object.entries(results).sort(
    (a, b) => a[1].score - b[1].score
  );
  const lowestCategories = sorted.slice(0, 2).map(([cat]) => cat);

  const definitionsOnly: Record<string, string> = Object.fromEntries(
    Object.entries(rubric).map(([key, value]) => [key, value.Definition])
  );

  const rewritePrompt = await generateRewritePrompt(
    lowestCategories,
    definitionsOnly,
    text
  );

  return NextResponse.json(
    {
      scores: results,
      average,
      rewritePrompt,
    },
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
