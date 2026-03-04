const Classic = ({ resume }) => (
  <div className="font-serif text-gray-900 p-8 bg-white min-h-full text-sm">
    <div className="text-center border-b-2 border-gray-900 pb-4 mb-5">
      <h1 className="text-2xl font-bold">{resume.personalInfo?.fullName}</h1>
      <p className="text-sm mt-1 text-gray-500">
        {[resume.personalInfo?.email, resume.personalInfo?.phone, resume.personalInfo?.location]
          .filter(Boolean)
          .join(" | ")}
      </p>
      {(resume.personalInfo?.linkedin || resume.personalInfo?.website) && (
        <p className="text-sm text-gray-500 mt-0.5">
          {[resume.personalInfo?.linkedin, resume.personalInfo?.website].filter(Boolean).join(" | ")}
        </p>
      )}
    </div>
    {resume.summary && (
      <div className="mb-5">
        <h2 className="text-xs font-bold uppercase tracking-widest mb-2 text-gray-700">Summary</h2>
        <p className="leading-relaxed text-gray-800">{resume.summary}</p>
      </div>
    )}
    {resume.experience?.length > 0 && (
      <div className="mb-5">
        <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-gray-700">Experience</h2>
        {resume.experience.map((exp, i) => (
          <div key={i} className="mb-4">
            <div className="flex justify-between items-baseline">
              <span className="font-bold">{exp.role}</span>
              <span className="text-xs text-gray-400">
                {exp.startDate} — {exp.current ? "Present" : exp.endDate}
              </span>
            </div>
            <p className="text-gray-600 text-xs mb-1">{exp.company}</p>
            <p className="leading-relaxed text-gray-700">{exp.description}</p>
          </div>
        ))}
      </div>
    )}
    {resume.education?.length > 0 && (
      <div className="mb-5">
        <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-gray-700">Education</h2>
        {resume.education.map((edu, i) => (
          <div key={i} className="mb-3">
            <div className="flex justify-between items-baseline">
              <span className="font-bold">{edu.institution}</span>
              <span className="text-xs text-gray-400">{edu.startDate} — {edu.endDate}</span>
            </div>
            <p className="text-gray-600 text-xs">
              {edu.degree} {edu.field && `in ${edu.field}`}
            </p>
          </div>
        ))}
      </div>
    )}
    {resume.skills?.length > 0 && (
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest mb-2 text-gray-700">Skills</h2>
        <p className="text-gray-700 leading-relaxed">{resume.skills.join(", ")}</p>
      </div>
    )}
  </div>
);

const Modern = ({ resume }) => (
  <div className="flex bg-white min-h-full text-sm">
    <div className="w-2/5 bg-slate-800 text-white p-6 flex flex-col gap-5">
      <div>
        <h1 className="text-lg font-bold leading-tight">{resume.personalInfo?.fullName}</h1>
      </div>
      <div className="flex flex-col gap-1.5 text-xs text-slate-300">
        {resume.personalInfo?.email && <p>{resume.personalInfo.email}</p>}
        {resume.personalInfo?.phone && <p>{resume.personalInfo.phone}</p>}
        {resume.personalInfo?.location && <p>{resume.personalInfo.location}</p>}
        {resume.personalInfo?.linkedin && <p>{resume.personalInfo.linkedin}</p>}
        {resume.personalInfo?.website && <p>{resume.personalInfo.website}</p>}
      </div>
      {resume.skills?.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-2 text-slate-400">Skills</h2>
          <div className="flex flex-col gap-1">
            {resume.skills.map((skill, i) => (
              <span key={i} className="text-xs text-slate-300">{skill}</span>
            ))}
          </div>
        </div>
      )}
      {resume.education?.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-2 text-slate-400">Education</h2>
          {resume.education.map((edu, i) => (
            <div key={i} className="mb-3">
              <p className="font-semibold text-xs">{edu.institution}</p>
              <p className="text-slate-400 text-xs">{edu.degree} {edu.field && `in ${edu.field}`}</p>
              <p className="text-slate-500 text-xs">{edu.startDate} — {edu.endDate}</p>
            </div>
          ))}
        </div>
      )}
    </div>
    <div className="flex-1 p-6 flex flex-col gap-5">
      {resume.summary && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-700 mb-2">Summary</h2>
          <p className="leading-relaxed text-gray-700">{resume.summary}</p>
        </div>
      )}
      {resume.experience?.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-700 mb-3">Experience</h2>
          {resume.experience.map((exp, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-gray-900">{exp.role}</span>
                <span className="text-xs text-gray-400">
                  {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mb-1">{exp.company}</p>
              <p className="leading-relaxed text-gray-700">{exp.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

const Minimal = ({ resume }) => (
  <div className="bg-white p-10 text-gray-800 min-h-full text-sm">
    <div className="mb-8">
      <h1 className="text-3xl font-light tracking-tight text-gray-900">{resume.personalInfo?.fullName}</h1>
      <p className="text-xs text-gray-400 mt-2 tracking-wide">
        {[resume.personalInfo?.email, resume.personalInfo?.phone, resume.personalInfo?.location]
          .filter(Boolean)
          .join("  ·  ")}
      </p>
    </div>
    {resume.summary && (
      <div className="mb-8">
        <p className="leading-loose text-gray-600">{resume.summary}</p>
      </div>
    )}
    {resume.experience?.length > 0 && (
      <div className="mb-8">
        <h2 className="text-xs uppercase tracking-widest text-gray-300 mb-4">Experience</h2>
        {resume.experience.map((exp, i) => (
          <div key={i} className="mb-5 grid grid-cols-4 gap-4">
            <div className="text-xs text-gray-400 leading-relaxed">
              {exp.startDate}<br />— {exp.current ? "Now" : exp.endDate}
            </div>
            <div className="col-span-3">
              <p className="font-medium text-gray-900">{exp.role}, {exp.company}</p>
              <p className="text-gray-500 mt-1 leading-relaxed">{exp.description}</p>
            </div>
          </div>
        ))}
      </div>
    )}
    {resume.education?.length > 0 && (
      <div className="mb-8">
        <h2 className="text-xs uppercase tracking-widest text-gray-300 mb-4">Education</h2>
        {resume.education.map((edu, i) => (
          <div key={i} className="mb-4 grid grid-cols-4 gap-4">
            <div className="text-xs text-gray-400 leading-relaxed">
              {edu.startDate}<br />— {edu.endDate}
            </div>
            <div className="col-span-3">
              <p className="font-medium text-gray-900">{edu.institution}</p>
              <p className="text-gray-500 text-xs">{edu.degree} {edu.field && `in ${edu.field}`}</p>
            </div>
          </div>
        ))}
      </div>
    )}
    {resume.skills?.length > 0 && (
      <div>
        <h2 className="text-xs uppercase tracking-widest text-gray-300 mb-4">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {resume.skills.map((skill, i) => (
            <span key={i} className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-600">
              {skill}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
);

const ResumePreview = ({ resume }) => {
  const templates = { classic: Classic, modern: Modern, minimal: Minimal };
  const Template = templates[resume.template] || Classic;

  return (
    <div className="rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
      <div className="bg-surface-2 border-b border-bdr px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
        </div>
        <span className="text-xs text-tx-secondary ml-2 capitalize">{resume.template} template</span>
      </div>
      <div className="bg-white" style={{ minHeight: "700px" }}>
        <Template resume={resume} />
      </div>
    </div>
  );
};

export default ResumePreview;