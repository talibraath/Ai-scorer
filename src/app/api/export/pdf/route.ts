export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function POST(req: NextRequest) {
  const { scores, average, rewritePrompt, metadata } = await req.json();

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let y = 750;

  const draw = (text: string, fontSize = 12) => {
  if (y < 50) return;
  const cleaned = text.replace(/→/g, "->"); // Replace incompatible chars
  page.drawText(cleaned, {
    x: 50,
    y,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });
  y -= fontSize + 6;
};


  draw("Scoring Report", 16);
  draw(`Section: ${metadata?.sectionId || "N/A"}`);
  draw(`Version: ${metadata?.version || "N/A"}`);
  draw(`Date: ${new Date().toLocaleDateString()}`);
  draw(" ");
  draw(`Average Score: ${average}`, 13);
  draw(" ");

  draw("Category Scores:", 14);

  Object.entries(scores).forEach(([cat, obj]: any) => {
    const explanation = obj.explanation?.slice(0, 100).replace(/\n/g, " ");
    draw(`${cat}: ${obj.score}`);
    if (explanation) draw(`→ ${explanation}`);
  });

  draw(" ");
  draw("Rewrite Suggestion:", 14);
  draw(rewritePrompt?.slice(0, 150).replace(/\n/g, " ") || "N/A");

  const pdfBytes = await pdfDoc.save();
  return new Response(new Uint8Array(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="scoring-report.pdf"',
    },
  });
}
