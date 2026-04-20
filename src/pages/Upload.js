import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file || !role) {
      alert("Please select a CV and enter a job role");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.setItem("pendingCV", "true");
      navigate("/");
      return;
    }

    setLoading(true);
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
        alert("CV upload failed: " + JSON.stringify(uploadData));
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
      if (analyzeData.error) {
        alert("Analyze failed: " + analyzeData.error);
        setLoading(false);
        return;
      }

      localStorage.removeItem("pendingCV");
      localStorage.setItem("results", JSON.stringify(analyzeData));
      navigate("/dashboard");
    } catch (err) {
      alert("Error: " + err.message);
    }
    setLoading(false);
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
      </div>

      <div style={{ maxWidth: 560, margin: "60px auto", padding: "0 20px" }}>
        <div style={{ background: "white", borderRadius: 16, padding: 40,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
          <h2 style={{ color: "#1a237e", marginBottom: 8, textAlign: "center" }}>
            Analyse Your CV
          </h2>
          <p style={{ color: "#666", textAlign: "center", marginBottom: 30 }}>
            Upload your CV and enter your target job role
          </p>

          <label style={{ display: "block", fontWeight: "600",
            marginBottom: 6, color: "#333" }}>Upload CV (PDF)</label>
          <input type="file" accept=".pdf" onChange={e => setFile(e.target.files[0])}
            style={{ display: "block", width: "100%", marginBottom: 20,
              padding: 10, borderRadius: 8, border: "1px solid #ddd" }} />

          <label style={{ display: "block", fontWeight: "600",
            marginBottom: 6, color: "#333" }}>Target Job Role</label>
          <input placeholder="e.g. Software Engineer, Data Analyst"
            value={role} onChange={e => setRole(e.target.value)}
            style={{ display: "block", width: "93%", marginBottom: 30,
              padding: 12, borderRadius: 8, border: "1px solid #ddd", fontSize: 15 }} />

          <button onClick={handleUpload} disabled={loading}
            style={{ width: "100%", padding: 14, fontSize: 16, fontWeight: "bold",
              background: loading ? "#aaa" : "#1a237e", color: "white",
              border: "none", borderRadius: 8, cursor: "pointer" }}>
            {loading ? "Analysing... please wait ⏳" : "Analyse My CV 🚀"}
          </button>

          <p style={{ textAlign: "center", marginTop: 16, color: "#999", fontSize: 13 }}>
            You'll be asked to login after uploading
          </p>
        </div>
      </div>
    </div>
  );
}