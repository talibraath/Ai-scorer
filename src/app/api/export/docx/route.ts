export const runtime = "nodejs";

import { NextRequest } from "next/server";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  HeadingLevel,
} from "docx";

export async function POST(req: NextRequest) {
  const { scores, average, rewritePrompt, metadata } = await req.json();

  const tableRows: TableRow[] = [
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph("Category")] }),
        new TableCell({ children: [new Paragraph("Score")] }),
        new TableCell({ children: [new Paragraph("Explanation")] }),
      ],
    }),
    ...Object.entries(scores).map(([cat, data]: any) =>
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(cat)] }),
          new TableCell({ children: [new Paragraph(data.score.toString())] }),
          new TableCell({
            children: [
              new Paragraph(
                data.explanation
                  ? data.explanation.slice(0, 300).replace(/[^\x00-\x7F]/g, "")
                  : "No explanation"
              ),
            ],
          }),
        ],
      })
    ),
  ];

  const doc = new Document({
    creator: "AI Scoring Tool",
    title: "Scoring Report",
    description: "Comparison result with AI-generated rubric feedback",
    sections: [
      {
        children: [
          new Paragraph({
            text: "Scoring Report",
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [
              new TextRun(`Section: ${metadata?.sectionId || "N/A"}\n`),
              new TextRun(`Version: ${metadata?.version || "N/A"}\n`),
              new TextRun(`Date: ${new Date().toLocaleDateString()}\n`),
            ],
          }),
          new Paragraph({ text: " " }),
          new Paragraph({
            children: [
              new TextRun("Average Score: "),
              new TextRun({ text: `${average}`, bold: true }),
            ],
          }),
          new Paragraph({ text: " " }),
          new Paragraph({
            text: "Scores by Category",
            heading: HeadingLevel.HEADING_2,
          }),
          new Table({
            rows: tableRows,
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),
          new Paragraph({ text: " " }),
          new Paragraph({
            text: "Rewrite Guidance",
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph(
            rewritePrompt?.slice(0, 500).replace(/[^\x00-\x7F]/g, "") || "N/A"
          ),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": 'attachment; filename="scoring-report.docx"',
    },
  });
}
