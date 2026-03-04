import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

const classicStyles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", fontSize: 10, color: "#111" },
  name: { fontSize: 18, fontFamily: "Helvetica-Bold", textAlign: "center", marginBottom: 4 },
  contact: { textAlign: "center", color: "#555", marginBottom: 12, fontSize: 9 },
  divider: { borderBottomWidth: 1, borderBottomColor: "#111", marginBottom: 10 },
  sectionTitle: { fontSize: 9, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 },
  entryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  bold: { fontFamily: "Helvetica-Bold" },
  muted: { color: "#666", fontSize: 9 },
  body: { lineHeight: 1.5, marginBottom: 8 },
  section: { marginBottom: 12 },
  skillsText: { lineHeight: 1.5 },
});

const ClassicPDF = ({ resume }) => (
  <Page size="A4" style={classicStyles.page}>
    <Text style={classicStyles.name}>{resume.personalInfo?.fullName}</Text>
    <Text style={classicStyles.contact}>
      {[resume.personalInfo?.email, resume.personalInfo?.phone, resume.personalInfo?.location]
        .filter(Boolean)
        .join("  |  ")}
    </Text>
    <View style={classicStyles.divider} />

    {resume.summary && (
      <View style={classicStyles.section}>
        <Text style={classicStyles.sectionTitle}>Summary</Text>
        <Text style={classicStyles.body}>{resume.summary}</Text>
      </View>
    )}

    {resume.experience?.length > 0 && (
      <View style={classicStyles.section}>
        <Text style={classicStyles.sectionTitle}>Experience</Text>
        {resume.experience.map((exp, i) => (
          <View key={i} style={{ marginBottom: 8 }}>
            <View style={classicStyles.entryRow}>
              <Text style={classicStyles.bold}>{exp.role}</Text>
              <Text style={classicStyles.muted}>
                {exp.startDate} — {exp.current ? "Present" : exp.endDate}
              </Text>
            </View>
            <Text style={classicStyles.muted}>{exp.company}</Text>
            <Text style={{ lineHeight: 1.5, marginTop: 2 }}>{exp.description}</Text>
          </View>
        ))}
      </View>
    )}

    {resume.education?.length > 0 && (
      <View style={classicStyles.section}>
        <Text style={classicStyles.sectionTitle}>Education</Text>
        {resume.education.map((edu, i) => (
          <View key={i} style={{ marginBottom: 6 }}>
            <View style={classicStyles.entryRow}>
              <Text style={classicStyles.bold}>{edu.institution}</Text>
              <Text style={classicStyles.muted}>
                {edu.startDate} — {edu.endDate}
              </Text>
            </View>
            <Text style={classicStyles.muted}>
              {edu.degree} {edu.field && `in ${edu.field}`}
            </Text>
          </View>
        ))}
      </View>
    )}

    {resume.skills?.length > 0 && (
      <View style={classicStyles.section}>
        <Text style={classicStyles.sectionTitle}>Skills</Text>
        <Text style={classicStyles.skillsText}>{resume.skills.join(", ")}</Text>
      </View>
    )}
  </Page>
);

const modernStyles = StyleSheet.create({
  page: { flexDirection: "row", fontFamily: "Helvetica", fontSize: 10 },
  sidebar: { width: "33%", backgroundColor: "#2563eb", color: "#fff", padding: 24 },
  main: { flex: 1, padding: 24 },
  name: { fontSize: 16, fontFamily: "Helvetica-Bold", marginBottom: 12, color: "#fff" },
  sideLabel: { fontSize: 8, textTransform: "uppercase", letterSpacing: 1.5, opacity: 0.7, marginBottom: 6 },
  sideText: { fontSize: 9, marginBottom: 3, color: "#fff" },
  sideSection: { marginBottom: 16 },
  sectionTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 1.5, color: "#2563eb", marginBottom: 6 },
  entryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  bold: { fontFamily: "Helvetica-Bold" },
  muted: { color: "#666", fontSize: 9 },
  section: { marginBottom: 14 },
});

