const mongoose = require("mongoose");

const jobMatchSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    resume: { type: mongoose.Schema.Types.ObjectId, ref: "Resume" },
    jobDescription: { type: String, required: true },
    atsScore: { type: Number, min: 0, max: 100 },
    matchedKeywords: [{ type: String }],
    missingKeywords: [{ type: String }],
    suggestions: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobMatch", jobMatchSchema);