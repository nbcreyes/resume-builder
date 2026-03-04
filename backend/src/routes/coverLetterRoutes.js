const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const CoverLetter = require("../models/CoverLetter");

router.use(auth);

router.get("/", async (req, res) => {
  try {
    const letters = await CoverLetter.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(letters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const letter = await CoverLetter.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { content: req.body.content },
      { new: true }
    );
    if (!letter) return res.status(404).json({ message: "Cover letter not found" });
    res.json(letter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const letter = await CoverLetter.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!letter) return res.status(404).json({ message: "Cover letter not found" });
    res.json({ message: "Cover letter deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;