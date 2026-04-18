import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file || !role) {
      alert("Please select a CV file and enter a job role");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("cv", file);

    const token = localStorage.getItem("token");

    // Step 1 — Upload CV
    const uploadRes = await fetch(`${process.env.REACT_APP_API_URL}/api/cv/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const uploadData = await uploadRes.json();

    // Step 2 — Analyze CV against role
    const analyzeRes = await fetch(`${process.env.REACT_APP_API_URL}/api/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ cvData: uploadData.cvData, role }),
    });
    const analyzeData = await analyzeRes.json();

    setLoading(false);

    // Save results and go to dashboard
    localStorage.setItem("results", JSON.stringify(analyzeData));
    navigate("/dashboard");
  };

  return (
    <div style={{ maxWidth: 500, margin: "100px auto", fontFamily: "sans-serif" }}>
      <h2>GreenPath AI — Upload CV</h2>

      <label style={{ display: "block", marginBottom: 5 }}>Upload your CV (PDF)</label>
      <input type="file" accept=".pdf" onChange={e => setFile(e.target.files[0])}
        style={{ display: "block", width: "100%", marginBottom: 15, padding: 8 }} />

      <label style={{ display: "block", marginBottom: 5 }}>Target Job Role</label>
      <input placeholder="e.g. Software Engineer, Data Analyst"
        value={role} onChange={e => setRole(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: 15, padding: 8 }} />

      <button onClick={handleUpload} disabled={loading}
        style={{ width: "100%", padding: 10, background: loading ? "#aaa" : "#2e7d32",
          color: "white", border: "none", borderRadius: 5, cursor: "pointer" }}>
        {loading ? "Analyzing... please wait" : "Upload & Analyze"}
      </button>
    </div>
  );
}