import { useState, useEffect } from "react";
import api from "../services/api";
import Card from "../components/Card";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";

const KeywordBadge = ({ keyword, variant }) => {
  const styles = {
    matched: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    missing: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span className={`text-xs border rounded-md px-2 py-1 ${styles[variant]}`}>
      {keyword}
    </span>
  );
};

const JobMatcher = () => {
  const [resumes, setResumes] = useState([]);
  const [resumeId, setResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
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

  const handleMatch = async () => {
    if (!jobDescription.trim()) {
      setError("Please paste a job description");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/ai/job-match", { resumeId, jobDescription });
      setResult(res.data);
    } catch {
      setError("Analysis failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Spinner />;

  const scoreColor =
    result?.atsScore >= 75
      ? "#10b981"
      : result?.atsScore >= 50
      ? "#f59e0b"
      : "#ef4444";

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-tx-primary">Job Description Matcher</h1>
        <p className="text-tx-secondary mt-2 text-sm">
          Paste a job description to see how well your resume matches and what to improve.
        </p>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-tx-secondary uppercase tracking-wider">
              Select Resume
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
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-tx-secondary uppercase tracking-wider">
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={8}
              placeholder="Paste the full job description here..."
              className="bg-surface border border-bdr rounded-lg px-3 py-2.5 text-sm text-tx-primary placeholder-tx-secondary outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
            />
          </div>
          {error && <ErrorMessage message={error} />}
          <Button onClick={handleMatch} disabled={loading} className="w-full sm:w-auto">
            {loading ? "Analyzing..." : "Analyze Match"}
          </Button>
        </div>
      </Card>

      {result && (
        <div className="flex flex-col gap-5">
          <Card className="flex flex-col items-center py-10 gap-2">
            <div className="text-7xl font-display font-bold" style={{ color: scoreColor }}>
              {result.atsScore}
            </div>
            <div className="text-xs text-tx-secondary">match score out of 100</div>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Card>
              <h2 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3">
                Matched Keywords ({result.matchedKeywords.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                {result.matchedKeywords.map((kw, i) => (
                  <KeywordBadge key={i} keyword={kw} variant="matched" />
                ))}
              </div>
            </Card>
            <Card>
              <h2 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-3">
                Missing Keywords ({result.missingKeywords.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                {result.missingKeywords.map((kw, i) => (
                  <KeywordBadge key={i} keyword={kw} variant="missing" />
                ))}
              </div>
            </Card>
          </div>

          <Card>
            <h2 className="text-xs font-semibold text-tx-primary uppercase tracking-wider mb-4">
              Suggestions to Improve
            </h2>
            <ul className="flex flex-col gap-3">
              {result.suggestions.map((s, i) => (
                <li key={i} className="flex gap-3 text-sm text-tx-primary">
                  <span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
};

export default JobMatcher;