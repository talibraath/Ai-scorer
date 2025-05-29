// /src/app/api/compare/route.ts
import { NextRequest, NextResponse } from "next/server";
import { scoreWithGPT } from "@/../lib/gpt";
import rubric from "@/../public/rubric.json";

export async function POST(req: NextRequest) {
  const { textA, textB } = await req.json();

  if (!textA || !textB) {
    return NextResponse.json({ error: "Missing input texts" }, { status: 400 });
  }

  const results: any = {
    versionA: {},
    versionB: {},
    deltas: {},
  };

  for (const [category, definition] of Object.entries(rubric)) {
    const rubricString = JSON.stringify(definition);
    const [scoreA, scoreB] = await Promise.all([
      scoreWithGPT(category, rubricString, textA),
      scoreWithGPT(category, rubricString, textB),
    ]);

    results.versionA[category] = scoreA;
    results.versionB[category] = scoreB;
    results.deltas[category] = +(scoreB.score - scoreA.score).toFixed(2);
  }

  return NextResponse.json(results);
}
