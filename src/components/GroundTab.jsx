import { T, css } from "../theme";
import { supabase } from "../supabase";

const ZONES = [
  { min: 80, label: "Deeply rooted", desc: "You are strongly connected to yourself. Keep nurturing that.", emoji: "🌳" },
  { min: 60, label: "Growing", desc: "You're finding your ground. Small daily moments make the difference.", emoji: "🌿" },
  { min: 40, label: "Searching", desc: "You're looking for yourself. That awareness is already a step forward.", emoji: "🌱" },
  { min: 0, label: "Tender ground", desc: "Be gentle with yourself. You're here — that matters.", emoji: "🌧️" },
];

const DIMENSIONS = [
  { key: "self_connection", label: "Self connection" },
  { key: "self_awareness", label: "Self awareness" },
  { key: "naming_needs", label: "Naming needs" },
  { key: "boundaries", label: "Boundaries" },
  { key: "identity", label: "Identity" },
  { key: "presence", label: "Presence" },
];

export default function GroundTab({ score, scoreLoaded, assessment, streak, longestStreak, currentUser }) {
  const zone = ZONES.find((z) => score >= z.min) || ZONES[ZONES.length - 1];
  const scoreColor =
    score >= 80 ? T.green : score >= 60 ? T.accent : score >= 40 ? T.accentLight : T.muted;

  async function resetAssessment() {
    let user = currentUser;
    if (!user) {
      const { data: { user: freshUser } } = await supabase.auth.getUser();
      user = freshUser;
    }
    if (!user) return;
    await supabase.from("user_preferences").upsert({
      user_id: user.id,
      assessment_completed_at: null,
      onboarding_skipped_assessment: false,
    }, { onConflict: "user_id" });
    window.location.reload();
  }

  return (
    <div style={{ padding: "24px 24px 0" }}>
      {/* Score circle */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 10, letterSpacing: 5, textTransform: "uppercase", color: T.muted, marginBottom: 20 }}>
          Your groundedness
        </div>
        <div style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          border: `4px solid ${scoreColor}`,
          background: T.warm,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
        }}>
          <div style={{ fontSize: 36, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: scoreColor, lineHeight: 1 }}>
            {scoreLoaded ? score : "—"}
          </div>
          <div style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: T.muted }}>score</div>
        </div>
        <div style={{ fontSize: 22, marginBottom: 6 }}>{zone.emoji}</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontStyle: "italic", color: T.accentDark, marginBottom: 6 }}>
          {zone.label}
        </div>
        <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, maxWidth: 280, margin: "0 auto" }}>
          {zone.desc}
        </div>
      </div>

      {/* Streak */}
      {streak > 1 && (
        <div style={{ ...css.card, textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: T.muted, marginBottom: 8 }}>
            Consistency
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 32 }}>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, color: T.accent }}>{streak}</div>
              <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, textTransform: "uppercase" }}>day streak</div>
            </div>
            <div style={{ width: 1, background: T.border }} />
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, color: T.accentLight }}>{longestStreak}</div>
              <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, textTransform: "uppercase" }}>best streak</div>
            </div>
          </div>
        </div>
      )}

      {/* Dimension breakdown */}
      {assessment && (
        <div style={{ ...css.card, marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: T.muted, marginBottom: 16 }}>
            Your dimensions
          </div>
          {DIMENSIONS.map((dim) => {
            const val = assessment[dim.key] || 0;
            const pct = (val / 4) * 100;
            return (
              <div key={dim.key} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: T.text, letterSpacing: 1 }}>{dim.label}</span>
                  <span style={{ fontSize: 12, color: T.muted }}>{val}/4</span>
                </div>
                <div style={{ height: 4, background: T.border, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${pct}%`,
                    background: pct >= 75 ? T.green : pct >= 50 ? T.accent : T.accentLight,
                    borderRadius: 2,
                    transition: "width 0.6s ease",
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Redo assessment */}
      <div style={{ ...css.card, marginBottom: 20 }}>
        <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: T.muted, marginBottom: 8 }}>
          Your profile
        </div>
        <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, marginBottom: 14 }}>
          Retake the self assessment to update your profile and refresh your daily tips.
        </div>
        <button onClick={resetAssessment} style={{ ...css.btnGhost, fontSize: 11 }}>
          Redo self assessment →
        </button>
      </div>

      {/* Perel quote */}
      <div style={{ ...css.card, background: T.warm, border: `1px solid ${T.border}`, marginBottom: 20 }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 16, color: T.accentDark, lineHeight: 1.7 }}>
          "You don't have to lose yourself to love someone. The more you stay yourself, the more alive the love becomes."
        </p>
        <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: T.muted, marginTop: 12 }}>
          Modern relationship therapy
        </div>
      </div>
    </div>
  );
}
  const zone = ZONES.find((z) => score >= z.min) || ZONES[ZONES.length - 1];
  const scoreColor =
    score >= 80 ? T.green : score >= 60 ? T.accent : score >= 40 ? T.accentLight : T.muted;

  return (
    <div style={{ padding: "24px 24px 0" }}>
      {/* Score circle */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 10, letterSpacing: 5, textTransform: "uppercase", color: T.muted, marginBottom: 20 }}>
          Your groundedness
        </div>
        <div style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          border: `4px solid ${scoreColor}`,
          background: T.warm,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
        }}>
          <div style={{ fontSize: 36, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: scoreColor, lineHeight: 1 }}>
            {scoreLoaded ? score : "—"}
          </div>
          <div style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: T.muted }}>score</div>
        </div>
        <div style={{ fontSize: 22, marginBottom: 6 }}>{zone.emoji}</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontStyle: "italic", color: T.accentDark, marginBottom: 6 }}>
          {zone.label}
        </div>
        <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, maxWidth: 280, margin: "0 auto" }}>
          {zone.desc}
        </div>
      </div>

      {/* Streak */}
      {streak > 1 && (
        <div style={{ ...css.card, textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: T.muted, marginBottom: 8 }}>
            Consistency
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 32 }}>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, color: T.accent }}>{streak}</div>
              <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, textTransform: "uppercase" }}>day streak</div>
            </div>
            <div style={{ width: 1, background: T.border }} />
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, color: T.accentLight }}>{longestStreak}</div>
              <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, textTransform: "uppercase" }}>best streak</div>
            </div>
          </div>
        </div>
      )}

      {/* Dimension breakdown */}
      {assessment && (
        <div style={{ ...css.card, marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: T.muted, marginBottom: 16 }}>
            Your dimensions
          </div>
          {DIMENSIONS.map((dim) => {
            const val = assessment[dim.key] || 0;
            const pct = (val / 4) * 100;
            return (
              <div key={dim.key} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: T.text, letterSpacing: 1 }}>{dim.label}</span>
                  <span style={{ fontSize: 12, color: T.muted }}>{val}/4</span>
                </div>
                <div style={{ height: 4, background: T.border, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${pct}%`,
                    background: pct >= 75 ? T.green : pct >= 50 ? T.accent : T.accentLight,
                    borderRadius: 2,
                    transition: "width 0.6s ease",
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Perel quote */}
      <div style={{ ...css.card, background: T.warm, border: `1px solid ${T.border}`, marginBottom: 20 }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 16, color: T.accentDark, lineHeight: 1.7 }}>
          "You don't have to lose yourself to love someone. The more you stay yourself, the more alive the love becomes."
        </p>
        <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: T.muted, marginTop: 12 }}>
          Modern relationship therapy
        </div>
      </div>
    </div>
  );
}
