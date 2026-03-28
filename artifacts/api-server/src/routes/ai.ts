import { Router, type IRouter } from "express";
import OpenAI from "openai";
import {
  GenerateResumeBody,
  ImproveResumeBody,
  GenerateInterviewQuestionsBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }
  return new OpenAI({ apiKey });
}

router.post("/generate-resume", async (req, res) => {
  const parsed = GenerateResumeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { name, skills, experience, education } = parsed.data;

  let openai: OpenAI;
  try {
    openai = getOpenAIClient();
  } catch {
    res.status(500).json({ error: "OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable." });
    return;
  }

  try {
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
    res.json({ resume });
  } catch (err: unknown) {
    req.log.error({ err }, "Error generating resume");
    const message = err instanceof Error ? err.message : "Failed to generate resume";
    res.status(500).json({ error: message });
  }
});

router.post("/improve-resume", async (req, res) => {
  const parsed = ImproveResumeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { resumeText } = parsed.data;

  let openai: OpenAI;
  try {
    openai = getOpenAIClient();
  } catch {
    res.status(500).json({ error: "OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable." });
    return;
  }

  try {
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
    res.json({ improvedResume });
  } catch (err: unknown) {
    req.log.error({ err }, "Error improving resume");
    const message = err instanceof Error ? err.message : "Failed to improve resume";
    res.status(500).json({ error: message });
  }
});

router.post("/interview", async (req, res) => {
  const parsed = GenerateInterviewQuestionsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { role, skills } = parsed.data;

  let openai: OpenAI;
  try {
    openai = getOpenAIClient();
  } catch {
    res.status(500).json({ error: "OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable." });
    return;
  }

  try {
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
    const parsed2 = JSON.parse(content) as { questions?: { question: string; answer: string }[] };
    const questions = parsed2.questions ?? [];

    res.json({ questions });
  } catch (err: unknown) {
    req.log.error({ err }, "Error generating interview questions");
    const message = err instanceof Error ? err.message : "Failed to generate interview questions";
    res.status(500).json({ error: message });
  }
});

export default router;
