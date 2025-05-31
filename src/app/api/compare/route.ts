// /src/app/api/compare/route.ts
import { NextRequest, NextResponse } from "next/server";
import { scoreWithGPT } from "@/../lib/gpt";
//import rubric from "@/../lib/rubric";


import rubric from "@/../lib/rubric";
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

  for (const [category, definitionObj] of Object.entries(rubric)) {
    // Extract the "Definition" field, which should be a string
    const definitionText = definitionObj.Definition;

    const [scoreA, scoreB] = await Promise.all([
      scoreWithGPT(category, definitionText, textA),
      scoreWithGPT(category, definitionText, textB),
    ]);

    results.versionA[category] = scoreA;
    results.versionB[category] = scoreB;
    results.deltas[category] = +(scoreB.score - scoreA.score).toFixed(2);
  }

  return NextResponse.json(results);
}
