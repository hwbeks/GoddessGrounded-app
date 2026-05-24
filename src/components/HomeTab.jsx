import { T, css } from "../theme";
import { supabase } from "../supabase";
import { useState, useEffect } from "react";
import FirstAidKit from "./FirstAidKit";

const QUOTES = [
  "You don't have to lose yourself to love someone.",
  "The most grounded version of you is the one who knows herself well enough to give from a full place.",
  "You are allowed to take up space.",
  "Coming back to yourself is not selfish. It's necessary.",
  "You can't pour from an empty cup — and you matter too.",
  "Being grounded doesn't mean having it all figured out. It means knowing yourself well enough to notice.",
  "You didn't become the easy one all at once. You can come back, one moment at a time.",
];

const CATEGORY_LABELS = {
  self_connection: "self connection",
  self_awareness: "self awareness",
  naming_needs: "naming your needs",
  boundaries: "boundaries",
  identity: "your sense of self",
  presence: "presence",
};

function getTodayQuote() {
  const start = new Date("2026-01-01");
  const today = new Date();
  const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  return QUOTES[diff % QUOTES.length];
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getWeakestCategory(assessment) {
  if (!assessment) return null;
  const scores = [
    { key: "self_connection", score: assessment.self_connection || 3 },
    { key: "self_awareness", score: assessment.self_awareness || 3 },
    { key: "naming_needs", score: assessment.naming_needs || 3 },
    { key: "boundaries", score: assessment.boundaries || 3 },
    { key: "identity", score: assessment.identity || 3 },
    { key: "presence", score: assessment.presence || 3 },
  ].sort((a, b) => a.score - b.score);
  return scores[0].key;
}

export default function HomeTab({
  streak,
  weeklyRating,
  setWeeklyRating,
  onCheckIn,
  setScoreVersion,
  userData,
  tips,
  onRateTip,
  currentUser,
  assessment,
  setTab,
  showFirstAidKit,
  setShowFirstAidKit,
}) {
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [tipRated, setTipRated] = useState(false);
  const [todayTipRated, setTodayTipRated] = useState(null);

  // Check on mount whether user has already rated a tip today
  useEffect(() => {
    async function checkTodayRating() {
      if (!currentUser) {
        setTodayTipRated(false);
        return;
      }

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const { data } = await supabase
        .from("seen_tips")
        .select("id")
        .eq("user_id", currentUser.id)
        .not("rating", "is", null)
        .gte("seen_at", startOfDay.toISOString())
        .limit(1)
        .maybeSingle();

      setTodayTipRated(!!data);
    }
    checkTodayRating();
  }, [currentUser, tipRated]);

  async function handleCheckIn(val) {
    setWeeklyRating(val);
    await onCheckIn(val);
    setShowCheckIn(false);
    setScoreVersion((v) => v + 1);
  }

  async function handleRateTip(tipId, rating) {
    await onRateTip(tipId, rating);
    setTipRated(true);
  }

  const todayQuote = getTodayQuote();
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long"
  });
  const greeting = getGreeting();
  const name = userData?.name || null;
  const weakestCategory = getWeakestCategory(assessment);
  const todayTip = tips && tips.length > 0 ? tips[0] : null;

  return (
    <div style={{ padding: "0 24px 24px" }}>

      {/* Personal greeting */}
      {name && (
        <div style={{ marginBottom: 8 }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: 22,
            color: T.accentDark,
            lineHeight: 1.3,
          }}>
            {greeting}, {name}
          </div>
        </div>
      )}

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

      {/* Daily tip with rating — only if not yet rated today */}
      {todayTip && todayTipRated === false && (
        <div style={{ ...css.card, marginBottom: 24 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: T.muted, marginBottom: 12 }}>
            Today's reflection
          </div>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 18,
            lineHeight: 1.6,
            color: T.text,
            marginBottom: 16,
          }}>
            {todayTip.content}
          </p>
          {weakestCategory && CATEGORY_LABELS[weakestCategory] && (
            <div style={{ fontSize: 11, color: T.muted, fontStyle: "italic", marginBottom: 16, lineHeight: 1.5 }}>
              From your reflection — {CATEGORY_LABELS[weakestCategory]}
            </div>
          )}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => handleRateTip(todayTip.id, "up")}
              style={{
                flex: 1,
                background: T.warm,
                border: `1px solid ${T.accentLight}`,
                borderRadius: 10,
                padding: "10px 14px",
                fontSize: 12,
                color: T.accent,
                cursor: "pointer",
                fontFamily: "'Jost', sans-serif",
              }}
            >
              This resonates
            </button>
            <button
              onClick={() => handleRateTip(todayTip.id, "down")}
              style={{
                flex: 1,
                background: "transparent",
                border: `1px solid ${T.border}`,
                borderRadius: 10,
                padding: "10px 14px",
                fontSize: 12,
                color: T.muted,
                cursor: "pointer",
                fontFamily: "'Jost', sans-serif",
              }}
            >
              Not for me
            </button>
          </div>
        </div>
      )}

      {/* Persistent post-rating card — shown when today's tip is rated */}
      {todayTipRated === true && (
        <div style={{ ...css.card, marginBottom: 24, textAlign: "center", padding: "24px 20px" }}>
          <div style={{ fontSize: 22, marginBottom: 12 }}>🌿</div>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: 16,
            color: T.text,
            lineHeight: 1.6,
            marginBottom: 16,
          }}>
            Today's reflection has been with you.
          </div>
          <div style={{
            fontSize: 12,
            color: T.muted,
            lineHeight: 1.7,
            marginBottom: 16,
          }}>
            What resonates is saved to your reflections,
            ready when you want to return.
          </div>
          <button
            onClick={() => setTab && setTab("reflect")}
            style={{
              background: "transparent",
              border: "none",
              color: T.accent,
              fontSize: 12,
              fontFamily: "'Jost', sans-serif",
              letterSpacing: 1,
              cursor: "pointer",
              padding: "8px 16px",
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            View your reflections →
          </button>
        </div>
      )}

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

      {/* First Aid Kit */}
      <FirstAidKit showFirstAidKit={showFirstAidKit} setShowFirstAidKit={setShowFirstAidKit} />

    </div>
  );
}

function clamp(min, max) {
  return `clamp(${min}px, 4vw, ${max}px)`;
}
