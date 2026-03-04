import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import ResumePreview from "../components/ResumePreview";
import Spinner from "../components/Spinner";

const SharedResume = () => {
  const { shareId } = useParams();
  const [resume, setResume] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/resumes/shared/${shareId}`)
      .then((res) => setResume(res.data))
      .catch(() => setError("This resume is not available or the link has expired."))
      .finally(() => setLoading(false));
  }, [shareId]);

  if (loading) return <Spinner />;

  if (error) return (
    <div className="max-w-xl mx-auto mt-20 text-center">
      <p className="text-tx-secondary">{error}</p>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-tx-primary">{resume.title}</h1>
          <p className="text-tx-secondary text-sm mt-1">Shared resume</p>
        </div>
      </div>
      <ResumePreview resume={resume} />
    </div>
  );
};

export default SharedResume;