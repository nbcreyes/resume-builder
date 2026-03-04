const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    template: { type: String, enum: ["classic", "modern", "minimal"], default: "classic" },
    shared: { type: Boolean, default: false },
    shareId: { type: String, unique: true, sparse: true },
    personalInfo: {
      fullName: String,
      email: String,
      phone: String,
      location: String,
      linkedin: String,
      website: String,
    },
    summary: { type: String },
    experience: [
      {
        company: String,
        role: String,
        startDate: String,
        endDate: String,
        current: { type: Boolean, default: false },
        description: String,
      },
    ],
    education: [
      {
        institution: String,
        degree: String,
        field: String,
        startDate: String,
        endDate: String,
      },
    ],
    skills: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);