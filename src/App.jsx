import { useState, useEffect } from "react";
import { loginWithGoogle, logout, auth, db } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

export default function App() {
  const [dark, setDark] = useState(() => window.matchMedia("(prefers-color-scheme: dark)").matches);
  const [user] = useAuthState(auth);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    document.body.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    if (!user) return;
    const saveUser = async () => {
      const q = query(collection(db, "waitlist"), where("email", "==", user.email));
      const existing = await getDocs(q);
      if (existing.empty) {
        await addDoc(collection(db, "waitlist"), {
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          joinedAt: new Date(),
        });
      }
      setSaved(true);
    };
    saveUser();
  }, [user]);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body[data-theme="light"] {
          --bg: #faf8f4; --surface: #ffffff; --border: rgba(0,0,0,0.08);
          --text-primary: #1a1a1a; --text-secondary: #777; --accent: #d4500a;
          --accent-light: #fff0e8; --input-bg: #ffffff;
        }
        body[data-theme="dark"] {
          --bg: #111010; --surface: #1c1b1b; --border: rgba(255,255,255,0.07);
          --text-primary: #f0ece4; --text-secondary: #888; --accent: #f4793a;
          --accent-light: #2a1a0f; --input-bg: #1a1a1a;
        }
        body { background: var(--bg); color: var(--text-primary); font-family: system-ui, -apple-system, sans-serif; min-height: 100vh; transition: background 0.3s, color 0.3s; }
        nav { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 2rem; border-bottom: 0.5px solid var(--border); }
        .logo { font-size: 1.4rem; font-weight: 700; letter-spacing: 0.12em; color: var(--accent); font-family: Georgia, serif; }
        .logo span { color: var(--text-secondary); font-size: 11px; font-family: system-ui; font-weight: 400; margin-left: 10px; vertical-align: middle; }
        .nav-right { display: flex; align-items: center; gap: 10px; }
        .theme-btn { background: none; border: 0.5px solid var(--border); border-radius: 20px; padding: 6px 14px; font-size: 12px; color: var(--text-secondary); cursor: pointer; font-family: inherit; }
        .theme-btn:hover { color: var(--text-primary); }
        .user-pill { display: flex; align-items: center; gap: 8px; background: var(--surface); border: 0.5px solid var(--border); border-radius: 20px; padding: 4px 12px 4px 4px; }
        .user-pill img { width: 24px; height: 24px; border-radius: 50%; }
        .user-pill span { font-size: 13px; color: var(--text-secondary); }
        .logout-btn { background: none; border: none; font-size: 12px; color: var(--text-secondary); cursor: pointer; font-family: inherit; padding: 0; }
        .logout-btn:hover { color: var(--accent); }
        .hero { display: flex; flex-direction: column; align-items: center; padding: 3rem 1.5rem 1rem; text-align: center; }
        .crane-wrap { width: 100%; max-width: 560px; margin-bottom: 2rem; }
        .coming-soon-label { display: inline-block; background: var(--accent); color: #fff; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; padding: 5px 16px; border-radius: 4px; margin-bottom: 1rem; text-transform: uppercase; }
        h1 { font-size: clamp(2rem, 6vw, 3.2rem); font-weight: 700; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 1rem; font-family: Georgia, serif; }
        h1 em { font-style: normal; color: var(--accent); }
        .subtitle { font-size: 16px; color: var(--text-secondary); max-width: 480px; line-height: 1.65; margin-bottom: 2.5rem; }
        .google-btn { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 13px 28px; background: var(--accent); color: #fff; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; font-family: inherit; transition: opacity 0.2s, transform 0.1s; }
        .google-btn:hover { opacity: 0.88; }
        .google-btn:active { transform: scale(0.97); }
        .google-icon { width: 18px; height: 18px; flex-shrink: 0; }
        .success-msg { font-size: 14px; color: #2a9d5c; background: #edfaf4; border: 0.5px solid #b6e8d0; border-radius: 10px; padding: 10px 20px; }
        body[data-theme="dark"] .success-msg { background: #0f2a1a; border-color: #1a5c35; color: #4ade80; }
        .note { font-size: 12px; color: var(--text-secondary); margin-top: 0.75rem; }
        .features { width: 100%; max-width: 760px; margin: 3rem auto 0; padding: 0 1.5rem 4rem; }
        .features-label { font-size: 11px; letter-spacing: 0.12em; color: var(--text-secondary); text-transform: uppercase; text-align: center; margin-bottom: 1.5rem; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; }
        .feature-card { background: var(--surface); border: 0.5px solid var(--border); border-radius: 14px; padding: 1.25rem 1rem; display: flex; flex-direction: column; gap: 10px; }
        .feature-icon { font-size: 22px; line-height: 1; }
        .feature-title { font-size: 14px; font-weight: 600; color: var(--text-primary); line-height: 1.3; }
        .feature-desc { font-size: 12px; color: var(--text-secondary); line-height: 1.55; }
        .wip-tag { display: inline-block; background: var(--accent-light); color: var(--accent); font-size: 10px; font-weight: 600; letter-spacing: 0.06em; padding: 3px 8px; border-radius: 4px; margin-top: auto; width: fit-content; }
        footer { border-top: 0.5px solid var(--border); padding: 1.25rem 2rem; text-align: center; font-size: 12px; color: var(--text-secondary); }
      `}</style>

      <nav>
        <div className="logo">RAAH <span>by RV CSE</span></div>
        <div className="nav-right">
          {user && (
            <div className="user-pill">
              <img src={user.photoURL} alt="avatar" />
              <span>{user.displayName.split(" ")[0]}</span>
              <button className="logout-btn" onClick={logout}>· sign out</button>
            </div>
          )}
          <button className="theme-btn" onClick={() => setDark(d => !d)}>
            {dark ? "☀" : "☾"}
          </button>
        </div>
      </nav>

      <div className="hero">
        <div className="crane-wrap">
          <svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" style={{width:"100%"}}>
            <rect x="0" y="300" width="560" height="20" fill="var(--border)" rx="2"/>
            <rect x="380" y="200" width="28" height="100" fill="#8a8a7a" rx="3"/>
            <rect x="365" y="290" width="58" height="12" fill="#6a6a5a" rx="2"/>
            <rect x="387" y="60" width="14" height="145" fill="#b0aa96" rx="2"/>
            <line x1="387" y1="80" x2="401" y2="95" stroke="var(--bg)" strokeWidth="1.5"/>
            <line x1="401" y1="80" x2="387" y2="95" stroke="var(--bg)" strokeWidth="1.5"/>
            <line x1="387" y1="110" x2="401" y2="125" stroke="var(--bg)" strokeWidth="1.5"/>
            <line x1="401" y1="110" x2="387" y2="125" stroke="var(--bg)" strokeWidth="1.5"/>
            <line x1="387" y1="140" x2="401" y2="155" stroke="var(--bg)" strokeWidth="1.5"/>
            <line x1="401" y1="140" x2="387" y2="155" stroke="var(--bg)" strokeWidth="1.5"/>
            <line x1="387" y1="170" x2="401" y2="185" stroke="var(--bg)" strokeWidth="1.5"/>
            <line x1="401" y1="170" x2="387" y2="185" stroke="var(--bg)" strokeWidth="1.5"/>
            <rect x="160" y="54" width="250" height="12" fill="#b0aa96" rx="2"/>
            <rect x="395" y="54" width="80" height="10" fill="#8a8a7a" rx="2"/>
            <rect x="383" y="46" width="22" height="14" fill="#8a8a7a" rx="2"/>
            <line x1="260" y1="66" x2="260" y2="106" stroke="#666" strokeWidth="2"/>
            <line x1="300" y1="66" x2="300" y2="106" stroke="#666" strokeWidth="2"/>
            <path d="M278 106 Q280 116 284 112 Q290 106 284 100" stroke="#888" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <rect x="155" y="116" width="250" height="120" fill="var(--surface)" stroke="var(--border)" strokeWidth="1" rx="8"/>
            <rect x="155" y="116" width="250" height="28" fill="var(--accent)" rx="8"/>
            <rect x="155" y="132" width="250" height="12" fill="var(--accent)"/>
            <circle cx="175" cy="130" r="5" fill="rgba(255,255,255,0.5)"/>
            <circle cx="193" cy="130" r="5" fill="rgba(255,255,255,0.5)"/>
            <circle cx="211" cy="130" r="5" fill="rgba(255,255,255,0.5)"/>
            <text x="280" y="168" textAnchor="middle" fontSize="28" fontWeight="800" fontFamily="Georgia, serif" fill="var(--text-primary)" letterSpacing="6">RAAH</text>
            <text x="280" y="192" textAnchor="middle" fontSize="11" fill="var(--text-secondary)" fontFamily="system-ui, sans-serif" letterSpacing="2">COMING SOON</text>
            <rect x="175" y="208" width="210" height="14" rx="3" fill="var(--accent)" opacity="0.15"/>
            <text x="280" y="219" textAnchor="middle" fontSize="10" fill="var(--accent)" fontFamily="system-ui, sans-serif" fontWeight="600" letterSpacing="1">UNDER CONSTRUCTION</text>
            <rect x="430" y="60" width="32" height="22" fill="#6a6a5a" rx="3"/>
            <polygon points="80,300 95,260 110,300" fill="#e24b4a"/>
            <rect x="75" y="298" width="40" height="6" fill="#c43c3c" rx="1"/>
            <rect x="82" y="278" width="26" height="5" fill="#fff" opacity="0.6"/>
            <polygon points="460,300 475,268 490,300" fill="#e24b4a"/>
            <rect x="455" y="298" width="40" height="6" fill="#c43c3c" rx="1"/>
            <rect x="462" y="282" width="26" height="5" fill="#fff" opacity="0.6"/>
            <rect x="100" y="288" width="50" height="6" fill="#8a8a7a" rx="3"/>
            <rect x="490" y="285" width="40" height="8" fill="#8a8a7a" rx="3"/>
          </svg>
        </div>

        <div className="coming-soon-label">Coming Soon</div>
        <h1>Your <em>RAAH</em> to the<br/>right college starts here.</h1>
        <p className="subtitle">
          Honest COMEDK counselling guidance by RVCE seniors — real cutoffs, real advice, no scams
        </p>

        {user ? (
          <>
            <div className="success-msg">
              ✓ Hey {user.displayName.split(" ")[0]}! You're on the early access list — we'll notify you when we launch.
            </div>
            <p className="note">{user.email}</p>
          </>
        ) : (
          <>
            <button className="google-btn" onClick={loginWithGoogle}>
              <svg className="google-icon" viewBox="0 0 18 18">
                <path fill="#fff" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" opacity="0.9"/>
                <path fill="#fff" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" opacity="0.9"/>
                <path fill="#fff" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" opacity="0.9"/>
                <path fill="#fff" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" opacity="0.9"/>
              </svg>
              Get early access with Google
            </button>
            <p className="note">Free · No spam · We'll notify you on launch</p>
          </>
        )}
      </div>

      <div className="features">
        <p className="features-label">What we're building</p>
        <div className="grid">
          <div className="feature-card">
            <div className="feature-icon">📄</div>
            <div className="feature-title">Document Verification Guide</div>
            <div className="feature-desc">Step-by-step COMEDK document checklist so you never get rejected at verification.</div>
            <span className="wip-tag">IN PROGRESS</span>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <div className="feature-title">Placement Data</div>
            <div className="feature-desc">Real placement stats from RV, CMRIT,NIE-MYSORE,JSS, BMS & MSRIT — branch-wise, year-wise.</div>
            <span className="wip-tag">IN PROGRESS</span>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏫</div>
            <div className="feature-title">Best College Finder</div>
            <div className="feature-desc">Enter your rank and preferences — we tell you the best realistic options.</div>
            <span className="wip-tag">IN PROGRESS</span>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧑‍🏫</div>
            <div className="feature-title">1-on-1 Mentorship</div>
            <div className="feature-desc">Direct call with us
            <span className="wip-tag">IN PROGRESS</span>
          </div>
        </div>
      </div>

      <footer>
        Built by students at RV College of Engineering, Bengaluru 
      </footer>
    </>
  );
}
