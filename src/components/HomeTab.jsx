import { T, css } from "../theme";
import { useState } from "react";

export default function HomeTab({
  tip,
  score,
  streak,
  partnerName,
  onCheckIn,
  onRateTip,
  weeklyRating,
  setWeeklyRating,
  tipRated,
  setTipRated,
  setScoreVersion,
}) {
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [checkInValue, setCheckInValue] = useState(null);

  const scoreColor =
    score >= 80 ? T.green : score >= 60 ? T.accent : score >= 40 ? T.accentLight : T.muted;

  async function handleCheckIn(val) {
    setCheckInValue(val);
    setWeeklyRating(val);
    await onCheckIn(val);
    setShowCheckIn(false);
    setScoreVersion((v) => v + 1);
  }

  return (
    <div style={{ padding: "0 0 24px" }}>
      {/* Daily intention */}
      <div style={{ padding: "24px 24px 0", marginBottom: 24 }}>
        <div style={{ fontSize: 10, letterSpacing: 5, textTransform: "uppercase", color: T.muted, marginBottom: 8 }}>
          Today's intention
        </div>
        {tip ? (
          <div style={{ ...css.card, borderLeft: `3px solid ${T.accentLight}` }}>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: T.text, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 18, marginBottom: 16 }}>
              {tip.content}
            </p>
            {!tipRated && (
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => { onRateTip("up"); setTipRated(true); }}
                  style={{ flex: 1, background: T.accentSoft, border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px", fontSize: 18, cursor: "pointer" }}
                >
                  🌿
                </button>
                <button
                  onClick={() => { onRateTip("down"); setTipRated(true); }}
                  style={{ flex: 1, background: T.accentSoft, border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px", fontSize: 18, cursor: "pointer" }}
                >
                  🌫️
                </button>
              </div>
            )}
            {tipRated && (
              <div style={{ fontSize: 12, color: T.muted, textAlign: "center", letterSpacing: 2 }}>
                Thank you for your reflection
              </div>
            )}
          </div>
        ) : (
          <div style={{ ...css.card, textAlign: "center", color: T.muted, fontSize: 14, padding: "32px 24px" }}>
            Your daily intention is on its way...
          </div>
        )}
      </div>

      {/* Weekly check-in */}
      <div style={{ padding: "0 24px", marginBottom: 24 }}>
        <div style={{ fontSize: 10, letterSpacing: 5, textTransform: "uppercase", color: T.muted, marginBottom: 8 }}>
          Weekly reflection
        </div>
        {!weeklyRating ? (
          <button
            onClick={() => setShowCheckIn(true)}
            style={{ ...css.card, width: "100%", textAlign: "left", cursor: "pointer", border: `1px dashed ${T.accentLight}` }}
          >
            <div style={{ fontSize: 14, color: T.accent, letterSpacing: 1 }}>How connected do you feel to yourself this week?</div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 6, letterSpacing: 1 }}>Tap to reflect →</div>
          </button>
        ) : (
          <div style={{ ...css.card, textAlign: "center" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>
              {weeklyRating >= 4 ? "🌸" : weeklyRating === 3 ? "🌿" : weeklyRating === 2 ? "🌫️" : "🌧️"}
            </div>
            <div style={{ fontSize: 12, color: T.muted, letterSpacing: 2 }}>
              {weeklyRating >= 4 ? "Deeply grounded" : weeklyRating === 3 ? "Finding my way" : weeklyRating === 2 ? "A little lost" : "Needing care"}
            </div>
          </div>
        )}
      </div>

      {/* Grounding reminder */}
      <div style={{ padding: "0 24px" }}>
        <div style={{ ...css.card, background: T.warm, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: T.muted, marginBottom: 8 }}>
            Remember
          </div>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 17, color: T.accentDark, lineHeight: 1.6 }}>
            "You don't have to lose yourself to love someone."
          </p>
        </div>
      </div>

      {/* Check-in modal */}
      {showCheckIn && (
        <div style={css.modal} onClick={() => setShowCheckIn(false)}>
          <div style={css.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 18, fontFamily: "'Cormorant Garamond', serif", color: T.accentDark, marginBottom: 6, fontStyle: "italic" }}>
              How connected do you feel to yourself this week?
            </div>
            <div style={{ fontSize: 13, color: T.muted, marginBottom: 24, lineHeight: 1.6 }}>
              Not to him, not to the relationship. To yourself.
            </div>
            {[
              { val: 4, emoji: "🌸", label: "Deeply grounded" },
              { val: 3, emoji: "🌿", label: "Finding my way" },
              { val: 2, emoji: "🌫️", label: "A little lost" },
              { val: 1, emoji: "🌧️", label: "Needing care" },
            ].map((opt) => (
              <button
                key={opt.val}
                onClick={() => handleCheckIn(opt.val)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  background: T.warm,
                  border: `1px solid ${T.border}`,
                  borderRadius: 12,
                  padding: "14px 18px",
                  marginBottom: 10,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span style={{ fontSize: 22 }}>{opt.emoji}</span>
                <span style={{ fontSize: 14, color: T.text, fontFamily: "'Jost', sans-serif", fontWeight: 400 }}>{opt.label}</span>
              </button>
            ))}
            <button style={{ ...css.btnGhost, marginTop: 8 }} onClick={() => setShowCheckIn(false)}>
              Not now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
