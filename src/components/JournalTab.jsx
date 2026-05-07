import { T, css } from "../theme";
import { supabase } from "../supabase";
import { useState, useEffect } from "react";

// 30 rotating daily reflection questions
// Questions 1-20: universal (both journeys)
// Questions 21-30: relationship-aware (shown for both but written neutrally)
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
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long" });
}

export default function JournalTab({ currentUser, journey }) {
  const [todayEntry, setTodayEntry] = useState(null);
  const [pastEntries, setPastEntries] = useState([]);
  const [answer, setAnswer] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("today"); // "today" | "history"
  const [expandedId, setExpandedId] = useState(null);

  const todayQuestion = getTodayQuestion();
  const todayDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    async function load() {
      let user = currentUser;
      if (!user) {
        const { data: { user: freshUser } } = await supabase.auth.getUser();
        user = freshUser;
      }
      if (!user) return;

      // Load today's entry
      const { data: today } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .eq("entry_date", todayDate)
        .maybeSingle();

      if (today) {
        setTodayEntry(today);
        setAnswer(today.answer || "");
      }

      // Load past entries
      const { data: past } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .neq("entry_date", todayDate)
        .order("entry_date", { ascending: false })
        .limit(20);

      if (past) setPastEntries(past);
      setLoading(false);
    }
    load();
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
      await supabase
        .from("journal_entries")
        .update({ answer: answer.trim() })
        .eq("id", todayEntry.id);
      setTodayEntry({ ...todayEntry, answer: answer.trim() });
    } else {
      const { data } = await supabase
        .from("journal_entries")
        .insert({
          user_id: user.id,
          question: todayQuestion,
          answer: answer.trim(),
          entry_date: todayDate,
        })
        .select()
        .single();
      if (data) setTodayEntry(data);
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading) {
    return (
      <div style={{ padding: "48px 24px", textAlign: "center", color: T.muted }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🍃</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px 24px 0" }}>

      {/* Header + toggle */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 10, letterSpacing: 5, textTransform: "uppercase", color: T.muted }}>
          Journal
        </div>
        <div style={{ display: "flex", gap: 0, border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden" }}>
          {["today", "history"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: "7px 14px",
                fontSize: 11,
                fontFamily: "'Jost', sans-serif",
                fontWeight: view === v ? 500 : 300,
                background: view === v ? T.accent : "transparent",
                color: view === v ? T.bg : T.muted,
                border: "none",
                cursor: "pointer",
                letterSpacing: 1,
                textTransform: "uppercase",
                transition: "all 0.2s",
              }}
            >
              {v === "today" ? "Today" : "History"}
            </button>
          ))}
        </div>
      </div>

      {/* TODAY VIEW */}
      {view === "today" && (
        <div>
          {/* Date */}
          <div style={{ fontSize: 11, color: T.muted, letterSpacing: 2, marginBottom: 20 }}>
            {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
          </div>

          {/* Question card */}
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

          {/* Answer textarea */}
          <div style={{ marginBottom: 14 }}>
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
              }}
            />
          </div>

          <button
            style={{
              ...css.btn,
              opacity: answer.trim() && !saving ? 1 : 0.4,
            }}
            onClick={saveEntry}
            disabled={!answer.trim() || saving}
          >
            {saving ? "Saving..." : saved ? "Saved ✓" : todayEntry ? "Update" : "Save"}
          </button>

          {todayEntry && !saving && (
            <div style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: T.muted, letterSpacing: 1 }}>
              {saved ? "Your reflection is saved." : "You've written today. You can update it anytime."}
            </div>
          )}

          {/* Encouragement if nothing written yet */}
          {!todayEntry && (
            <div style={{ ...css.card, background: T.warm, border: `1px solid ${T.border}`, marginTop: 20 }}>
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

      {/* HISTORY VIEW */}
      {view === "history" && (
        <div>
          {pastEntries.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: T.muted }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🍃</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontStyle: "italic" }}>
                Your journal history will appear here.
              </div>
              <div style={{ fontSize: 13, marginTop: 8 }}>Start writing today.</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {pastEntries.map((entry) => (
                <div
                  key={entry.id}
                  style={{
                    ...css.card,
                    cursor: "pointer",
                    borderLeft: `3px solid ${expandedId === entry.id ? T.accent : T.border}`,
                    transition: "border-color 0.2s",
                  }}
                  onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: expandedId === entry.id ? 12 : 0 }}>
                    <div>
                      <div style={{ fontSize: 11, color: T.muted, letterSpacing: 2, marginBottom: 4 }}>
                        {formatDate(entry.entry_date)}
                      </div>
                      <div style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontStyle: "italic",
                        fontSize: 15,
                        color: T.accentDark,
                        lineHeight: 1.4,
                        maxWidth: expandedId === entry.id ? "100%" : 260,
                        overflow: "hidden",
                        whiteSpace: expandedId === entry.id ? "normal" : "nowrap",
                        textOverflow: expandedId === entry.id ? "unset" : "ellipsis",
                      }}>
                        {entry.question}
                      </div>
                    </div>
                    <div style={{ fontSize: 14, color: T.muted, flexShrink: 0, marginLeft: 8 }}>
                      {expandedId === entry.id ? "↑" : "↓"}
                    </div>
                  </div>

                  {expandedId === entry.id && (
                    <div style={{
                      fontSize: 15,
                      color: T.text,
                      lineHeight: 1.75,
                      borderTop: `1px solid ${T.border}`,
                      paddingTop: 12,
                      fontFamily: "'Jost', sans-serif",
                      fontWeight: 300,
                    }}>
                      {entry.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
