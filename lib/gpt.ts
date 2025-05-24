import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function scoreWithGPT(
  category: string,
  rubric: string,
  text: string
): Promise<{ score: number; explanation: string }> {
  const prompt = `Score the following section for ${category}. Use this rubric: ${rubric}. Return a decimal score (0.0–10.0) and a short justification.\n\nText:\n${text}`;

  const res = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  const content = res.choices[0].message?.content ?? "";

  // Very basic extraction – improve as needed
  const scoreMatch = content.match(/(\d+\.\d+)/);
  const score = scoreMatch ? parseFloat(scoreMatch[1]) : 5.0;

  return {
    score,
    explanation: content,
  };
}

export async function generateRewritePrompt(
  lowestCategories: string[],
  rubric: Record<string, string>,
  text: string
): Promise<string> {
  const prompt = `Based on the following text and these low-scoring categories: ${lowestCategories.join(
    ", "
  )}, provide a brief rewrite suggestion. Use this rubric: ${lowestCategories
    .map((cat) => `${cat}: ${rubric[cat]}`)
    .join(" | ")}.\n\nText:\n${text}`;

  const res = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
  });

  return res.choices[0].message?.content || "No suggestion generated.";
}
