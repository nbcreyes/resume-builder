ResumeAI
An AI-powered resume builder that helps you create, polish, and optimize your resume using large language models.
Live Demo: https://resume-builder-theta-orcin-36.vercel.app

Features

AI Resume Generation — Fill in your raw experience and skills, and AI rewrites it into polished professional content
Cover Letter Generator — Generate tailored cover letters based on your resume and target role, with live document preview and PDF export
ATS Score Checker — Analyze your resume for ATS compatibility with a score out of 100, detailed breakdown, and actionable fixes
Job Description Matcher — Paste a job description to get a match score, matched keywords, missing keywords, and prioritized suggestions
Interview Prep — Generate likely interview questions categorized by type (Technical, Behavioral, Situational) with hints on what interviewers are looking for
Resume Sharing — Generate a public link to share your resume without requiring login
PDF Export — Export any resume template or cover letter to a clean downloadable PDF
Auto-save — Resume editor auto-saves 2 seconds after you stop typing
3 Resume Templates — Classic, Modern, and Minimal with live preview


Tech Stack
Backend

Node.js + Express
MongoDB Atlas + Mongoose
JSON Web Tokens (JWT)
Groq API (LLaMA 3.3 70B)

Frontend

React + Vite
Tailwind CSS
React Router
Axios
@react-pdf/renderer


Project Structure
resume-builder/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── resumeController.js
│   │   │   └── aiController.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Resume.js
│   │   │   ├── CoverLetter.js
│   │   │   └── JobMatch.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── resumeRoutes.js
│   │   │   ├── aiRoutes.js
│   │   │   └── coverLetterRoutes.js
│   │   ├── services/
│   │   │   └── ai.js
│   │   └── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Button.jsx
    │   │   ├── Card.jsx
    │   │   ├── Input.jsx
    │   │   ├── Layout.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── ResumePreview.jsx
    │   │   ├── ResumePDF.jsx
    │   │   ├── Spinner.jsx
    │   │   ├── EmptyState.jsx
    │   │   └── ErrorMessage.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── ResumeEditor.jsx
    │   │   ├── CoverLetter.jsx
    │   │   ├── ATSChecker.jsx
    │   │   ├── JobMatcher.jsx
    │   │   ├── InterviewPrep.jsx
    │   │   └── SharedResume.jsx
    │   ├── services/
    │   │   └── api.js
    │   └── main.jsx
    └── package.json

Local Setup
Prerequisites

Node.js 18+
MongoDB Atlas account
Groq API key (free at console.groq.com)

1. Clone the repo
bashgit clone https://github.com/your-username/resume-builder.git
cd resume-builder
2. Backend setup
bashcd backend
npm install
Create backend/.env:
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
Start the backend:
bashnpm run dev
3. Frontend setup
bashcd frontend
npm install
Create frontend/.env:
VITE_API_URL=http://localhost:5000/api
Start the frontend:
bashnpm run dev
4. Seed the database (optional)
bashcd backend
npm run seed
This creates a test user (jane@example.com / password123) with a sample resume.

Environment Variables
Backend
VariableDescriptionPORTServer port (default: 5000)MONGO_URIMongoDB Atlas connection stringJWT_SECRETSecret key for signing JWTsGROQ_API_KEYGroq API key for AI features
Frontend
VariableDescriptionVITE_API_URLBackend API base URL

API Endpoints
Auth
MethodEndpointDescriptionPOST/api/auth/registerRegister a new userPOST/api/auth/loginLogin and receive JWTGET/api/auth/meGet current user (protected)
Resumes
MethodEndpointDescriptionGET/api/resumesGet all resumes for current userPOST/api/resumesCreate a new resumeGET/api/resumes/:idGet a single resumePUT/api/resumes/:idUpdate a resumeDELETE/api/resumes/:idDelete a resumeGET/api/resumes/shared/:shareIdGet a public shared resumePOST/api/resumes/:id/shareEnable sharingDELETE/api/resumes/:id/shareDisable sharing
AI
MethodEndpointDescriptionPOST/api/ai/resume/:id/generateGenerate polished resume contentPOST/api/ai/cover-letterGenerate a cover letterPOST/api/ai/resume/:id/atsRun ATS analysisPOST/api/ai/job-matchMatch resume against job descriptionPOST/api/ai/interview-questionsGenerate interview questions
Cover Letters
MethodEndpointDescriptionGET/api/cover-lettersGet all cover lettersPUT/api/cover-letters/:idUpdate a cover letterDELETE/api/cover-letters/:idDelete a cover letter

Deployment
Backend: Deployed on Railway

Set all environment variables in the Railway dashboard
Railway auto-deploys on every push to main

Frontend: Deployed on Vercel

Set VITE_API_URL to your Railway backend URL
Vercel auto-deploys on every push to main


AI Prompt Engineering
All AI features are powered by LLaMA 3.3 70B via Groq. Each feature uses a structured prompt that:

Assigns a specific expert role to the model (resume writer, ATS expert, technical recruiter)
Provides the full resume data as structured JSON
Specifies exact output format with a JSON schema example
Instructs the model to return only valid JSON with no markdown or explanation

This approach produces consistent, parseable output that can be directly saved to the database and rendered in the UI without post-processing.