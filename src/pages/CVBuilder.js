import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CVBuilder() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("rewrite");
  const [jobDescription, setJobDescription] = useState("");
  const [existingCV, setExistingCV] = useState("");
  const [loading, setLoading] = useState(false);
  const [cvData, setCvData] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "", email: "", phone: "", location: "",
    linkedin: "", summary: "", experience: "", education: "", skills: ""
  });

  const handleGenerate = async () => {
    if (!jobDescription) {
      alert("Please paste the job description");
      return;
    }
    if (mode === "rewrite" && !existingCV) {
      alert("Please paste your existing CV text");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/cv-builder/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, existingCV, userDetails, mode })
      });
      const data = await res.json();
      if (data.error) {
        alert("Error: " + data.error);
      } else {
        setCvData(data.cvData);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
    setLoading(false);
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/cv-builder/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvData })
      });
      const data = await res.json();

      // Create HTML blob and download
      const blob = new Blob([data.html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${cvData.name || "CV"}_CareerUpdater.html`;
      a.click();

      // Also open print dialog for PDF
      const win = window.open(url, "_blank");
      setTimeout(() => {
        win.print();
      }, 1000);

    } catch (err) {
      alert("Download error: " + err.message);
    }
    setDownloading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7f5",
      fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Header */}
      <div style={{ background: "white", padding: "16px 32px", display: "flex",
        justifyContent: "space-between", alignItems: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 24 }}>🚀</span>
          <span style={{ fontSize: 20, fontWeight: "bold", color: "#1a237e" }}>CareerUpdater</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => navigate("/dashboard")}
            style={{ padding: "8px 16px", background: "#e8eaf6", color: "#1a237e",
              border: "none", borderRadius: 20, cursor: "pointer", fontWeight: "bold" }}>
            ← Dashboard
          </button>
          <button onClick={() => { localStorage.clear(); navigate("/"); }}
            style={{ padding: "8px 16px", background: "#c62828", color: "white",
              border: "none", borderRadius: 20, cursor: "pointer", fontWeight: "bold" }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "30px auto", padding: "0 20px" }}>

        {/* Title */}
        <div style={{ background: "linear-gradient(135deg, #1a237e, #283593)",
          borderRadius: 16, padding: 30, marginBottom: 24, color: "white", textAlign: "center" }}>
          <h2 style={{ margin: "0 0 8px" }}>📄 AI CV Builder</h2>
          <p style={{ opacity: 0.9, margin: 0 }}>
            Create an ATS-optimized CV tailored to any job in seconds
          </p>
        </div>

        {/* Mode Selector */}
        <div style={{ background: "white", borderRadius: 16, padding: 24,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)", marginBottom: 24 }}>
          <h3 style={{ color: "#1a237e", marginBottom: 16 }}>Choose Your Option</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => setMode("rewrite")}
              style={{ flex: 1, padding: 16, borderRadius: 12, cursor: "pointer",
                border: mode === "rewrite" ? "2px solid #1a237e" : "2px solid #e0e0e0",
                background: mode === "rewrite" ? "#e8eaf6" : "white",
                color: mode === "rewrite" ? "#1a237e" : "#666", fontWeight: "bold" }}>
              📋 Rewrite My Existing CV
              <p style={{ fontSize: 12, fontWeight: "normal", marginTop: 4, color: "#666" }}>
                Upload your CV + job description → AI optimises it
              </p>
            </button>
            <button onClick={() => setMode("create")}
              style={{ flex: 1, padding: 16, borderRadius: 12, cursor: "pointer",
                border: mode === "create" ? "2px solid #1a237e" : "2px solid #e0e0e0",
                background: mode === "create" ? "#e8eaf6" : "white",
                color: mode === "create" ? "#1a237e" : "#666", fontWeight: "bold" }}>
              ✨ Create From Scratch
              <p style={{ fontSize: 12, fontWeight: "normal", marginTop: 4, color: "#666" }}>
                Fill in your details → AI creates tailored CV
              </p>
            </button>
          </div>
        </div>

        {/* Job Description - always shown */}
        <div style={{ background: "white", borderRadius: 16, padding: 24,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)", marginBottom: 24 }}>
          <label style={{ fontWeight: "bold", color: "#1a237e", display: "block",
            marginBottom: 8 }}>
            📋 Paste Job Description *
          </label>
          <textarea
            placeholder="Paste the full job description here..."
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
            rows={6}
            style={{ width: "96%", padding: 12, borderRadius: 8, border: "1px solid #ddd",
              fontSize: 14, resize: "vertical", fontFamily: "inherit" }}
          />
        </div>

        {/* Rewrite Mode - paste existing CV */}
        {mode === "rewrite" && (
          <div style={{ background: "white", borderRadius: 16, padding: 24,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)", marginBottom: 24 }}>
            <label style={{ fontWeight: "bold", color: "#1a237e", display: "block",
              marginBottom: 8 }}>
              📄 Paste Your Existing CV Text *
            </label>
            <p style={{ color: "#666", fontSize: 13, marginBottom: 12 }}>
              Copy and paste your CV text here (from Word, PDF, or any format)
            </p>
            <textarea
              placeholder="Paste your existing CV text here..."
              value={existingCV}
              onChange={e => setExistingCV(e.target.value)}
              rows={10}
              style={{ width: "96%", padding: 12, borderRadius: 8, border: "1px solid #ddd",
                fontSize: 14, resize: "vertical", fontFamily: "inherit" }}
            />
          </div>
        )}

        {/* Create Mode - fill in details */}
        {mode === "create" && (
          <div style={{ background: "white", borderRadius: 16, padding: 24,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)", marginBottom: 24 }}>
            <h3 style={{ color: "#1a237e", marginBottom: 20 }}>Your Details</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                ["name", "Full Name", "John Smith"],
                ["email", "Email", "john@example.com"],
                ["phone", "Phone", "+44 7700 000000"],
                ["location", "Location", "London, UK"],
                ["linkedin", "LinkedIn URL (optional)", "linkedin.com/in/johnsmith"],
              ].map(([key, label, placeholder]) => (
                <div key={key}>
                  <label style={{ fontWeight: "600", color: "#333", fontSize: 13,
                    display: "block", marginBottom: 4 }}>{label}</label>
                  <input
                    placeholder={placeholder}
                    value={userDetails[key]}
                    onChange={e => setUserDetails({ ...userDetails, [key]: e.target.value })}
                    style={{ width: "90%", padding: 10, borderRadius: 8,
                      border: "1px solid #ddd", fontSize: 14 }}
                  />
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={{ fontWeight: "600", color: "#333", fontSize: 13,
                display: "block", marginBottom: 4 }}>Work Experience</label>
              <textarea
                placeholder="e.g. Software Engineer at Google (2020-2023): Built REST APIs, managed databases..."
                value={userDetails.experience}
                onChange={e => setUserDetails({ ...userDetails, experience: e.target.value })}
                rows={4}
                style={{ width: "96%", padding: 10, borderRadius: 8,
                  border: "1px solid #ddd", fontSize: 14, fontFamily: "inherit" }}
              />
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={{ fontWeight: "600", color: "#333", fontSize: 13,
                display: "block", marginBottom: 4 }}>Education</label>
              <textarea
                placeholder="e.g. BSc Computer Science, University of London (2016-2020)"
                value={userDetails.education}
                onChange={e => setUserDetails({ ...userDetails, education: e.target.value })}
                rows={3}
                style={{ width: "96%", padding: 10, borderRadius: 8,
                  border: "1px solid #ddd", fontSize: 14, fontFamily: "inherit" }}
              />
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={{ fontWeight: "600", color: "#333", fontSize: 13,
                display: "block", marginBottom: 4 }}>Skills</label>
              <input
                placeholder="e.g. Python, JavaScript, Project Management, Communication"
                value={userDetails.skills}
                onChange={e => setUserDetails({ ...userDetails, skills: e.target.value })}
                style={{ width: "96%", padding: 10, borderRadius: 8,
                  border: "1px solid #ddd", fontSize: 14 }}
              />
            </div>
          </div>
        )}

        {/* Generate Button */}
        {!cvData && (
          <button onClick={handleGenerate} disabled={loading}
            style={{ width: "100%", padding: 16, background: loading ? "#aaa" : "#1a237e",
              color: "white", border: "none", borderRadius: 12, cursor: "pointer",
              fontSize: 16, fontWeight: "bold", marginBottom: 24 }}>
            {loading ? "✨ Generating your CV... please wait" : "✨ Generate My CV"}
          </button>
        )}

        {/* CV Preview */}
        {cvData && (
          <div style={{ background: "white", borderRadius: 16, padding: 30,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)", marginBottom: 24 }}>

            <div style={{ display: "flex", justifyContent: "space-between",
              alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
              <h3 style={{ color: "#1a237e", margin: 0 }}>✅ Your CV is Ready!</h3>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => setCvData(null)}
                  style={{ padding: "10px 20px", background: "#e8eaf6", color: "#1a237e",
                    border: "none", borderRadius: 8, cursor: "pointer", fontWeight: "bold" }}>
                  🔄 Regenerate
                </button>
                <button onClick={handleDownload} disabled={downloading}
                  style={{ padding: "10px 20px", background: "#2e7d32", color: "white",
                    border: "none", borderRadius: 8, cursor: "pointer", fontWeight: "bold" }}>
                  {downloading ? "Preparing..." : "⬇️ Download PDF"}
                </button>
              </div>
            </div>

            {/* CV Preview Content */}
            <div style={{ border: "1px solid #e0e0e0", borderRadius: 8, padding: 30,
              fontFamily: "Arial, sans-serif", fontSize: 12 }}>

              <h2 style={{ fontSize: 22, textTransform: "uppercase",
                letterSpacing: 1, margin: "0 0 4px" }}>{cvData.name}</h2>
              <p style={{ fontSize: 11, color: "#555", margin: "0 0 16px" }}>
                {[cvData.email, cvData.phone, cvData.location, cvData.linkedin]
                  .filter(Boolean).join(" | ")}
              </p>
              <hr style={{ border: "none", borderTop: "2px solid #000", margin: "8px 0" }} />

              {cvData.summary && (
                <>
                  <h4 style={{ textTransform: "uppercase", letterSpacing: 1,
                    fontSize: 12, margin: "14px 0 6px", borderBottom: "1px solid #000",
                    paddingBottom: 3 }}>Professional Summary</h4>
                  <p style={{ fontSize: 11, lineHeight: 1.5 }}>{cvData.summary}</p>
                </>
              )}

              {cvData.experience?.length > 0 && (
                <>
                  <h4 style={{ textTransform: "uppercase", letterSpacing: 1,
                    fontSize: 12, margin: "14px 0 6px", borderBottom: "1px solid #000",
                    paddingBottom: 3 }}>Work Experience</h4>
                  {cvData.experience.map((exp, i) => (
                    <div key={i} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <strong style={{ fontSize: 11 }}>{exp.title}</strong>
                        <span style={{ fontSize: 10, color: "#555" }}>{exp.dates}</span>
                      </div>
                      <div style={{ fontSize: 10, color: "#444", margin: "2px 0 4px" }}>
                        {exp.company}
                      </div>
                      <ul style={{ paddingLeft: 16, margin: 0 }}>
                        {(exp.bullets || []).map((b, j) => (
                          <li key={j} style={{ fontSize: 10, lineHeight: 1.5 }}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </>
              )}

              {cvData.education?.length > 0 && (
                <>
                  <h4 style={{ textTransform: "uppercase", letterSpacing: 1,
                    fontSize: 12, margin: "14px 0 6px", borderBottom: "1px solid #000",
                    paddingBottom: 3 }}>Education</h4>
                  {cvData.education.map((edu, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between",
                      marginBottom: 6 }}>
                      <div>
                        <strong style={{ fontSize: 11 }}>{edu.degree}</strong>
                        <div style={{ fontSize: 10, color: "#444" }}>{edu.institution}</div>
                      </div>
                      <span style={{ fontSize: 10, color: "#555" }}>{edu.dates}</span>
                    </div>
                  ))}
                </>
              )}

              {cvData.skills?.length > 0 && (
                <>
                  <h4 style={{ textTransform: "uppercase", letterSpacing: 1,
                    fontSize: 12, margin: "14px 0 6px", borderBottom: "1px solid #000",
                    paddingBottom: 3 }}>Skills</h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {cvData.skills.map((s, i) => (
                      <span key={i} style={{ fontSize: 10, border: "1px solid #000",
                        padding: "2px 8px" }}>{s}</span>
                    ))}
                  </div>
                </>
              )}

              {cvData.certifications?.length > 0 && (
                <>
                  <h4 style={{ textTransform: "uppercase", letterSpacing: 1,
                    fontSize: 12, margin: "14px 0 6px", borderBottom: "1px solid #000",
                    paddingBottom: 3 }}>Certifications</h4>
                  {cvData.certifications.map((c, i) => (
                    <div key={i} style={{ fontSize: 10, marginBottom: 3 }}>• {c}</div>
                  ))}
                </>
              )}
            </div>

            <p style={{ color: "#666", fontSize: 12, marginTop: 12, textAlign: "center" }}>
              💡 Click Download PDF → when print dialog opens → select "Save as PDF"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}