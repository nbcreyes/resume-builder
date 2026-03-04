const mongoose = require("mongoose");

const coverLetterSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    resume: { type: mongoose.Schema.Types.ObjectId, ref: "Resume" },
    jobTitle: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CoverLetter", coverLetterSchema);