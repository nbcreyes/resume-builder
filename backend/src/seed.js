require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");
const Resume = require("./models/Resume");

const seed = async () => {
  await connectDB();

  await User.deleteMany();
  await Resume.deleteMany();

  const password = await bcrypt.hash("password123", 10);

  const user = await User.create({
    name: "Jane Smith",
    email: "jane@example.com",
    password,
    role: "user",
  });

  await Resume.create({
    user: user._id,
    title: "Software Engineer Resume",
    template: "modern",
    personalInfo: {
      fullName: "Jane Smith",
      email: "jane@example.com",
      phone: "555-123-4567",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/janesmith",
      website: "janesmith.dev",
    },
    summary:
      "Software engineer with 4 years of experience building scalable web applications using React, Node.js, and cloud infrastructure.",
    experience: [
      {
        company: "Acme Corp",
        role: "Frontend Engineer",
        startDate: "2021-06",
        endDate: "",
        current: true,
        description:
          "Built and maintained React component library used across 5 product teams. Reduced page load time by 40% through code splitting and lazy loading.",
      },
      {
        company: "Startup XYZ",
        role: "Junior Developer",
        startDate: "2019-08",
        endDate: "2021-05",
        current: false,
        description:
          "Developed REST APIs in Node.js and Express. Integrated third-party payment and authentication services.",
      },
    ],
    education: [
      {
        institution: "University of California, Berkeley",
        degree: "Bachelor of Science",
        field: "Computer Science",
        startDate: "2015-09",
        endDate: "2019-05",
      },
    ],
    skills: ["React", "Node.js", "TypeScript", "MongoDB", "PostgreSQL", "AWS", "Docker", "Git"],
  });

  console.log("Database seeded successfully");
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});