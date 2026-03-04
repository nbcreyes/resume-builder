import { useState, useEffect } from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { pdf } from "@react-pdf/renderer";
import api from "../services/api";
import Button from "../components/Button";
import Input from "../components/Input";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";

const coverLetterStyles = StyleSheet.create({
  page: {
    padding: 60,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: "#1a1a1a",
    lineHeight: 1.6,
  },
  date: { fontSize: 10, color: "#888", marginBottom: 24 },
  company: { fontSize: 12, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  re: { fontSize: 10, color: "#666", marginBottom: 24 },
  body: { lineHeight: 1.8, color: "#333" },
  signoff: { marginTop: 32, color: "#555" },
  name: { fontFamily: "Helvetica-Bold", marginTop: 24, fontSize: 12 },
});

const CoverLetterPDFDoc = ({ content, jobTitle, company, name }) => {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <Document>
      <Page size="A4" style={coverLetterStyles.page}>
        <Text style={coverLetterStyles.date}>{today}</Text>
        <Text style={coverLetterStyles.company}>{company}</Text>
        <Text style={coverLetterStyles.re}>Re: {jobTitle}</Text>
        <Text style={coverLetterStyles.body}>{content}</Text>
        <Text style={coverLetterStyles.signoff}>Sincerely,</Text>
        <Text style={coverLetterStyles.name}>{name}</Text>
      </Page>
    </Document>
  );
};

