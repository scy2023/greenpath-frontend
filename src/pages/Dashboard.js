import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const results = JSON.parse(localStorage.getItem("results") || "{}");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={{ maxWidth: 600, margin: "60px auto", fontFamily: "sans-serif", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>🌿 GreenPath AI — Results</h2>
        <button onClick={handleLogout}
          style={{ padding: "8px 16px", background: "#c62828", color: "white", border: "none", borderRadius: 5, cursor: "pointer" }}>
          Logout
        </button>
      </div>

      {results.match_score !== undefined ? (
        <div>
          <div style={{ background: "#e8f5e9", padding: 20, borderRadius: 10, marginTop: 20 }}>
            <h3>Match Score</h3>
            <div style={{ fontSize: 48, fontWeight: "bold", color: "#2e7d32" }}>
              {results.match_score}%
            </div>
          </div>

          <div style={{ background: "#fff3e0", padding: 20, borderRadius: 10, marginTop: 20 }}>
            <h3>Missing Skills</h3>
            {results.missing_skills && results.missing_skills.length > 0 ? (
              <ul>
                {results.missing_skills.map((skill, i) => (
                  <li key={i} style={{ marginBottom: 8 }}>{skill}</li>
                ))}
              </ul>
            ) : (
              <p>No missing skills — great match! 🎉</p>
            )}
          </div>

          <button onClick={() => navigate("/upload")}
            style={{ marginTop: 20, width: "100%", padding: 12, background: "#2e7d32",
              color: "white", border: "none", borderRadius: 5, cursor: "pointer", fontSize: 16 }}>
            Analyse Another CV
          </button>
        </div>
      ) : (
        <div style={{ marginTop: 40, textAlign: "center" }}>
          <h3>Welcome to GreenPath!</h3>
          <p>Upload your CV and let AI analyse your career match.</p>
          <button onClick={() => navigate("/upload")}
            style={{ padding: "12px 24px", background: "#2e7d32", color: "white",
              border: "none", borderRadius: 5, cursor: "pointer", fontSize: 16 }}>
            Upload CV →
          </button>
        </div>
      )}
    </div>
  );
}