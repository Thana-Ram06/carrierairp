import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Gemini API key is not configured. Please set the GEMINI_API_KEY environment variable." });
  }

  const { role, skills } = req.body ?? {};
  if (!role) {
    return res.status(400).json({ error: "Missing required field: role" });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const skillsContext = skills ? ` with skills in ${skills}` : "";
    const prompt = `You are an expert career coach and interviewer. Generate 8 insightful interview questions with detailed, practical answers for a ${role} position${skillsContext}.

Include a mix of:
- Behavioral questions (STAR format answers)
- Technical/role-specific questions
- Problem-solving questions
- Culture fit questions

Return ONLY valid JSON in this exact format:
{"questions": [{"question": "...", "answer": "..."}, ...]}`;

    const result = await model.generateContent(prompt);
    const content = result.response.text();
    const parsed = JSON.parse(content) as { questions?: { question: string; answer: string }[] };
    const questions = parsed.questions ?? [];
    return res.json({ questions });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to generate interview questions";
    return res.status(500).json({ error: message });
  }
}
