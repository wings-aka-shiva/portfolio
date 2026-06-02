import { useEffect, useMemo, useState } from "react";
import emailjs from "@emailjs/browser";

const WORDS = [
  "Yarra Valley", "Dandenong Ranges", "St Kilda Beach",
  "Great Ocean Road", "Mornington Peninsula", "Mt Sturgeon",
  "Healesville", "Warburton", "Twisted Games", "Long Drives",
  "Mornington", "Phillip Island", "Yarra River", "Fitzroy",
  "Mount Dandenong",
];

const PILLS: { label: string; isYes: boolean }[] = [
  { label: "Nope",          isYes: false },
  { label: "Not really",    isYes: false },
  { label: "No thanks",     isYes: false },
  { label: "Hard no",       isYes: false },
  { label: "Yes! 🌿",       isYes: true  },
  { label: "Absolutely not",isYes: false },
  { label: "Maybe not",     isYes: false },
  { label: "Nah",           isYes: false },
  { label: "Never",         isYes: false },
  { label: "No way",        isYes: false },
  { label: "Pass",          isYes: false },
  { label: "Not a chance",  isYes: false },
  { label: "No 🙂",         isYes: false },
];

interface BgWord {
  text: string;
  x: number;
  y: number;
  size: number;
  rot: number;
}

function useBgWords(): BgWord[] {
  return useMemo(() => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const cols = 4;
    const rows = 5;
    const cellW = W / cols;
    const cellH = H / rows;

    return WORDS.map((text, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const jitterX = (Math.random() - 0.5) * cellW * 0.6;
      const jitterY = (Math.random() - 0.5) * cellH * 0.6;
      return {
        text,
        x:    cellW * col + cellW / 2 + jitterX,
        y:    cellH * row + cellH / 2 + jitterY,
        size: 0.7 + Math.random() * 0.9,
        rot:  (Math.random() - 0.5) * 18,
      };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export default function BeKind() {
  const [modalOpen, setModalOpen] = useState(false);
  const [success,   setSuccess]   = useState(false);
  const [selected,  setSelected]  = useState<string | null>(null);

  const bgWords = useBgWords();

  useEffect(() => {
    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap";
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes bk-pop-in  { from { transform: scale(0.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      @keyframes bk-fade-in { from { opacity: 0; } to { opacity: 1; } }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  if (success) {
    return (
      <div style={{
        position: "fixed", inset: 0,
        background: "#f43f5e",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", textAlign: "center", padding: "2rem",
        fontFamily: "'Poppins', sans-serif",
        animation: "bk-fade-in 0.4s ease",
      }}>
        <p style={{ fontSize: "3.5rem", fontWeight: 700, color: "#fff", marginBottom: "1rem", lineHeight: 1.2 }}>
          Yay! 🌿
        </p>
        <p style={{ fontSize: "1.3rem", fontWeight: 400, color: "rgba(255,255,255,0.9)" }}>
          Can't wait — ping me and let's make it happen 💬
        </p>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      backgroundColor: "#fff5f0",
      minHeight: "100vh",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* background word canvas */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {bgWords.map((w, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              left: w.x, top: w.y,
              color: "#f43f5e",
              opacity: 0.07,
              fontWeight: 500,
              fontSize: `${w.size}rem`,
              whiteSpace: "nowrap",
              userSelect: "none",
              transform: `translate(-50%, -50%) rotate(${w.rot}deg)`,
            }}
          >
            {w.text}
          </span>
        ))}
      </div>

      {/* main content */}
      <div style={{
        position: "relative", zIndex: 10,
        minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ textAlign: "center", maxWidth: 560, padding: "2rem 2.5rem" }}>
          <p style={{
            fontSize: "0.8rem", fontWeight: 400, color: "#f43f5e",
            letterSpacing: "0.12em", textTransform: "lowercase",
            marginBottom: "0.75rem", fontStyle: "italic",
          }}>
            a small question...
          </p>
          <h1 style={{
            fontSize: "2.6rem", fontWeight: 700, color: "#3d1a1a",
            marginBottom: "1.2rem", lineHeight: 1.15,
          }}>
            Hey Ms NOYB,
          </h1>
          <p style={{
            fontSize: "1.05rem", fontWeight: 400, color: "#7c4a4a",
            lineHeight: 1.75, marginBottom: "2rem",
          }}>
            I've been thinking about this for a while.<br />
            Would you like to go on a date with me? 🌿
          </p>

          {/* pill grid */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "12px",
          }}>
            {PILLS.map((pill) => (
              <button
                key={pill.label}
                onClick={() => {
                  emailjs.send(
                    import.meta.env.VITE_EMAILJS_SERVICE_ID,
                    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                    {
                      name: "Ms NOYB",
                      email: "shivatirupathi10@gmail.com",
                      message: `Shreya clicked: "${pill.label}" 🌿`,
                    },
                    import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
                  ).catch(() => {});

                  if (pill.isYes) {
                    setSuccess(true);
                  } else {
                    setSelected("Yes! 🌿");
                    setModalOpen(true);
                  }
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  borderRadius: 999,
                  border: `2px solid ${selected === pill.label ? "#f43f5e" : "#f9c0c0"}`,
                  background: "#fff",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "14px",
                  fontWeight: selected === pill.label ? 600 : 400,
                  color: selected === pill.label ? "#f43f5e" : "#888",
                  cursor: "pointer",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = selected === pill.label
                    ? "0 4px 16px rgba(244,63,94,0.3)"
                    : "0 2px 8px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                }}
              >
                {/* radio indicator circle */}
                <span style={{
                  display: "inline-block",
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  border: `2px solid ${selected === pill.label ? "#f43f5e" : "#f9c0c0"}`,
                  background: selected === pill.label ? "#f43f5e" : "transparent",
                  flexShrink: 0,
                }} />
                {pill.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* modal overlay */}
      {modalOpen && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(61,26,26,0.25)",
            backdropFilter: "blur(3px)",
            zIndex: 100,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <div style={{
            background: "#fff5f0",
            borderRadius: "1.5rem",
            padding: "2.2rem 2.8rem",
            textAlign: "center",
            maxWidth: 340,
            width: "90%",
            boxShadow: "0 12px 48px rgba(244,63,94,0.18)",
            animation: "bk-pop-in 0.22s ease",
          }}>
            <p style={{
              fontSize: "1.15rem", fontWeight: 500,
              color: "#7c4a4a", lineHeight: 1.6, marginBottom: "1.6rem",
            }}>
              Come on, Mean again? 🥺
            </p>
            <button
              onClick={() => setModalOpen(false)}
              style={{
                background: "#f43f5e",
                color: "#fff",
                fontFamily: "'Poppins', sans-serif",
                fontSize: "0.9rem",
                fontWeight: 600,
                padding: "0.65rem 2rem",
                border: "none",
                borderRadius: 9999,
                cursor: "pointer",
                boxShadow: "0 3px 14px rgba(244,63,94,0.3)",
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
