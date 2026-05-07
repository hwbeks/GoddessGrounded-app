import { T, css } from "../theme";
import { supabase } from "../supabase";
import { useState, useEffect } from "react";

const QUESTIONS = [
  "What did I feel today that I didn't say out loud?",
  "Where did I make myself smaller today — and why?",
  "What did I need today that I didn't ask for?",
  "What am I carrying right now that isn't mine to carry?",
  "When did I feel most like myself today?",
  "What would I tell a friend who felt what I'm feeling right now?",
  "What boundary did I hold today — or wish I had?",
  "What drained my energy today, and what restored it?",
  "Is there something I've been avoiding? What would it feel like to stop?",
  "What did I appreciate about myself today?",
  "What feeling am I least comfortable sitting with right now?",
  "Where in my body do I feel tension? What might it be telling me?",
  "What would 'enough' look like for me today?",
  "What do I need more of in my life right now?",
  "What am I afraid to want?",
  "What would I do today if I knew it was enough just to try?",
  "When did I last feel truly rested — not just physically, but in myself?",
  "What have I been telling myself that might not be true?",
  "What does the grounded version of me know that I sometimes forget?",
  "What would I say to myself at the end of today if I could only say one thing?",
  "What connection did I feel today — to myself, to others, to something bigger?",
  "What did I give today, and what did I receive?",
  "Where did I show up fully today — and where did I hold back?",
  "What would it mean to truly trust myself in this moment?",
  "What am I grateful for that I haven't said thank you for?",
  "If today had a colour, what would it be — and why?",
  "What do I want to let go of before tomorrow?",
  "What does my body need that my mind keeps ignoring?",
  "What small thing today reminded me that I matter?",
  "If I could change one thing about how I showed up today, what would it be?",
];

function getTodayQuestion() {
  const start = new Date("2026-01-01");
  const today = new Date();
  const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  return QUESTIONS[diff % QUESTIONS.length];
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}

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

