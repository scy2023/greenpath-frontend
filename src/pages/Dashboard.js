import { useNavigate } from "react-router-dom";



function getCourseLink(skill) {
  return `https://www.coursera.org/search?query=${encodeURIComponent(skill)}&price=free`;
}

function getYouTubeLink(skill) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + " tutorial free")}`;
}

function ScoreCircle({ score }) {
  const color = score >= 70 ? "#2e7d32" : score >= 40 ? "#f57c00" : "#c62828";
  return (
    <div style={{
      width: 140, height: 140, borderRadius: "50%",
      background: `conic-gradient(${color} ${score * 3.6}deg, #e0e0e0 0deg)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      margin: "0 auto", position: "relative"
    }}>
      <div style={{
        width: 110, height: 110, borderRadius: "50%", background: "white",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column"
      }}>
        <span style={{ fontSize: 32, fontWeight: "bold", color }}>{score}%</span>
        <span style={{ fontSize: 12, color: "#666" }}>Match</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const results = JSON.parse(localStorage.getItem("results") || "{}");
  const history = JSON.parse(localStorage.getItem("history") || "[]");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleNewAnalysis = () => {
    // Save current result to history
    if (results.match_score !== undefined) {
      const newHistory = [...history, { ...results, date: new Date().toLocaleDateString() }];
      localStorage.setItem("history", JSON.stringify(newHistory.slice(-5)));
    }
    navigate("/upload");
  };

  const score = results.match_score || 0;
  const missing = results.missing_skills || [];
  const scoreLabel = score >= 70 ? "Strong Match 🎉" : score >= 40 ? "Moderate Match 💪" : "Needs Work 📚";

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7f5", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Header */}
      <div style={{ background: "white", padding: "16px 32px", display: "flex",
        justifyContent: "space-between", alignItems: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 24 }}>🌿</span>
          <span style={{ fontSize: 20, fontWeight: "bold", color: "#2e7d32" }}>GreenPath AI</span>
        </div>
        <button onClick={handleLogout}
          style={{ padding: "8px 20px", background: "#c62828", color: "white",
            border: "none", borderRadius: 20, cursor: "pointer", fontWeight: "bold" }}>
          Logout
        </button>
      </div>

      <div style={{ maxWidth: 800, margin: "30px auto", padding: "0 20px" }}>

        {results.match_score !== undefined ? (
          <>
            {/* Score Card */}
            <div style={{ background: "white", borderRadius: 16, padding: 30,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)", marginBottom: 24, textAlign: "center" }}>
              <h2 style={{ color: "#333", marginBottom: 20 }}>Your Career Match Analysis</h2>
              <ScoreCircle score={score} />
              <p style={{ fontSize: 20, fontWeight: "bold", marginTop: 16,
                color: score >= 70 ? "#2e7d32" : score >= 40 ? "#f57c00" : "#c62828" }}>
                {scoreLabel}
              </p>

              {/* Progress Bar */}
              <div style={{ background: "#e0e0e0", borderRadius: 10, height: 12,
                margin: "16px 0", overflow: "hidden" }}>
                <div style={{
                  width: `${score}%`, height: "100%", borderRadius: 10,
                  background: score >= 70 ? "#2e7d32" : score >= 40 ? "#f57c00" : "#c62828",
                  transition: "width 1s ease"
                }} />
              </div>
              <p style={{ color: "#666", fontSize: 14 }}>
                You match {score}% of the required skills for this role
              </p>
            </div>

            {/* Missing Skills + Courses */}
            {missing.length > 0 && (
              <div style={{ background: "white", borderRadius: 16, padding: 30,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)", marginBottom: 24 }}>
                <h3 style={{ color: "#333", marginBottom: 20 }}>
                  📚 Skills to Learn ({missing.length})
                </h3>
                {missing.map((skill, i) => (
                  <div key={i} style={{
                    border: "1px solid #e0e0e0", borderRadius: 12, padding: 16,
                    marginBottom: 12, display: "flex", justifyContent: "space-between",
                    alignItems: "center", flexWrap: "wrap", gap: 10
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 20 }}>🎯</span>
                      <span style={{ fontWeight: "600", color: "#333" }}>{skill}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <a href={getCourseLink(skill)} target="_blank" rel="noreferrer"
                        style={{ padding: "6px 14px", background: "#0056d2", color: "white",
                          borderRadius: 20, textDecoration: "none", fontSize: 13, fontWeight: "bold" }}>
                        Coursera
                      </a>
                      <a href={getYouTubeLink(skill)} target="_blank" rel="noreferrer"
                        style={{ padding: "6px 14px", background: "#ff0000", color: "white",
                          borderRadius: 20, textDecoration: "none", fontSize: 13, fontWeight: "bold" }}>
                        YouTube
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Progress History */}
            {history.length > 0 && (
              <div style={{ background: "white", borderRadius: 16, padding: 30,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)", marginBottom: 24 }}>
                <h3 style={{ color: "#333", marginBottom: 20 }}>📈 Your Progress History</h3>
                {history.map((h, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between",
                    alignItems: "center", padding: "10px 0",
                    borderBottom: i < history.length - 1 ? "1px solid #eee" : "none" }}>
                    <span style={{ color: "#666" }}>Analysis {i + 1} — {h.date}</span>
                    <span style={{ fontWeight: "bold",
                      color: h.match_score >= 70 ? "#2e7d32" : h.match_score >= 40 ? "#f57c00" : "#c62828" }}>
                      {h.match_score}%
                    </span>
                  </div>
                ))}
              </div>
            )}

            <button onClick={handleNewAnalysis}
              style={{ width: "100%", padding: 16, background: "#2e7d32", color: "white",
                border: "none", borderRadius: 12, cursor: "pointer", fontSize: 16,
                fontWeight: "bold", boxShadow: "0 4px 12px rgba(46,125,50,0.3)" }}>
              🔄 Analyse Another CV
            </button>
          </>
        ) : (
          <div style={{ background: "white", borderRadius: 16, padding: 60,
            textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <span style={{ fontSize: 60 }}>🌿</span>
            <h2 style={{ color: "#333", marginTop: 20 }}>Welcome to GreenPath!</h2>
            <p style={{ color: "#666", marginBottom: 30 }}>
              Upload your CV and let AI analyse your career match.
            </p>
            <button onClick={() => navigate("/upload")}
              style={{ padding: "14px 32px", background: "#2e7d32", color: "white",
                border: "none", borderRadius: 12, cursor: "pointer", fontSize: 16,
                fontWeight: "bold" }}>
              Upload CV →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}