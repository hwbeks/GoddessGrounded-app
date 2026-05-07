import { T, css } from "../theme";
import { useState } from "react";

const QUOTES = [
  "You don't have to lose yourself to love someone.",
  "The most grounded version of you is the one who knows herself well enough to give from a full place.",
  "You are allowed to take up space.",
  "Coming back to yourself is not selfish. It's necessary.",
  "You can't pour from an empty cup — and you matter too.",
  "Being grounded doesn't mean having it all figured out. It means knowing yourself well enough to notice.",
  "You didn't become the easy one all at once. You can come back, one moment at a time.",
];

function getTodayQuote() {
  const start = new Date("2026-01-01");
  const today = new Date();
  const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  return QUOTES[diff % QUOTES.length];
}

export default function HomeTab({
  streak,
  weeklyRating,
  setWeeklyRating,
  onCheckIn,
  setScoreVersion,
}) {
  const [showCheckIn, setShowCheckIn] = useState(false);

  async function handleCheckIn(val) {
    setWeeklyRating(val);
    await onCheckIn(val);
    setShowCheckIn(false);
    setScoreVersion((v) => v + 1);
  }

  const todayQuote = getTodayQuote();
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long"
  });

  return (
    <div style={{ padding: "0 24px 24px" }}>

      {/* Date */}
      <div style={{ fontSize: 11, color: T.muted, letterSpacing: 2, marginBottom: 32 }}>
        {today}
      </div>

      {/* Daily quote */}
      <div style={{ marginBottom: 28 }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontSize: clamp(22, 28),
          lineHeight: 1.5,
          color: T.accentDark,
          marginBottom: 8,
        }}>
          "{todayQuote}"
        </p>
        <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: T.muted }}>
          GoddessGrounded
        </div>
      </div>

      {/* Weekly check-in — only if not done */}
      {!weeklyRating && (
        <div style={{ marginBottom: 24 }}>
          <button
            onClick={() => setShowCheckIn(true)}
            style={{
              ...css.card,
              width: "100%",
              textAlign: "left",
              cursor: "pointer",
              border: `1px dashed ${T.accentLight}`,
              background: T.warm,
            }}
          >
            <div style={{ fontSize: 14, color: T.accent, lineHeight: 1.6 }}>
              How connected do you feel to yourself this week?
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 6, letterSpacing: 1 }}>
              Tap to reflect →
            </div>
          </button>
        </div>
      )}

      {/* Streak — only if > 3 */}
      {streak > 3 && (
        <div style={{ ...css.card, textAlign: "center" }}>
          <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: T.muted, marginBottom: 8 }}>
            You've shown up
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, color: T.accent, marginBottom: 4 }}>
            {streak}
          </div>
          <div style={{ fontSize: 11, color: T.muted, letterSpacing: 2, textTransform: "uppercase" }}>
            days in a row
          </div>
        </div>
      )}

      {/* Check-in modal */}
      {showCheckIn && (
        <div style={css.modal} onClick={() => setShowCheckIn(false)}>
          <div style={css.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 18, fontFamily: "'Cormorant Garamond', serif", color: T.accentDark, marginBottom: 6, fontStyle: "italic" }}>
              How connected do you feel to yourself this week?
            </div>
            <div style={{ fontSize: 13, color: T.muted, marginBottom: 24, lineHeight: 1.6 }}>
              Not to anyone else. To yourself.
            </div>
            {[
              { val: 4, emoji: "🌸", label: "Deeply grounded" },
              { val: 3, emoji: "🌿", label: "Finding my way" },
              { val: 2, emoji: "🌱", label: "A little lost" },
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

function clamp(min, max) {
  return `clamp(${min}px, 4vw, ${max}px)`;
}
