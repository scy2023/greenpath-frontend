import { useState } from "react";

const POSTS = [
  {
    id: 1,
    title: "How to Write a CV That Gets Past ATS Systems in 2025",
    date: "15 April 2025",
    category: "CV Tips",
    excerpt: "Most CVs never reach a human recruiter. Learn how Applicant Tracking Systems work and how to optimise your CV to get noticed.",
    content: `Applicant Tracking Systems (ATS) are used by over 90% of large companies to filter CVs before a human sees them. Here's how to beat them:\n\n1. Use standard section headings like "Experience", "Education", "Skills"\n2. Match keywords from the job description exactly\n3. Avoid tables, graphics, and unusual fonts\n4. Save as PDF or Word — never as an image\n5. Include measurable achievements, not just duties`
  },
  {
    id: 2,
    title: "Top 10 In-Demand Skills for 2025 and How to Learn Them Free",
    date: "10 April 2025",
    category: "Career Advice",
    excerpt: "The job market is changing fast. Here are the skills employers want most in 2025 and where to learn them for free.",
    content: `The most in-demand skills in 2025 include:\n\n1. AI & Machine Learning — Coursera, fast.ai\n2. Data Analysis — Google Data Analytics Certificate\n3. Cloud Computing — AWS Free Tier\n4. Cybersecurity — Google Cybersecurity Certificate\n5. Project Management — Google PM Certificate\n\nAll available free on Coursera with financial aid.`
  },
  {
    id: 3,
    title: "Career Change Guide: How to Switch Industries Successfully",
    date: "5 April 2025",
    category: "Career Change",
    excerpt: "Thinking of switching careers? Here's a proven step-by-step guide to make a successful transition without starting from scratch.",
    content: `Switching careers is scary but very achievable. Follow these steps:\n\n1. Identify transferable skills from your current role\n2. Research your target industry thoroughly\n3. Get one key qualification or certification\n4. Build a portfolio of relevant projects\n5. Network with people already in that industry\n6. Apply for junior roles — experience beats age`
  },
];

export default function Blog() {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7f5", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ background: "white", padding: "16px 32px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 24 }}>🚀</span>
          <a href="/" style={{ fontSize: 20, fontWeight: "bold", color: "#1a237e", textDecoration: "none" }}>
            CareerUpdater
          </a>
        </div>
        <a href="/" style={{ padding: "8px 20px", background: "#1a237e", color: "white",
          borderRadius: 20, textDecoration: "none", fontWeight: "bold" }}>
          Analyse My CV
        </a>
      </div>

      <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 20px" }}>
        <h1 style={{ color: "#1a237e", marginBottom: 8 }}>Career Lab 🧪</h1>
        <p style={{ color: "#666", marginBottom: 30 }}>
          Expert career advice, CV tips, and job market insights
        </p>

        {selected ? (
          <div style={{ background: "white", borderRadius: 16, padding: 40,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <button onClick={() => setSelected(null)}
              style={{ background: "none", border: "none", color: "#1a237e",
                cursor: "pointer", fontSize: 16, marginBottom: 20, padding: 0 }}>
              ← Back to Career Lab
            </button>
            <span style={{ background: "#e8eaf6", color: "#1a237e", padding: "4px 12px",
              borderRadius: 20, fontSize: 13, fontWeight: "bold" }}>{selected.category}</span>
            <h2 style={{ color: "#1a237e", margin: "16px 0 8px" }}>{selected.title}</h2>
            <p style={{ color: "#999", marginBottom: 24 }}>{selected.date}</p>
            {selected.content.split("\n\n").map((para, i) => (
              <p key={i} style={{ color: "#444", lineHeight: 1.8, marginBottom: 16 }}>{para}</p>
            ))}
            <div style={{ marginTop: 40, padding: 24, background: "#e8eaf6",
              borderRadius: 12, textAlign: "center" }}>
              <h3 style={{ color: "#1a237e", margin: "0 0 12px" }}>
                Want to know how your CV matches this role?
              </h3>
              <a href="/" style={{ padding: "12px 28px", background: "#1a237e", color: "white",
                borderRadius: 8, textDecoration: "none", fontWeight: "bold", fontSize: 16 }}>
                Analyse My CV Free →
              </a>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
            {POSTS.map(post => (
              <div key={post.id} onClick={() => setSelected(post)}
                style={{ background: "white", borderRadius: 16, padding: 24,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)", cursor: "pointer",
                  transition: "transform 0.2s", border: "1px solid #eee" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                <span style={{ background: "#e8eaf6", color: "#1a237e", padding: "4px 12px",
                  borderRadius: 20, fontSize: 12, fontWeight: "bold" }}>{post.category}</span>
                <h3 style={{ color: "#1a237e", margin: "12px 0 8px", fontSize: 18 }}>{post.title}</h3>
                <p style={{ color: "#666", fontSize: 14, lineHeight: 1.6 }}>{post.excerpt}</p>
                <p style={{ color: "#999", fontSize: 13, marginTop: 16 }}>{post.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}