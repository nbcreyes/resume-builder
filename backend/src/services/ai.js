const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const safeParseJSON = (text) => {
  const clean = text.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(clean);
  } catch {
    throw new Error("AI returned malformed response. Please try again.");
  }
};

const chat = async (prompt) => {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });
  return response.choices[0].message.content;
};

const generateResumeContent = async (rawData) => {
  const prompt = `
You are a professional resume writer with 10 years of experience helping candidates land jobs at top companies.

A user has provided their raw work experience and skills. Rewrite this into polished, professional resume content.

Rules:
- Use strong action verbs
- Quantify achievements where possible or implied
- Keep bullet points concise and impactful
- Do not invent specific numbers or companies not mentioned
- Return only valid JSON, no markdown, no explanation

Input data:
${JSON.stringify(rawData, null, 2)}

Return this exact JSON structure:
{
  "summary": "2-3 sentence professional summary",
  "experience": [
    {
      "company": "same company name from input",
      "role": "same role from input",
      "startDate": "same from input",
      "endDate": "same from input",
      "current": true or false,
      "description": "rewritten polished description"
    }
  ],
  "skills": ["skill1", "skill2"]
}
`;

  const text = await chat(prompt);
  return safeParseJSON(text);
};

const generateCoverLetter = async (resumeData, jobTitle, company) => {
  const prompt = `
You are a professional cover letter writer.

Write a tailored cover letter for the following candidate applying for the role of ${jobTitle} at ${company}.

Rules:
- 3 paragraphs: opening, value proposition, closing
- Confident and professional tone
- Specific to the job title and company
- Do not include placeholders like [your name] — use the name from the resume data
- Return only the cover letter text, no explanation

Resume data:
${JSON.stringify(resumeData, null, 2)}
`;

  return await chat(prompt);
};

const analyzeATS = async (resumeData) => {
  const prompt = `
You are an ATS (Applicant Tracking System) expert and resume coach.

Analyze the following resume and return an ATS compatibility report.

Rules:
- Score out of 100 based on keyword density, formatting clarity, section completeness, and action verb usage
- Be specific and actionable in your feedback
- Return only valid JSON, no markdown, no explanation

Resume data:
${JSON.stringify(resumeData, null, 2)}

Return this exact JSON structure:
{
  "score": 85,
  "breakdown": {
    "keywords": "feedback on keyword usage",
    "formatting": "feedback on formatting",
    "sections": "feedback on section completeness",
    "actionVerbs": "feedback on verb strength"
  },
  "fixes": [
    "specific fix 1",
    "specific fix 2",
    "specific fix 3"
  ]
}
`;

  const text = await chat(prompt);
  return safeParseJSON(text);
};

const matchJobDescription = async (resumeData, jobDescription) => {
  const prompt = `
You are a technical recruiter and career coach.

Compare the following resume against the job description and return a detailed match analysis.

Rules:
- Match score out of 100 based on skills alignment, experience relevance, and keyword overlap
- Be specific about what is missing and what is strong
- Return only valid JSON, no markdown, no explanation

Resume data:
${JSON.stringify(resumeData, null, 2)}

Job description:
${jobDescription}

Return this exact JSON structure:
{
  "matchScore": 72,
  "matchedKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["keyword1", "keyword2"],
  "suggestions": [
    "prioritized suggestion 1",
    "prioritized suggestion 2",
    "prioritized suggestion 3"
  ]
}
`;

  const text = await chat(prompt);
  return safeParseJSON(text);
};

const generateInterviewQuestions = async (resumeData, jobTitle) => {
  const prompt = `
You are a senior technical interviewer and career coach.

Based on the following resume and target job title, generate a set of likely interview questions the candidate should prepare for.

Rules:
- Mix of behavioral, technical, and situational questions
- Questions should be specific to their experience and the job title
- Include a brief note on what the interviewer is looking for with each question
- Return only valid JSON, no markdown, no explanation

Resume data:
${JSON.stringify(resumeData, null, 2)}

Target job title: ${jobTitle}

Return this exact JSON structure:
{
  "questions": [
    {
      "category": "Technical",
      "question": "the interview question",
      "hint": "what the interviewer is looking for"
    }
  ]
}
`;

  const text = await chat(prompt);
  return safeParseJSON(text);
};

module.exports = { generateResumeContent, generateCoverLetter, analyzeATS, matchJobDescription, generateInterviewQuestions };