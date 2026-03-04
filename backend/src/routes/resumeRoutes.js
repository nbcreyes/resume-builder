const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createResume,
  getResumes,
  getResume,
  updateResume,
  deleteResume,
} = require("../controllers/resumeController");

router.use(auth);

router.route("/").get(getResumes).post(createResume);
router.route("/:id").get(getResume).put(updateResume).delete(deleteResume);

module.exports = router;