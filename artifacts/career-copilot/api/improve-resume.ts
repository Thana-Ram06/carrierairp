import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Gemini API key is not configured. Please set the GEMINI_API_KEY environment variable." });
  }

  const { resumeText } = req.body ?? {};
  if (!resumeText) {
    return res.status(400).json({ error: "Missing required field: resumeText" });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a professional resume writer and career coach. Please improve and rewrite the following resume to make it more professional, impactful, and ATS-friendly. Enhance the language, structure, and presentation while preserving all factual information. Use strong action verbs, quantify achievements where possible, and ensure clear section organization.

Original Resume:
${resumeText}

Provide the complete improved resume.`;

    const result = await model.generateContent(prompt);
    const improvedResume = result.response.text();
    return res.json({ improvedResume });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to improve resume";
    return res.status(500).json({ error: message });
  }
}
