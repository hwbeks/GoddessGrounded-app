import { T, css } from "../theme";
import { useState } from "react";

const CATEGORY_LABELS = {
  self_connection: "Self connection",
  self_awareness: "Self awareness",
  naming_needs: "Naming needs",
  boundaries: "Boundaries",
  identity: "Identity",
  presence: "Presence",
  reconnection: "Reconnection",
  appreciation: "Appreciation",
  avoidance: "Avoidance",
};

export default function TipsTab({ tips, onRateTip }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [rated, setRated] = useState({});

  const tip = tips[activeIndex];

  if (!tip) {
    return (
      <div style={{ padding: "48px 24px", textAlign: "center", color: T.muted }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>🌿</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontStyle: "italic" }}>
          Your tips are on their way...
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px 24px 0" }}>
      <div style={{ fontSize: 10, letterSpacing: 5, textTransform: "uppercase", color: T.muted, marginBottom: 16 }}>
        Daily tip
      </div>

      {/* Tip card */}
      <div style={{ ...css.card, borderLeft: `3px solid ${T.accentLight}`, marginBottom: 20 }}>
        <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: T.accentLight, marginBottom: 12 }}>
          {CATEGORY_LABELS[tip.category_tag] || tip.category_tag}
          {tip.difficulty && (
            <span style={{ marginLeft: 10, opacity: 0.6 }}>
              {"·".repeat(tip.difficulty)}
            </span>
          )}
        </div>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontSize: 20,
          lineHeight: 1.6,
          color: T.accentDark,
          marginBottom: 20,
        }}>
          {tip.content}
        </p>

        {!rated[tip.id] ? (
          <div>
            <div style={{ fontSize: 11, color: T.muted, letterSpacing: 2, marginBottom: 10 }}>
              Does this resonate?
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => { onRateTip(tip.id, "up"); setRated((r) => ({ ...r, [tip.id]: "up" })); }}
                style={{ flex: 1, background: T.accentSoft, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px", fontSize: 20, cursor: "pointer" }}
              >
                🌿
              </button>
              <button
                onClick={() => { onRateTip(tip.id, "down"); setRated((r) => ({ ...r, [tip.id]: "down" })); }}
                style={{ flex: 1, background: T.accentSoft, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px", fontSize: 20, cursor: "pointer" }}
              >
                🌫️
              </button>
            </div>
          </div>
        ) : (
          <div style={{ fontSize: 12, color: T.muted, textAlign: "center", letterSpacing: 2 }}>
            {rated[tip.id] === "up" ? "Beautiful. Carry it with you today." : "Noted — we'll find a better fit."}
          </div>
        )}
      </div>

      {/* Navigation */}
      {tips.length > 1 && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button
            onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
            style={{ ...css.btnGhost, width: "auto", padding: "10px 20px", fontSize: 12 }}
            disabled={activeIndex === 0}
          >
            ← Previous
          </button>
          <span style={{ fontSize: 11, color: T.muted, letterSpacing: 2 }}>
            {activeIndex + 1} / {tips.length}
          </span>
          <button
            onClick={() => setActiveIndex((i) => Math.min(tips.length - 1, i + 1))}
            style={{ ...css.btnGhost, width: "auto", padding: "10px 20px", fontSize: 12 }}
            disabled={activeIndex === tips.length - 1}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
