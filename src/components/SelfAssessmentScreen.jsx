import { T, css } from "../theme";
import { useState } from "react";
import { supabase } from "../supabase";

const CATEGORIES = [
  {
    key: "self_connection",
    label: "Self connection",
    question: "How connected do you feel to yourself?",
    sub: "Do you still know what you feel, want, and need — independent of others?",
  },
  {
    key: "self_awareness",
    label: "Self awareness",
    question: "How aware are you of the moments when you make yourself smaller?",
    sub: "Do you notice when you adjust yourself to keep others comfortable?",
  },
  {
    key: "naming_needs",
    label: "Naming needs",
    question: "How easily do you express what you need?",
    sub: "Can you say what you need clearly and without guilt?",
  },
  {
    key: "boundaries",
    label: "Boundaries",
    question: "How comfortable are you saying no without feeling guilty?",
    sub: "Can you hold a boundary without over-explaining it?",
  },
  {
    key: "identity",
    label: "Identity",
    question: "How much space do you have for yourself?",
    sub: "Do you still have your own interests, friendships, and dreams?",
  },
  {
    key: "presence",
    label: "Presence",
    question: "How present are you in your daily life — not on autopilot?",
    sub: "Are you here, or are you just going through the motions?",
  },
];

const SCALE = [
  { val: 1, label: "Rarely" },
  { val: 2, label: "Sometimes" },
  { val: 3, label: "Often" },
  { val: 4, label: "Almost always" },
];

export default function SelfAssessmentScreen({ onDone, onSkip, currentUser }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [saving, setSaving] = useState(false);

  const current = CATEGORIES[step];
  const isLast = step === CATEGORIES.length - 1;
  const selected = answers[current.key];

  async function saveAndContinue() {
    if (!selected) return;
    const next = { ...answers, [current.key]: selected };
    setAnswers(next);

    if (!isLast) {
      setStep((s) => s + 1);
      return;
    }

    setSaving(true);
    let user = currentUser;
    if (!user) {
      const { data: { user: freshUser } } = await supabase.auth.getUser();
      user = freshUser;
    }
    if (user) {
      await supabase.from("assessments").insert({
        user_id: user.id,
        ...next,
        created_at: new Date().toISOString(),
      });
      await supabase.from("user_preferences").upsert({
        user_id: user.id,
        assessment_completed_at: new Date().toISOString(),
      }, { onConflict: "user_id" });
    }
    setSaving(false);
    onDone();
  }

  return (
    <div style={{ ...css.page, justifyContent: "flex-start", paddingTop: 48 }}>
      {/* Progress */}
      <div style={{ display: "flex", gap: 6, marginBottom: 40 }}>
        {CATEGORIES.map((_, i) => (
          <div
            key={i}
            style={{
              height: 3,
              flex: 1,
              borderRadius: 2,
              background: i <= step ? T.accent : T.border,
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>

      {/* Label */}
      <div style={{ fontSize: 10, letterSpacing: 5, textTransform: "uppercase", color: T.accentLight, marginBottom: 12 }}>
        {step + 1} of {CATEGORIES.length} · {current.label}
      </div>

      {/* Question */}
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 300, color: T.accentDark, lineHeight: 1.3, marginBottom: 10 }}>
        {current.question}
      </div>
      <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, marginBottom: 32 }}>
        {current.sub}
      </div>

      {/* Scale */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
        {SCALE.map((opt) => (
          <button
            key={opt.val}
            onClick={() => setAnswers((a) => ({ ...a, [current.key]: opt.val }))}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              background: selected === opt.val ? T.accentSoft : T.card,
              border: `1px solid ${selected === opt.val ? T.accent : T.border}`,
              borderRadius: 12,
              padding: "16px 20px",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.2s",
            }}
          >
            <div style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              border: `2px solid ${selected === opt.val ? T.accent : T.border}`,
              background: selected === opt.val ? T.accent : "transparent",
              flexShrink: 0,
              transition: "all 0.2s",
            }} />
            <div>
              <div style={{ fontSize: 14, color: T.text, fontWeight: selected === opt.val ? 500 : 300 }}>{opt.label}</div>
            </div>
          </button>
        ))}
      </div>

      <button
        style={{ ...css.btn, opacity: selected && !saving ? 1 : 0.4 }}
        onClick={saveAndContinue}
        disabled={!selected || saving}
      >
        {saving ? "Saving..." : isLast ? "Complete →" : "Continue →"}
      </button>

      <button style={{ ...css.btnGhost, marginTop: 10 }} onClick={onSkip}>
        Skip for now
      </button>
    </div>
  );
}
