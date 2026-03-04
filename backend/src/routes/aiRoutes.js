const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  generateResume,
  generateCoverLetterHandler,
  analyzeATSHandler,
  matchJobHandler,
} = require("../controllers/aiController");

router.use(auth);

router.post("/resume/:id/generate", generateResume);
router.post("/cover-letter", generateCoverLetterHandler);
router.post("/resume/:id/ats", analyzeATSHandler);
router.post("/job-match", matchJobHandler);

module.exports = router;