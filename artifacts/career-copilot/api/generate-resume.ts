import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Gemini API key is not configured. Please set the GEMINI_API_KEY environment variable." });
  }

  const { name, skills, experience, education } = req.body ?? {};
  if (!name || !skills || !experience || !education) {
    return res.status(400).json({ error: "Missing required fields: name, skills, experience, education" });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a professional resume writer. Create a polished, ATS-friendly resume based on the following information:

Name: ${name}
Skills: ${skills}
Experience: ${experience}
Education: ${education}

Format the resume professionally with clear sections: Summary, Skills, Work Experience, and Education. Make it concise, impactful, and optimized for ATS systems. Use action verbs and quantify achievements where possible.`;

    const result = await model.generateContent(prompt);
    const resume = result.response.text();
    return res.json({ resume });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to generate resume";
    return res.status(500).json({ error: message });
  }
}