const ModernPDF = ({ resume }) => (
  <Page size="A4" style={modernStyles.page}>
    <View style={modernStyles.sidebar}>
      <Text style={modernStyles.name}>{resume.personalInfo?.fullName}</Text>
      <View style={modernStyles.sideSection}>
        {resume.personalInfo?.email && <Text style={modernStyles.sideText}>{resume.personalInfo.email}</Text>}
        {resume.personalInfo?.phone && <Text style={modernStyles.sideText}>{resume.personalInfo.phone}</Text>}
        {resume.personalInfo?.location && <Text style={modernStyles.sideText}>{resume.personalInfo.location}</Text>}
        {resume.personalInfo?.linkedin && <Text style={modernStyles.sideText}>{resume.personalInfo.linkedin}</Text>}
      </View>
      {resume.skills?.length > 0 && (
        <View style={modernStyles.sideSection}>
          <Text style={modernStyles.sideLabel}>Skills</Text>
          {resume.skills.map((s, i) => <Text key={i} style={modernStyles.sideText}>{s}</Text>)}
        </View>
      )}
      {resume.education?.length > 0 && (
        <View style={modernStyles.sideSection}>
          <Text style={modernStyles.sideLabel}>Education</Text>
          {resume.education.map((edu, i) => (
            <View key={i} style={{ marginBottom: 6 }}>
              <Text style={{ ...modernStyles.sideText, fontFamily: "Helvetica-Bold" }}>{edu.institution}</Text>
              <Text style={modernStyles.sideText}>{edu.degree} {edu.field && `in ${edu.field}`}</Text>
              <Text style={{ ...modernStyles.sideText, opacity: 0.6, fontSize: 8 }}>{edu.startDate} — {edu.endDate}</Text>
            </View>
          ))}
        </View>
      )}
    </View>

    <View style={modernStyles.main}>
      {resume.summary && (
        <View style={modernStyles.section}>
          <Text style={modernStyles.sectionTitle}>Summary</Text>
          <Text style={{ lineHeight: 1.5 }}>{resume.summary}</Text>
        </View>
      )}
      {resume.experience?.length > 0 && (
        <View style={modernStyles.section}>
          <Text style={modernStyles.sectionTitle}>Experience</Text>
          {resume.experience.map((exp, i) => (
            <View key={i} style={{ marginBottom: 8 }}>
              <View style={modernStyles.entryRow}>
                <Text style={modernStyles.bold}>{exp.role}</Text>
                <Text style={modernStyles.muted}>
                  {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                </Text>
              </View>
              <Text style={{ color: "#2563eb", fontSize: 9, marginBottom: 2 }}>{exp.company}</Text>
              <Text style={{ lineHeight: 1.5 }}>{exp.description}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  </Page>
);

const minimalStyles = StyleSheet.create({
  page: { padding: 48, fontFamily: "Helvetica", fontSize: 10, color: "#333" },
  name: { fontSize: 22, fontFamily: "Helvetica", fontWeight: 300, marginBottom: 6 },
  contact: { fontSize: 9, color: "#888", marginBottom: 24 },
  sectionTitle: { fontSize: 8, textTransform: "uppercase", letterSpacing: 2, color: "#aaa", marginBottom: 10 },
  row: { flexDirection: "row", marginBottom: 14 },
  dateCol: { width: "25%", fontSize: 9, color: "#aaa", paddingTop: 1 },
  contentCol: { flex: 1 },
  bold: { fontFamily: "Helvetica-Bold", fontSize: 10, marginBottom: 2 },
  body: { lineHeight: 1.6, color: "#555" },
  section: { marginBottom: 20 },
  skillsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  skillBadge: { fontSize: 9, borderWidth: 1, borderColor: "#ccc", paddingHorizontal: 6, paddingVertical: 2, marginRight: 4, marginBottom: 4 },
});

const MinimalPDF = ({ resume }) => (
  <Page size="A4" style={minimalStyles.page}>
    <Text style={minimalStyles.name}>{resume.personalInfo?.fullName}</Text>
    <Text style={minimalStyles.contact}>
      {[resume.personalInfo?.email, resume.personalInfo?.phone, resume.personalInfo?.location]
        .filter(Boolean)
        .join("  ·  ")}
    </Text>

    {resume.summary && (
      <View style={minimalStyles.section}>
        <Text style={{ lineHeight: 1.6, color: "#666" }}>{resume.summary}</Text>
      </View>
    )}

    {resume.experience?.length > 0 && (
      <View style={minimalStyles.section}>
        <Text style={minimalStyles.sectionTitle}>Experience</Text>
        {resume.experience.map((exp, i) => (
          <View key={i} style={minimalStyles.row}>
            <Text style={minimalStyles.dateCol}>
              {exp.startDate} —{"\n"}{exp.current ? "Now" : exp.endDate}
            </Text>
            <View style={minimalStyles.contentCol}>
              <Text style={minimalStyles.bold}>{exp.role}, {exp.company}</Text>
              <Text style={minimalStyles.body}>{exp.description}</Text>
            </View>
          </View>
        ))}
      </View>
    )}

    {resume.education?.length > 0 && (
      <View style={minimalStyles.section}>
        <Text style={minimalStyles.sectionTitle}>Education</Text>
        {resume.education.map((edu, i) => (
          <View key={i} style={minimalStyles.row}>
            <Text style={minimalStyles.dateCol}>
              {edu.startDate} —{"\n"}{edu.endDate}
            </Text>
            <View style={minimalStyles.contentCol}>
              <Text style={minimalStyles.bold}>{edu.institution}</Text>
              <Text style={{ color: "#666", fontSize: 9 }}>{edu.degree} {edu.field && `in ${edu.field}`}</Text>
            </View>
          </View>
        ))}
      </View>
    )}

    {resume.skills?.length > 0 && (
      <View style={minimalStyles.section}>
        <Text style={minimalStyles.sectionTitle}>Skills</Text>
        <View style={minimalStyles.skillsWrap}>
          {resume.skills.map((s, i) => (
            <Text key={i} style={minimalStyles.skillBadge}>{s}</Text>
          ))}
        </View>
      </View>
    )}
  </Page>
);

const ResumePDF = ({ resume }) => {
  const templates = { classic: ClassicPDF, modern: ModernPDF, minimal: MinimalPDF };
  const Template = templates[resume.template] || ClassicPDF;

  return (
    <Document>
      <Template resume={resume} />
    </Document>
  );
};

export default ResumePDF;