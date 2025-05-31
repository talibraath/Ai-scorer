// utils/pdfProcessor.ts
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist"
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url"

GlobalWorkerOptions.workerSrc = workerSrc

export async function extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
  const pdf = await getDocument({ data: arrayBuffer }).promise
  let text = ""
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const strings = content.items.map((item: any) => item.str).join(" ")
    text += strings + "\n"
  }
  return text
}
