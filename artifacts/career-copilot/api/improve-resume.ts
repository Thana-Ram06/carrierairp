import OpenAI from "openai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable." });
  }

  const { resumeText } = req.body ?? {};
  if (!resumeText) {
    return res.status(400).json({ error: "Missing required field: resumeText" });
  }

  try {
    const openai = new OpenAI({ apiKey });
    const prompt = `You are a professional resume writer and career coach. Please improve and rewrite the following resume to make it more professional, impactful, and ATS-friendly. Enhance the language, structure, and presentation while preserving all factual information. Use strong action verbs, quantify achievements where possible, and ensure clear section organization.

Original Resume:
${resumeText}

Provide the complete improved resume.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
    });

    const improvedResume = completion.choices[0]?.message?.content ?? "";
    return res.json({ improvedResume });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to improve resume";
    return res.status(500).json({ error: message });
  }
}
