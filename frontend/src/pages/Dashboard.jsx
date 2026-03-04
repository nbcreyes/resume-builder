import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMessage";

const TemplateTag = ({ template }) => {
  const colors = {
    classic: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    modern: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    minimal: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };
  return (
    <span className={`text-xs border rounded-md px-2 py-0.5 capitalize ${colors[template] || colors.classic}`}>
      {template}
    </span>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchResumes = () => {
    setLoading(true);
    setError("");
    api.get("/resumes")
      .then((res) => setResumes(res.data))
      .catch(() => setError("Failed to load resumes"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchResumes(); }, []);

  const handleCreate = async () => {
    try {
      const res = await api.post("/resumes", { title: "Untitled Resume", template: "classic" });
      navigate(`/resumes/${res.data._id}/edit`);
    } catch {
      setError("Failed to create resume");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resume?")) return;
    try {
      await api.delete(`/resumes/${id}`);
      setResumes(resumes.filter((r) => r._id !== id));
    } catch {
      setError("Failed to delete resume");
    }
  };

  const handleDuplicate = async (resume) => {
    try {
      const { _id, createdAt, updatedAt, __v, ...data } = resume;
      const res = await api.post("/resumes", { ...data, title: `${resume.title} (copy)` });
      setResumes([res.data, ...resumes]);
    } catch {
      setError("Failed to duplicate resume");
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-tx-primary">
            Good to see you,{" "}
            <span className="text-gradient">{user?.name?.split(" ")[0]}</span>
          </h1>
          <p className="text-tx-secondary mt-2 text-sm">
            {resumes.length} resume{resumes.length !== 1 ? "s" : ""} in your account
          </p>
        </div>
        <Button onClick={handleCreate} className="flex-shrink-0">
          + New Resume
        </Button>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchResumes} className="mb-6" />}

      {loading ? (
        <Spinner />
      ) : resumes.length === 0 ? (
        <Card>
          <EmptyState
            title="No resumes yet"
            description="Create your first resume and let AI help you polish it into something great."
            action={<Button onClick={handleCreate}>Create your first resume</Button>}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resumes.map((resume) => (
            <div
              key={resume._id}
              className="bg-surface-2 border border-bdr rounded-xl p-5 flex flex-col justify-between gap-5 hover:border-surface-3 transition-all duration-200 group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h2 className="text-base font-semibold text-tx-primary leading-tight group-hover:text-primary transition-colors">
                    {resume.title}
                  </h2>
                  <TemplateTag template={resume.template} />
                </div>
                <p className="text-xs text-tx-secondary">
                  Updated {new Date(resume.updatedAt).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric"
                  })}
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="primary"
                  className="text-xs flex-1"
                  onClick={() => navigate(`/resumes/${resume._id}/edit`)}
                >
                  Edit
                </Button>
                <Button
                  variant="secondary"
                  className="text-xs"
                  onClick={() => handleDuplicate(resume)}
                >
                  Duplicate
                </Button>
                <Button
                  variant="danger"
                  className="text-xs"
                  onClick={() => handleDelete(resume._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;