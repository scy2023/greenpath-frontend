export default function Privacy() {
  return (
    <div style={{ minHeight: "100vh", background: "#f5f7f5", fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ background: "white", padding: "16px 32px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 24 }}>🚀</span>
          <a href="/" style={{ fontSize: 20, fontWeight: "bold", color: "#1a237e", textDecoration: "none" }}>
            CareerUpdater
          </a>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 20px" }}>
        <div style={{ background: "white", borderRadius: 16, padding: 40, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
          <h1 style={{ color: "#1a237e" }}>Privacy Policy</h1>
          <p style={{ color: "#666" }}>Last updated: {new Date().toLocaleDateString("en-GB")}</p>

          <h2>1. Who We Are</h2>
          <p>CareerUpdater ("we", "us", "our") operates the website careerupdater.com. We are committed to protecting your personal data in accordance with the UK GDPR and Data Protection Act 2018.</p>
          <p>Contact: <a href="mailto:privacy@careerupdater.com">privacy@careerupdater.com</a></p>

          <h2>2. What Data We Collect</h2>
          <ul>
            <li><strong>Account data:</strong> Email address and password (encrypted)</li>
            <li><strong>CV data:</strong> Text content extracted from uploaded CVs for analysis purposes</li>
            <li><strong>Usage data:</strong> Pages visited, analysis history</li>
            <li><strong>Payment data:</strong> Processed securely by Stripe — we never store card details</li>
          </ul>

          <h2>3. How We Use Your Data</h2>
          <ul>
            <li>To provide CV analysis and career matching services</li>
            <li>To send account-related emails</li>
            <li>To process payments for Premium subscriptions</li>
            <li>To improve our AI analysis quality</li>
          </ul>

          <h2>4. Legal Basis (UK GDPR)</h2>
          <ul>
            <li><strong>Contract:</strong> Processing necessary to provide our service</li>
            <li><strong>Consent:</strong> Marketing communications (you can opt out anytime)</li>
            <li><strong>Legitimate interests:</strong> Improving our service and preventing fraud</li>
          </ul>

          <h2>5. Data Retention</h2>
          <p>We retain your data for as long as your account is active. CV data is deleted after 30 days. You can request deletion at any time.</p>

          <h2>6. Your Rights</h2>
          <p>Under UK GDPR you have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Delete your data ("right to be forgotten")</li>
            <li>Object to processing</li>
            <li>Data portability</li>
            <li>Withdraw consent at any time</li>
          </ul>
          <p>To exercise your rights, email: <a href="mailto:privacy@careerupdater.com">privacy@careerupdater.com</a></p>

          <h2>7. Cookies</h2>
          <p>We use essential cookies only for authentication. We do not use tracking or advertising cookies.</p>

          <h2>8. Third Parties</h2>
          <ul>
            <li><strong>Stripe</strong> — payment processing (stripe.com/privacy)</li>
            <li><strong>Vercel</strong> — website hosting</li>
            <li><strong>Render</strong> — backend hosting</li>
            <li><strong>DeepSeek AI</strong> — CV analysis (your CV text is sent for analysis only)</li>
          </ul>

          <h2>9. International Transfers</h2>
          <p>Some data may be processed outside the UK. We ensure appropriate safeguards are in place.</p>

          <h2>10. Contact & Complaints</h2>
          <p>Email us at <a href="mailto:privacy@careerupdater.com">privacy@careerupdater.com</a></p>
          <p>You also have the right to complain to the ICO: <a href="https://ico.org.uk" target="_blank" rel="noreferrer">ico.org.uk</a></p>
        </div>
      </div>
    </div>
  );
}