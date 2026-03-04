const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const auth = require("../middleware/auth");
const Resume = require("../models/Resume");
const {
  createResume,
  getResumes,
  getResume,
  updateResume,
  deleteResume,
} = require("../controllers/resumeController");

// Public route — no auth required
router.get("/shared/:shareId", async (req, res) => {
  try {
    const resume = await Resume.findOne({
      shareId: req.params.shareId,
      shared: true,
    });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found or no longer shared" });
    }
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// All routes below require auth
router.use(auth);

router.route("/").get(getResumes).post(createResume);
router.route("/:id").get(getResume).put(updateResume).delete(deleteResume);

router.post("/:id/share", async (req, res) => {
  try {
    const shareId = crypto.randomBytes(8).toString("hex");
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { shared: true, shareId },
      { returnDocument: "after" }
    );
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    res.json({ shareId: resume.shareId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id/share", async (req, res) => {
  try {
    await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { shared: false, shareId: null }
    );
    res.json({ message: "Sharing disabled" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;