const Resume = require("../models/Resume");
const CoverLetter = require("../models/CoverLetter");
const JobMatch = require("../models/JobMatch");
const {
  generateResumeContent,
  generateCoverLetter,
  analyzeATS,
  matchJobDescription,
  generateInterviewQuestions,
} = require("../services/ai");

const withTimeout = (promise, ms = 30000) => {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("AI request timed out. Please try again.")), ms)
  );
  return Promise.race([promise, timeout]);
};

const generateResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    const generated = await withTimeout(
      generateResumeContent({
        experience: resume.experience,
        skills: resume.skills,
        personalInfo: resume.personalInfo,
      })
    );

    const updated = await Resume.findOneAndUpdate(
      { _id: resume._id },
      {
        summary: generated.summary,
        experience: generated.experience,
        skills: generated.skills,
      },
      { returnDocument: "after" }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generateCoverLetterHandler = async (req, res) => {
  try {
    const { resumeId, jobTitle, company } = req.body;

    const resume = await Resume.findOne({ _id: resumeId, user: req.user.id });
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    const content = await withTimeout(generateCoverLetter(resume, jobTitle, company));

    const coverLetter = await CoverLetter.create({
      user: req.user.id,
      resume: resumeId,
      jobTitle,
      company,
      content,
    });

    res.status(201).json(coverLetter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const analyzeATSHandler = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    const analysis = await withTimeout(analyzeATS(resume));

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const matchJobHandler = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;

    const resume = await Resume.findOne({ _id: resumeId, user: req.user.id });
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    const result = await withTimeout(matchJobDescription(resume, jobDescription));

    const jobMatch = await JobMatch.create({
      user: req.user.id,
      resume: resumeId,
      jobDescription,
      atsScore: result.matchScore,
      matchedKeywords: result.matchedKeywords,
      missingKeywords: result.missingKeywords,
      suggestions: result.suggestions,
    });

    res.json(jobMatch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generateInterviewQuestionsHandler = async (req, res) => {
  try {
    const { resumeId, jobTitle } = req.body;
    if (!jobTitle) return res.status(400).json({ message: "Job title is required" });

    const resume = await Resume.findOne({ _id: resumeId, user: req.user.id });
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    const result = await withTimeout(generateInterviewQuestions(resume, jobTitle));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateResume,
  generateCoverLetterHandler,
  analyzeATSHandler,
  matchJobHandler,
  generateInterviewQuestionsHandler,
};