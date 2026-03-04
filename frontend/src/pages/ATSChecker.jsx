import { useState, useEffect } from "react";
import api from "../services/api";
import Card from "../components/Card";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";

const ScoreRing = ({ score }) => {
  const color =
    score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
  const label =
    score >= 75 ? "Strong" : score >= 50 ? "Fair" : "Weak";

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="text-7xl font-display font-bold"
        style={{ color }}
      >
        {score}
      </div>
      <div className="text-xs text-tx-secondary">out of 100</div>
      <span
        className="text-xs font-medium px-3 py-1 rounded-full border"
        style={{
          color,
          borderColor: `${color}40`,
          backgroundColor: `${color}15`,
        }}
      >
        {label}
      </span>
    </div>
  );
};

const ATSChecker = () => {
  const [resumes, setResumes] = useState([]);
  const [resumeId, setResumeId] = useState("");
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

  const handleAnalyze = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await api.post(`/ai/resume/${resumeId}/ats`);
      setResult(res.data);
    } catch {
      setError("Analysis failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Spinner />;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-tx-primary">ATS Score Checker</h1>
        <p className="text-tx-secondary mt-2 text-sm">
          Analyze your resume for ATS compatibility and get actionable fixes.
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
          {error && <ErrorMessage message={error} />}
          <Button onClick={handleAnalyze} disabled={loading} className="w-full sm:w-auto">
            {loading ? "Analyzing..." : "Analyze Resume"}
          </Button>
        </div>
      </Card>

      {result && (
        <div className="flex flex-col gap-5">
          <Card className="flex items-center justify-center py-10">
            <ScoreRing score={result.score} />
          </Card>

          <Card>
            <h2 className="text-sm font-semibold text-tx-primary uppercase tracking-wider mb-4">
              Score Breakdown
            </h2>
            <div className="flex flex-col divide-y divide-border">
              {Object.entries(result.breakdown).map(([key, value]) => (
                <div key={key} className="py-3 first:pt-0 last:pb-0">
                  <p className="text-xs font-medium text-tx-secondary uppercase tracking-wider mb-1 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </p>
                  <p className="text-sm text-tx-primary">{value}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold text-tx-primary uppercase tracking-wider mb-4">
              Recommended Fixes
            </h2>
            <ul className="flex flex-col gap-3">
              {result.fixes.map((fix, i) => (
                <li key={i} className="flex gap-3 text-sm text-tx-primary">
                  <span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {fix}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ATSChecker;