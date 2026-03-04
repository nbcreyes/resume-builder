const Resume = require("../models/Resume");

const createResume = async (req, res) => {
  try {
    const resume = await Resume.create({ ...req.body, user: req.user.id });
    res.status(201).json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id }).sort({ updatedAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    res.json({ message: "Resume deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createResume, getResumes, getResume, updateResume, deleteResume };