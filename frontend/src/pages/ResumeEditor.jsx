import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Button from "../components/Button";
import ResumePreview from "../components/ResumePreview";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ResumePDF from "../components/ResumePDF";

const STEPS = ["Personal Info", "Experience", "Education", "Skills", "Preview"];

const empty = {
  title: "",
  template: "classic",
  personalInfo: { fullName: "", email: "", phone: "", location: "", linkedin: "", website: "" },
  summary: "",
  experience: [],
  education: [],
  skills: [],
};

const fieldLabel = (field) =>
  field.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

const inputClass =
  "bg-surface border border-bdr rounded-lg px-3 py-2.5 text-sm text-tx-primary placeholder-tx-secondary outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all w-full";

const textareaClass =
  "bg-surface border border-bdr rounded-lg px-3 py-2.5 text-sm text-tx-primary placeholder-tx-secondary outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all w-full resize-none";

const FieldLabel = ({ children }) => (
  <label className="text-xs font-medium text-tx-secondary uppercase tracking-wider">
    {children}
  </label>
);

const ResumeEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState("");
  const autoSaveTimer = useRef(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    api.get(`/resumes/${id}`)
      .then((res) => {
        const data = res.data;
        if (!data.personalInfo) data.personalInfo = empty.personalInfo;
        setForm(data);
        if (data.shared && data.shareId) {
          setShareLink(`${window.location.origin}/r/${data.shareId}`);
        }
      })
      .catch(() => setError("Failed to load resume"))
      .finally(() => setLoading(false));
  }, [id]);

  const triggerAutoSave = useCallback((currentForm) => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(async () => {
      try {
        await api.put(`/resumes/${id}`, currentForm);
        setAutoSaved(true);
        setTimeout(() => setAutoSaved(false), 2000);
      } catch {
        // silent fail
      }
    }, 2000);
  }, [id]);

  useEffect(() => {
    if (loading) return;
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    triggerAutoSave(form);
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [form]);

  const save = async () => {
    setSaving(true);
    try {
      const res = await api.put(`/resumes/${id}`, form);
      setForm((prev) => ({
        ...prev,
        ...res.data,
        personalInfo: res.data.personalInfo || prev.personalInfo,
      }));
    } catch {
      setError("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError("");
    try {
      await api.put(`/resumes/${id}`, form);
      const res = await api.post(`/ai/resume/${id}/generate`);
      const data = res.data;
      if (!data.personalInfo) data.personalInfo = form.personalInfo;
      setForm(data);
    } catch {
      setError("AI generation failed. Try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      if (shareLink) {
        await api.delete(`/resumes/${id}/share`);
        setShareLink("");
      } else {
        const res = await api.post(`/resumes/${id}/share`);
        setShareLink(`${window.location.origin}/r/${res.data.shareId}`);
      }
    } catch {
      setError("Failed to update sharing");
    } finally {
      setSharing(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
  };

  const updatePersonalInfo = (e) =>
    setForm({ ...form, personalInfo: { ...form.personalInfo, [e.target.name]: e.target.value } });

  const updateExperience = (index, field, value) =>
    setForm({
      ...form,
      experience: form.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    });

  const addExperience = () =>
    setForm({
      ...form,
      experience: [
        ...form.experience,
        { company: "", role: "", startDate: "", endDate: "", current: false, description: "" },
      ],
    });

  const removeExperience = (index) =>
    setForm({ ...form, experience: form.experience.filter((_, i) => i !== index) });

  const updateEducation = (index, field, value) =>
    setForm({
      ...form,
      education: form.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      ),
    });

  const addEducation = () =>
    setForm({
      ...form,
      education: [
        ...form.education,
        { institution: "", degree: "", field: "", startDate: "", endDate: "" },
      ],
    });

  const removeEducation = (index) =>
    setForm({ ...form, education: form.education.filter((_, i) => i !== index) });

  const updateSkills = (value) =>
    setForm({ ...form, skills: value.split(",").map((s) => s.trim()).filter(Boolean) });

  if (loading) return <div className="text-center py-20 text-tx-secondary">Loading...</div>;
  if (!form.personalInfo) return <div className="text-center py-20 text-tx-secondary">Loading...</div>;

  return (
    <div className="flex gap-8 items-start">
      <div className="w-full max-w-xl flex-shrink-0">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <input
            className="text-xl font-bold text-tx-primary bg-transparent border-none outline-none w-full min-w-0"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Resume title"
          />
          <div className="flex items-center gap-2 flex-shrink-0">
            {autoSaved && (
              <span className="text-xs text-emerald-400 hidden sm:block">Auto-saved</span>
            )}
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>Back</Button>
            <Button variant="secondary" onClick={save} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
            <PDFDownloadLink
              document={<ResumePDF resume={form} />}
              fileName={`${form.title || "resume"}.pdf`}
            >
              {({ loading: pdfLoading }) => (
                <Button variant="primary" disabled={pdfLoading}>
                  {pdfLoading ? "..." : "Export PDF"}
                </Button>
              )}
            </PDFDownloadLink>
          </div>
        </div>

        {/* Step tabs */}
        <div className="flex gap-1 mb-6 flex-wrap">
          {STEPS.map((label, i) => (
            <button
              key={label}
              onClick={() => setStep(i)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                step === i
                  ? "bg-primary text-surface"
                  : "bg-surface-2 text-tx-secondary hover:text-tx-primary hover:bg-surface-3"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-4">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Step 0: Personal Info */}
        {step === 0 && (
          <div className="flex flex-col gap-4">
            {["fullName", "email", "phone", "location", "linkedin", "website"].map((field) => (
              <div key={field} className="flex flex-col gap-1.5">
                <FieldLabel>{fieldLabel(field)}</FieldLabel>
                <input
                  name={field}
                  value={form.personalInfo[field] || ""}
                  onChange={updatePersonalInfo}
                  className={inputClass}
                  placeholder={field === "email" ? "you@example.com" : ""}
                />
              </div>
            ))}
          </div>
        )}

        {/* Step 1: Experience */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            {form.experience.map((exp, i) => (
              <div key={i} className="bg-surface-2 border border-bdr rounded-xl p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-tx-secondary uppercase tracking-wider">
                    Experience {i + 1}
                  </span>
                  <Button variant="danger" className="text-xs py-1 px-2" onClick={() => removeExperience(i)}>
                    Remove
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {["company", "role"].map((field) => (
                    <div key={field} className="flex flex-col gap-1.5">
                      <FieldLabel>{fieldLabel(field)}</FieldLabel>
                      <input
                        value={exp[field] || ""}
                        onChange={(e) => updateExperience(i, field, e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {["startDate", "endDate"].map((field) => (
                    <div key={field} className="flex flex-col gap-1.5">
                      <FieldLabel>{fieldLabel(field)}</FieldLabel>
                      <input
                        value={exp[field] || ""}
                        onChange={(e) => updateExperience(i, field, e.target.value)}
                        placeholder="2022-01"
                        className={inputClass}
                      />
                    </div>
                  ))}
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) => updateExperience(i, "current", e.target.checked)}
                    className="accent-primary"
                  />
                  <span className="text-sm text-tx-secondary">Currently working here</span>
                </label>
                <div className="flex flex-col gap-1.5">
                  <FieldLabel>Description</FieldLabel>
                  <textarea
                    value={exp.description || ""}
                    onChange={(e) => updateExperience(i, "description", e.target.value)}
                    rows={4}
                    placeholder="Describe your responsibilities and achievements..."
                    className={textareaClass}
                  />
                </div>
              </div>
            ))}
            <Button variant="secondary" onClick={addExperience} className="w-full">
              + Add Experience
            </Button>
          </div>
        )}

        {/* Step 2: Education */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            {form.education.map((edu, i) => (
              <div key={i} className="bg-surface-2 border border-bdr rounded-xl p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-tx-secondary uppercase tracking-wider">
                    Education {i + 1}
                  </span>
                  <Button variant="danger" className="text-xs py-1 px-2" onClick={() => removeEducation(i)}>
                    Remove
                  </Button>
                </div>
                <div className="flex flex-col gap-1.5">
                  <FieldLabel>Institution</FieldLabel>
                  <input
                    value={edu.institution || ""}
                    onChange={(e) => updateEducation(i, "institution", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel>Degree</FieldLabel>
                    <input
                      value={edu.degree || ""}
                      onChange={(e) => updateEducation(i, "degree", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel>Field of Study</FieldLabel>
                    <input
                      value={edu.field || ""}
                      onChange={(e) => updateEducation(i, "field", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {["startDate", "endDate"].map((field) => (
                    <div key={field} className="flex flex-col gap-1.5">
                      <FieldLabel>{fieldLabel(field)}</FieldLabel>
                      <input
                        value={edu[field] || ""}
                        onChange={(e) => updateEducation(i, field, e.target.value)}
                        placeholder="2022-01"
                        className={inputClass}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <Button variant="secondary" onClick={addEducation} className="w-full">
              + Add Education
            </Button>
          </div>
        )}

        {/* Step 3: Skills + AI */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Skills (comma separated)</FieldLabel>
              <textarea
                value={form.skills.join(", ")}
                onChange={(e) => updateSkills(e.target.value)}
                rows={3}
                placeholder="React, Node.js, TypeScript, PostgreSQL"
                className={textareaClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Professional Summary</FieldLabel>
              <textarea
                value={form.summary || ""}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                rows={6}
                placeholder="Write a summary or use AI to generate one below..."
                className={textareaClass}
              />
            </div>
            <div className="bg-surface-2 border border-bdr rounded-xl p-4">
              <p className="text-xs text-tx-secondary mb-3">
                Let AI rewrite your experience and summary into polished professional content.
              </p>
              <Button onClick={handleGenerate} disabled={generating} className="w-full">
                {generating ? "Generating with AI..." : "Generate with AI"}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Preview + Template + Share */}
        {step === 4 && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <FieldLabel>Template</FieldLabel>
              <div className="grid grid-cols-3 gap-3">
                {["classic", "modern", "minimal"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setForm({ ...form, template: t })}
                    className={`py-3 px-4 rounded-xl border text-sm font-medium capitalize transition-all duration-200 ${
                      form.template === t
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-bdr text-tx-secondary hover:border-surface-3 hover:text-tx-primary bg-surface-2"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-surface-2 border border-bdr rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-tx-primary">Public Link</p>
                  <p className="text-xs text-tx-secondary mt-0.5">
                    Anyone with the link can view this resume
                  </p>
                </div>
                <Button
                  variant={shareLink ? "danger" : "secondary"}
                  onClick={handleShare}
                  disabled={sharing}
                  className="text-xs"
                >
                  {sharing ? "..." : shareLink ? "Disable" : "Enable Sharing"}
                </Button>
              </div>
              {shareLink && (
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={shareLink}
                    className="bg-surface border border-bdr rounded-lg px-3 py-2 text-xs text-tx-secondary flex-1 outline-none"
                  />
                  <Button variant="secondary" onClick={handleCopyLink} className="text-xs flex-shrink-0">
                    Copy
                  </Button>
                </div>
              )}
            </div>

            <Button onClick={save} disabled={saving} className="w-full">
              {saving ? "Saving..." : "Save Resume"}
            </Button>
          </div>
        )}
      </div>

      {/* Right: Live Preview */}
      <div className="hidden lg:block flex-1 sticky top-24 self-start max-h-[calc(100vh-8rem)] overflow-y-auto rounded-xl">
        <div className="text-xs text-tx-secondary uppercase tracking-wider mb-3 font-medium">
          Live Preview
        </div>
        <ResumePreview resume={form} />
      </div>
    </div>
  );
};

export default ResumeEditor;