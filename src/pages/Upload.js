import { useState } from "react";
import { useNavigate } from "react-router-dom";

const steps = [
  "Reading your CV... 📄",
  "Extracting skills... 🔍",
  "Matching to role... 🎯",
  "Calculating score... 📊",
  "Preparing results... ✅",
];

export default function Upload() {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepText, setStepText] = useState("");
  const navigate = useNavigate();

  const simulateProgress = () => {
    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      setProgress(current);
      setStepText(steps[Math.floor(current / 20) - 1] || "");
      if (current >= 100) clearInterval(interval);
    }, 1500);
    return interval;
  };

  const handleUpload = async () => {
    if (!file || !role) {
      alert("Please select a CV and enter a job role");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.setItem("pendingCV", "true");
      navigate("/login");
      return;
    }

    setLoading(true);
    setProgress(0);
    const interval = simulateProgress();

    try {
      const formData = new FormData();
      formData.append("cv", file);

      const uploadRes = await fetch(`${process.env.REACT_APP_API_URL}/api/cv/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadData.cvData) {
        clearInterval(interval);
        alert("CV upload failed");
        setLoading(false);
        return;
      }

      const isPremium = localStorage.getItem("premium") === "true";
      const analyzeRes = await fetch(`${process.env.REACT_APP_API_URL}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ cvData: uploadData.cvData, role, premium: isPremium }),
      });
      const analyzeData = await analyzeRes.json();

      clearInterval(interval);
      setProgress(100);

      if (analyzeData.error) {
        alert("Analyse failed: " + analyzeData.error);
        setLoading(false);
        return;
      }

      localStorage.removeItem("pendingCV");
      localStorage.setItem("results", JSON.stringify(analyzeData));
      setTimeout(() => navigate("/dashboard"), 500);
    } catch (err) {
      clearInterval(interval);
      alert("Error: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7f5", fontFamily: "'Segoe UI', sans-serif",
      display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{ background: "white", padding: "16px 32px", display: "flex",
        justifyContent: "space-between", alignItems: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 24 }}>🚀</span>
          <span style={{ fontSize: 20, fontWeight: "bold", color: "#1a237e" }}>CareerUpdater</span>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <a href="/blog" style={{ color: "#1a237e", textDecoration: "none", fontWeight: "600" }}>
            Career Lab
          </a>
          <a href="/login" style={{ color: "#1a237e", textDecoration: "none", fontWeight: "600" }}>
            Login
          </a>
          <a href="/register" style={{ padding: "8px 20px", background: "#1a237e", color: "white",
            borderRadius: 20, textDecoration: "none", fontWeight: "bold" }}>
            Register
          </a>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #1a237e, #283593)",
        padding: "60px 20px", textAlign: "center", color: "white" }}>
        <h1 style={{ fontSize: 36, margin: "0 0 12px" }}>Match Your CV to Any Job Role</h1>
        <p style={{ fontSize: 18, opacity: 0.9, margin: 0 }}>
          AI-powered analysis in seconds — free to use
        </p>
      </div>

      {/* Upload Card */}
      <div style={{ maxWidth: 560, margin: "40px auto", padding: "0 20px", width: "100%" }}>
        <div style={{ background: "white", borderRadius: 16, padding: 40,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>

          {loading ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>⚙️</div>
              <h3 style={{ color: "#1a237e", marginBottom: 20 }}>Analysing Your CV</h3>
              <div style={{ background: "#e0e0e0", borderRadius: 10, height: 16,
                marginBottom: 12, overflow: "hidden" }}>
                <div style={{ width: `${progress}%`, height: "100%", borderRadius: 10,
                  background: "linear-gradient(90deg, #1a237e, #42a5f5)",
                  transition: "width 1.2s ease" }} />
              </div>
              <p style={{ fontSize: 24, fontWeight: "bold", color: "#1a237e" }}>{progress}%</p>
              <p style={{ color: "#666" }}>{stepText}</p>
            </div>
          ) : (
            <>
              <h2 style={{ color: "#1a237e", marginBottom: 8, textAlign: "center" }}>
                Analyse Your CV Free
              </h2>
              <p style={{ color: "#666", textAlign: "center", marginBottom: 30 }}>
                Upload your CV and enter your target job role
              </p>

              <label style={{ display: "block", fontWeight: "600", marginBottom: 6, color: "#333" }}>
                Upload CV (PDF)
              </label>
              <input type="file" accept=".pdf" onChange={e => setFile(e.target.files[0])}
                style={{ display: "block", width: "100%", marginBottom: 20,
                  padding: 10, borderRadius: 8, border: "1px solid #ddd" }} />

              <label style={{ display: "block", fontWeight: "600", marginBottom: 6, color: "#333" }}>
                Target Job Role
              </label>
              <input placeholder="e.g. Software Engineer, Data Analyst"
                value={role} onChange={e => setRole(e.target.value)}
                style={{ display: "block", width: "93%", marginBottom: 30,
                  padding: 12, borderRadius: 8, border: "1px solid #ddd", fontSize: 15 }} />

              <button onClick={handleUpload}
                style={{ width: "100%", padding: 14, fontSize: 16, fontWeight: "bold",
                  background: "#1a237e", color: "white", border: "none",
                  borderRadius: 8, cursor: "pointer" }}>
                Analyse My CV 🚀
              </button>
            </>
          )}
        </div>

        {/* Features */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          gap: 16, marginTop: 24 }}>
          {[["🎯", "Match Score", "See how well you match"],
            ["📚", "Missing Skills", "Know what to learn"],
            ["🗺️", "Roadmap", "Premium learning path"]
          ].map(([icon, title, desc], i) => (
            <div key={i} style={{ background: "white", borderRadius: 12, padding: 16,
              textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 28 }}>{icon}</div>
              <div style={{ fontWeight: "bold", color: "#1a237e", marginTop: 8 }}>{title}</div>
              <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: "auto", background: "#1a237e", color: "white", padding: "40px 20px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 24, fontWeight: "bold", marginBottom: 8 }}>🚀 CareerUpdater</div>
          <p style={{ opacity: 0.8, marginBottom: 24 }}>
            AI-powered CV analysis to help you land your dream job
          </p>

          {/* Social Links */}
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 24 }}>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer"
              style={{ background: "#0077b5", padding: "10px 20px", borderRadius: 8,
                color: "white", textDecoration: "none", fontWeight: "bold", fontSize: 14 }}>
              💼 LinkedIn
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer"
              style={{ background: "#1877f2", padding: "10px 20px", borderRadius: 8,
                color: "white", textDecoration: "none", fontWeight: "bold", fontSize: 14 }}>
              📘 Facebook
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer"
              style={{ background: "#000", padding: "10px 20px", borderRadius: 8,
                color: "white", textDecoration: "none", fontWeight: "bold", fontSize: 14 }}>
              𝕏 X
            </a>
          </div>

          {/* Footer Links */}
          <div style={{ display: "flex", justifyContent: "center", gap: 24,
            marginBottom: 16, flexWrap: "wrap" }}>
            <a href="/blog" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>
              Career Lab
            </a>
            <a href="/privacy" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>
              Privacy Policy
            </a>
            <a href="/login" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>
              Login
            </a>
            <a href="/register" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>
              Register
            </a>
          </div>

          <p style={{ opacity: 0.6, fontSize: 13 }}>
            © {new Date().getFullYear()} CareerUpdater. All rights reserved. |
            Registered in England & Wales
          </p>
        </div>
      </div>
    </div>
  );
}