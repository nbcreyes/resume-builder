import { useState, useEffect } from "react";
import api from "../services/api";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";

const categoryColors = {
  Technical: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Behavioral: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Situational: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const QuestionCard = ({ item, index }) => {
  const [open, setOpen] = useState(false);
  const colorClass = categoryColors[item.category] || "bg-surface-3 text-tx-secondary border-bdr";

  return (
    <div className="bg-surface-2 border border-bdr rounded-xl overflow-hidden transition-all duration-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-start gap-4 text-left hover:bg-surface-3 transition-colors"
      >
        <span className="text-xs font-bold text-tx-secondary mt-0.5 flex-shrink-0 w-5">
          {index + 1}.
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-xs border rounded-md px-2 py-0.5 ${colorClass}`}>
              {item.category}
            </span>
          </div>
          <p className="text-sm text-tx-primary font-medium leading-relaxed">{item.question}</p>
        </div>
        <svg
          className={`w-4 h-4 text-tx-secondary flex-shrink-0 mt-0.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-4 pt-0 ml-9">
          <div className="bg-surface border border-bdr rounded-lg px-4 py-3">
            <p className="text-xs text-tx-secondary uppercase tracking-wider font-medium mb-1">
              What they're looking for
            </p>
            <p className="text-sm text-tx-primary leading-relaxed">{item.hint}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const InterviewPrep = () => {
  const [resumes, setResumes] = useState([]);
  const [resumeId, setResumeId] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/resumes")
      .then((res) => {
        setResumes(res.data);
        if (res.data.length > 0) setResumeId(res.data[0]._id);
      })
      .finally(() => setFetching(false));
  }, []);

  const handleGenerate = async () => {
    if (!jobTitle.trim()) {
      setError("Job title is required");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/ai/interview-questions", { resumeId, jobTitle });
      setQuestions(res.data.questions);
    } catch {
      setError("Failed to generate questions. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const grouped = questions.reduce((acc, q) => {
    if (!acc[q.category]) acc[q.category] = [];
    acc[q.category].push(q);
    return acc;
  }, {});

  if (fetching) return <Spinner />;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-tx-primary">Interview Prep</h1>
        <p className="text-tx-secondary mt-2 text-sm">
          Generate likely interview questions based on your resume and target role.
        </p>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-tx-secondary uppercase tracking-wider">
              Resume
            </label>
            <select
              value={resumeId}
              onChange={(e) => setResumeId(e.target.value)}
              className="bg-surface border border-bdr rounded-lg px-3 py-2.5 text-sm text-tx-primary outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            >
              {resumes.map((r) => (
                <option key={r._id} value={r._id}>{r.title}</option>
              ))}
            </select>
          </div>
          <Input
            label="Target Job Title"
            name="jobTitle"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Senior Frontend Engineer"
          />
          {error && <ErrorMessage message={error} />}
          <Button onClick={handleGenerate} disabled={loading} className="w-full sm:w-auto">
            {loading ? "Generating questions..." : "Generate Questions"}
          </Button>
        </div>
      </Card>

      {questions.length > 0 && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-tx-secondary">
              {questions.length} questions generated for{" "}
              <span className="text-tx-primary font-medium">{jobTitle}</span>
            </p>
            <div className="flex gap-2">
              {Object.keys(grouped).map((cat) => (
                <span
                  key={cat}
                  className={`text-xs border rounded-md px-2 py-0.5 ${categoryColors[cat] || "bg-surface-3 text-tx-secondary border-bdr"}`}
                >
                  {cat} ({grouped[cat].length})
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {questions.map((item, i) => (
              <QuestionCard key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPrep;