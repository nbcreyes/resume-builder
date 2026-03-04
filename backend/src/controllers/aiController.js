const Resume = require("../models/Resume");
const CoverLetter = require("../models/CoverLetter");
const JobMatch = require("../models/JobMatch");
const {
  generateResumeContent,
  generateCoverLetter,
  analyzeATS,
  matchJobDescription,
} = require("../services/gemini");

const generateResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    const generated = await generateResumeContent({
      experience: resume.experience,
      skills: resume.skills,
      personalInfo: resume.personalInfo,
    });

    const updated = await Resume.findByIdAndUpdate(
      resume._id,
      {
        summary: generated.summary,
        experience: generated.experience,
        skills: generated.skills,
      },
      { new: true }
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

    const content = await generateCoverLetter(resume, jobTitle, company);

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

    const analysis = await analyzeATS(resume);

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

    const result = await matchJobDescription(resume, jobDescription);

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

module.exports = {
  generateResume,
  generateCoverLetterHandler,
  analyzeATSHandler,
  matchJobHandler,
};