export default function ReflectTab({ tips, onRateTip, currentUser }) {
  const [tipRated, setTipRated] = useState(false);
  const [todayEntry, setTodayEntry] = useState(null);
  const [answer, setAnswer] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [section, setSection] = useState("tip"); // "tip" | "journal"

  const todayQuestion = getTodayQuestion();
  const todayDate = new Date().toISOString().split("T")[0];
  const tip = tips && tips.length > 0 ? tips[0] : null;

  useEffect(() => {
    async function loadEntry() {
      let user = currentUser;
      if (!user) {
        const { data: { user: freshUser } } = await supabase.auth.getUser();
        user = freshUser;
      }
      if (!user) return;

      const { data } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .eq("entry_date", todayDate)
        .maybeSingle();

      if (data) {
        setTodayEntry(data);
        setAnswer(data.answer || "");
      }
    }
    loadEntry();
  }, [currentUser, todayDate]);

  async function saveEntry() {
    if (!answer.trim()) return;
    setSaving(true);

    let user = currentUser;
    if (!user) {
      const { data: { user: freshUser } } = await supabase.auth.getUser();
      user = freshUser;
    }
    if (!user) return;

    if (todayEntry) {
      await supabase.from("journal_entries").update({ answer: answer.trim() }).eq("id", todayEntry.id);
      setTodayEntry({ ...todayEntry, answer: answer.trim() });
    } else {
      const { data } = await supabase.from("journal_entries").insert({
        user_id: user.id,
        question: todayQuestion,
        answer: answer.trim(),
        entry_date: todayDate,
      }).select().single();
      if (data) setTodayEntry(data);
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div style={{ padding: "24px 24px 0" }}>

      {/* Date */}
      <div style={{ fontSize: 11, color: T.muted, letterSpacing: 2, marginBottom: 20 }}>
        {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
      </div>

      {/* Section toggle */}
      <div style={{ display: "flex", gap: 0, border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden", marginBottom: 24 }}>
        {[{ id: "tip", label: "Today's tip" }, { id: "journal", label: "Reflect" }].map((s) => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            style={{
              flex: 1,
              padding: "10px 14px",
              fontSize: 11,
              fontFamily: "'Jost', sans-serif",
              fontWeight: section === s.id ? 500 : 300,
              background: section === s.id ? T.accent : "transparent",
              color: section === s.id ? T.bg : T.muted,
              border: "none",
              cursor: "pointer",
              letterSpacing: 1,
              textTransform: "uppercase",
              transition: "all 0.2s",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* TIP SECTION */}
      {section === "tip" && (
        <div>
          {tip ? (
            <div style={{ ...css.card, borderLeft: `3px solid ${T.accentLight}`, marginBottom: 16 }}>
              <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: T.accentLight, marginBottom: 10 }}>
                {CATEGORY_LABELS[tip.category_tag] || tip.category_tag}
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

              {!tipRated ? (
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => { onRateTip("up"); setTipRated(true); }}
                    style={{
                      flex: 1,
                      background: T.accentSoft,
                      border: `1px solid ${T.border}`,
                      borderRadius: 10,
                      padding: "11px 8px",
                      fontSize: 12,
                      fontFamily: "'Jost', sans-serif",
                      fontWeight: 500,
                      letterSpacing: 1,
                      color: T.accentDark,
                      cursor: "pointer",
                    }}
                  >
                    This resonates
                  </button>
                  <button
                    onClick={() => { onRateTip("down"); setTipRated(true); }}
                    style={{
                      flex: 1,
                      background: "transparent",
                      border: `1px solid ${T.border}`,
                      borderRadius: 10,
                      padding: "11px 8px",
                      fontSize: 12,
                      fontFamily: "'Jost', sans-serif",
                      fontWeight: 300,
                      letterSpacing: 1,
                      color: T.muted,
                      cursor: "pointer",
                    }}
                  >
                    Not for me
                  </button>
                </div>
              ) : (
                <div style={{ fontSize: 12, color: T.muted, textAlign: "center", letterSpacing: 2 }}>
                  {tipRated === true ? "Thank you for your reflection." : ""}
                </div>
              )}
            </div>
          ) : (
            <div style={{ ...css.card, textAlign: "center", color: T.muted, fontSize: 14, padding: "32px 24px" }}>
              Your daily tip is on its way...
            </div>
          )}

          <button
            onClick={() => setSection("journal")}
            style={{ ...css.btnGhost, fontSize: 11, marginTop: 8 }}
          >
            Continue to today's reflection →
          </button>
        </div>
      )}

      {/* JOURNAL SECTION */}
      {section === "journal" && (
        <div>
          <div style={{ ...css.card, borderLeft: `3px solid ${T.accentLight}`, marginBottom: 16 }}>
            <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: T.accentLight, marginBottom: 10 }}>
              Today's question
            </div>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontSize: 20,
              lineHeight: 1.5,
              color: T.accentDark,
            }}>
              {todayQuestion}
            </p>
          </div>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Write whatever comes. There's no right answer."
            rows={6}
            style={{
              width: "100%",
              background: T.card,
              border: `1px solid ${answer ? T.accentLight : T.border}`,
              borderRadius: 12,
              padding: "16px 18px",
              fontSize: 15,
              color: T.text,
              fontFamily: "'Jost', sans-serif",
              fontWeight: 300,
              lineHeight: 1.7,
              outline: "none",
              resize: "none",
              transition: "border-color 0.2s",
              boxSizing: "border-box",
              marginBottom: 14,
            }}
          />

          <button
            style={{ ...css.btn, opacity: answer.trim() && !saving ? 1 : 0.4 }}
            onClick={saveEntry}
            disabled={!answer.trim() || saving}
          >
            {saving ? "Saving..." : saved ? "Saved ✓" : todayEntry ? "Update" : "Save"}
          </button>

          {!todayEntry && (
            <div style={{ ...css.card, background: T.warm, border: `1px solid ${T.border}`, marginTop: 16 }}>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontSize: 15,
                color: T.muted,
                lineHeight: 1.7,
              }}>
                "You don't have to write perfectly. You just have to write honestly."
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