const LetterPreview = ({ content, jobTitle, company, name }) => {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
      <div className="bg-surface-2 border-b border-bdr px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
        </div>
        <span className="text-xs text-tx-secondary ml-2">
          {jobTitle && company ? `${jobTitle} at ${company}` : "Cover Letter Preview"}
        </span>
      </div>
      <div className="bg-white p-10 min-h-96 font-serif text-gray-800 text-sm leading-relaxed">
        {content ? (
          <>
            <div className="mb-8">
              <p className="font-sans text-gray-400 text-xs">{today}</p>
            </div>
            <div className="mb-6">
              <p className="font-sans font-semibold text-gray-900">{company || "Company Name"}</p>
              <p className="font-sans text-gray-500 text-xs mt-1">Re: {jobTitle || "Position"}</p>
            </div>
            <div className="whitespace-pre-wrap leading-loose text-gray-700">
              {content}
            </div>
            {name && (
              <div className="mt-8">
                <p className="font-sans text-gray-500 text-sm">Sincerely,</p>
                <p className="font-sans font-semibold text-gray-900 mt-4">{name}</p>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-300 text-sm font-sans">
            Your cover letter will appear here
          </div>
        )}
      </div>
    </div>
  );
};

const HistoryItem = ({ letter, onSelect, onDelete, selected }) => (
  <div
    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
      selected
        ? "border-primary bg-primary/5"
        : "border-bdr bg-surface-2 hover:border-surface-3"
    }`}
    onClick={() => onSelect(letter)}
  >
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <p className="text-sm font-medium text-tx-primary truncate">{letter.jobTitle}</p>
        <p className="text-xs text-tx-secondary mt-0.5">{letter.company}</p>
        <p className="text-xs text-tx-secondary mt-1">
          {new Date(letter.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(letter._id); }}
        className="text-tx-secondary hover:text-red-400 transition-colors flex-shrink-0 p-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  </div>
);

const CoverLetter = () => {
  const [resumes, setResumes] = useState([]);
  const [history, setHistory] = useState([]);
  const [form, setForm] = useState({ resumeId: "", jobTitle: "", company: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("generate");

  useEffect(() => {
    Promise.all([api.get("/resumes"), api.get("/cover-letters")])
      .then(([resumesRes, lettersRes]) => {
        setResumes(resumesRes.data);
        setHistory(lettersRes.data);
        if (resumesRes.data.length > 0) {
          setForm((f) => ({ ...f, resumeId: resumesRes.data[0]._id }));
        }
      })
      .finally(() => setFetching(false));
  }, []);

  const getResumeOwnerName = () => {
    const resume = resumes.find((r) => r._id === form.resumeId);
    return resume?.personalInfo?.fullName || "";
  };

  const getLetterOwnerName = (letter) => {
    if (!letter) return "";
    const resume = resumes.find((r) => r._id === (letter.resume?._id || letter.resume));
    return resume?.personalInfo?.fullName || "";
  };

  const handleGenerate = async () => {
    if (!form.resumeId || !form.jobTitle || !form.company) {
      setError("All fields are required");
      return;
    }
    setError("");
    setLoading(true);
    setSaved(false);
    try {
      const res = await api.post("/ai/cover-letter", form);
      setResult(res.data);
      setHistory((prev) => [res.data, ...prev]);
      setActiveTab("generate");
    } catch {
      setError("Failed to generate cover letter. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistory = (letter) => {
    setResult(letter);
    setSaved(true);
    setActiveTab("generate");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this cover letter?")) return;
    try {
      await api.delete(`/cover-letters/${id}`);
      setHistory(history.filter((l) => l._id !== id));
      if (result?._id === id) setResult(null);
    } catch {
      setError("Failed to delete");
    }
  };

  const handleSave = async () => {
    try {
      await api.put(`/cover-letters/${result._id}`, { content: result.content });
      setHistory(history.map((l) =>
        l._id === result._id ? { ...l, content: result.content } : l
      ));
      setSaved(true);
    } catch {
      setError("Failed to save");
    }
  };

  const handleExportPDF = async () => {
    if (!result) return;
    const name = getLetterOwnerName(result);
    const blob = await pdf(
      <CoverLetterPDFDoc
        content={result.content}
        jobTitle={result.jobTitle}
        company={result.company}
        name={name}
      />
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cover-letter-${result.company || "export"}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeContent = result?.content || "";
  const activeName = result ? getLetterOwnerName(result) : getResumeOwnerName();

  if (fetching) return <Spinner />;

  return (
    <div className="flex gap-8 items-start">
      {/* Left panel */}
      <div className="w-full max-w-sm flex-shrink-0">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-tx-primary">Cover Letter</h1>
          <p className="text-tx-secondary mt-1 text-sm">
            Generate and manage your cover letters.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5 bg-surface-2 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("generate")}
            className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "generate"
                ? "bg-surface text-tx-primary shadow"
                : "text-tx-secondary hover:text-tx-primary"
            }`}
          >
            Generate
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "history"
                ? "bg-surface text-tx-primary shadow"
                : "text-tx-secondary hover:text-tx-primary"
            }`}
          >
            History ({history.length})
          </button>
        </div>

        {activeTab === "generate" && (
          <div className="flex flex-col gap-4">
            <div className="bg-surface-2 border border-bdr rounded-xl p-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-tx-secondary uppercase tracking-wider">
                  Resume
                </label>
                <select
                  value={form.resumeId}
                  onChange={(e) => setForm({ ...form, resumeId: e.target.value })}
                  className="bg-surface border border-bdr rounded-lg px-3 py-2.5 text-sm text-tx-primary outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                >
                  {resumes.map((r) => (
                    <option key={r._id} value={r._id}>{r.title}</option>
                  ))}
                </select>
              </div>
              <Input
                label="Job Title"
                name="jobTitle"
                value={form.jobTitle}
                onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                placeholder="Frontend Engineer"
              />
              <Input
                label="Company"
                name="company"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="Stripe"
              />
              {error && <ErrorMessage message={error} />}
              <Button onClick={handleGenerate} disabled={loading} className="w-full">
                {loading ? "Generating..." : "Generate Cover Letter"}
              </Button>
            </div>

            {result && (
              <div className="bg-surface-2 border border-bdr rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-tx-secondary uppercase tracking-wider">
                    Edit Content
                  </p>
                  <div className="flex items-center gap-2">
                    {saved && <span className="text-xs text-emerald-400">Saved</span>}
                    <Button variant="ghost" onClick={handleExportPDF} className="text-xs py-1">
                      Export PDF
                    </Button>
                    <Button variant="secondary" onClick={handleSave} className="text-xs py-1">
                      Save
                    </Button>
                  </div>
                </div>
                <textarea
                  value={result.content}
                  onChange={(e) => {
                    setResult({ ...result, content: e.target.value });
                    setSaved(false);
                  }}
                  rows={14}
                  className="bg-surface border border-bdr rounded-lg px-3 py-2.5 text-sm text-tx-primary outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none w-full"
                />
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="flex flex-col gap-2">
            {history.length === 0 ? (
              <div className="text-center py-12 text-tx-secondary text-sm">
                No cover letters yet
              </div>
            ) : (
              history.map((letter) => (
                <HistoryItem
                  key={letter._id}
                  letter={letter}
                  onSelect={handleSelectHistory}
                  onDelete={handleDelete}
                  selected={result?._id === letter._id}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Right panel: Letter preview */}
      <div className="hidden lg:block flex-1 sticky top-24 self-start">
        <div className="text-xs text-tx-secondary uppercase tracking-wider mb-3 font-medium">
          Live Preview
        </div>
        <LetterPreview
          content={activeContent}
          jobTitle={result?.jobTitle || form.jobTitle}
          company={result?.company || form.company}
          name={activeName}
        />
      </div>
    </div>
  );
};

export default CoverLetter;