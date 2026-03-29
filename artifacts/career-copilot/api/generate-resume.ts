import OpenAI from "openai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable." });
  }

  const { name, skills, experience, education } = req.body ?? {};
  if (!name || !skills || !experience || !education) {
    return res.status(400).json({ error: "Missing required fields: name, skills, experience, education" });
  }

  try {
    const openai = new OpenAI({ apiKey });
    const prompt = `You are a professional resume writer. Create a polished, ATS-friendly resume based on the following information:

Name: ${name}
Skills: ${skills}
Experience: ${experience}
Education: ${education}

Format the resume professionally with clear sections: Summary, Skills, Work Experience, and Education. Make it concise, impactful, and optimized for ATS systems. Use action verbs and quantify achievements where possible.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1500,
    });

    const resume = completion.choices[0]?.message?.content ?? "";
    return res.json({ resume });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to generate resume";
    return res.status(500).json({ error: message });
  }
}
