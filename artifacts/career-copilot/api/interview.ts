import OpenAI from "openai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable." });
  }

  const { role, skills } = req.body ?? {};
  if (!role) {
    return res.status(400).json({ error: "Missing required field: role" });
  }

  try {
    const openai = new OpenAI({ apiKey });
    const skillsContext = skills ? ` with skills in ${skills}` : "";
    const prompt = `You are an expert career coach and interviewer. Generate 8 insightful interview questions with detailed, practical answers for a ${role} position${skillsContext}.

Include a mix of:
- Behavioral questions (STAR format answers)
- Technical/role-specific questions
- Problem-solving questions
- Culture fit questions

Return ONLY valid JSON in this exact format, with no markdown, no code blocks, just the raw JSON:
{"questions": [{"question": "...", "answer": "..."}, ...]}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2500,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content) as { questions?: { question: string; answer: string }[] };
    const questions = parsed.questions ?? [];
    return res.json({ questions });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to generate interview questions";
    return res.status(500).json({ error: message });
  }
}
