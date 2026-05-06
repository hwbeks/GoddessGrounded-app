import { supabase } from "./supabase";
import { T, css } from "./theme";
import { useState, useEffect } from "react";
import SelfAssessmentScreen from "./components/SelfAssessmentScreen";
import HomeTab from "./components/HomeTab";
import TipsTab from "./components/TipsTab";
import GroundTab from "./components/GroundTab";
import SettingsTab from "./components/SettingsTab";

// ─── LOGIN ──────────────────────────────────────────────────

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendMagicLink() {
    if (!email) return;
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: "https://app.goddessgrounded.app" },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  }

  return (
    <div style={{ ...css.page, justifyContent: "center", gap: 0 }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ fontSize: 10, color: T.muted, letterSpacing: 6, textTransform: "uppercase", marginBottom: 12 }}>
          welcome to
        </div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, color: T.accent, fontStyle: "italic", letterSpacing: 2, marginBottom: 8 }}>
          GoddessGrounded
        </div>
        <div style={{ fontSize: 13, color: T.muted, letterSpacing: 1, lineHeight: 1.6 }}>
          The most important relationship<br />
          you'll ever have is the one with yourself.
        </div>
      </div>

      {!sent ? (
        <>
          <div style={{ marginBottom: 6 }}>
            <label style={css.label}>Your email address</label>
            <input
              style={css.input}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMagicLink()}
            />
          </div>
          {error && (
            <div style={{ fontSize: 13, color: T.red, marginBottom: 12, textAlign: "center" }}>
              {error}
            </div>
          )}
          <button
            style={{ ...css.btn, opacity: loading ? 0.6 : 1 }}
            onClick={sendMagicLink}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Magic Link"}
          </button>
          <div style={{ textAlign: "center", marginTop: 14, fontSize: 11, color: T.muted, lineHeight: 1.8 }}>
            We'll send you a one-click login link. No password needed.<br />
            By continuing you agree to our{" "}
            <a href="https://goddessgrounded.app/terms.html" style={{ color: T.accent, textDecoration: "underline" }} target="_blank" rel="noreferrer">Terms of Use</a>
            {" "}and{" "}
            <a href="https://goddessgrounded.app/privacy.html" style={{ color: T.accent, textDecoration: "underline" }} target="_blank" rel="noreferrer">Privacy Policy</a>.
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🌿</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: T.accent, marginBottom: 8, fontStyle: "italic" }}>
            Check your inbox
          </div>
          <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.7, marginBottom: 28 }}>
            We sent a magic link to<br />
            <span style={{ color: T.text }}>{email}</span><br />
            Click it to sign in — no password needed.
          </div>
          <button style={css.btnGhost} onClick={() => setSent(false)}>
            Use a different email
          </button>
        </div>
      )}
    </div>
  );
}

// ─── ONBOARDING ─────────────────────────────────────────────

function OnboardingScreen({ onDone, currentUser }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ name: "", journey: "", partnerName: "" });
  const [saving, setSaving] = useState(false);

  // Steps depend on journey choice
  // Step 0: name
  // Step 1: journey choice
  // Step 2: partner name (only if journey = 'relationship')
  const totalSteps = data.journey === "relationship" ? 3 : 2;
  const isLast = step === totalSteps - 1;

  async function saveAndContinue() {
    setSaving(true);
    let user = currentUser;
    if (!user) {
      const { data: { user: freshUser } } = await supabase.auth.getUser();
      user = freshUser;
    }
    if (user) {
      const { data: existingUser } = await supabase.from("users").select("id").eq("id", user.id).maybeSingle();
      if (existingUser) {
        await supabase.from("users").update({ email: user.email }).eq("id", user.id);
      } else {
        await supabase.from("users").insert({ id: user.id, email: user.email });
      }
      await supabase.from("user_preferences").upsert({
        user_id: user.id,
        display_name: data.name,
        journey: data.journey || "self",
        partner_name: data.journey === "relationship" ? (data.partnerName || null) : null,
      }, { onConflict: "user_id" });
    }
    setSaving(false);
    onDone(data);
  }

  function handleNext() {
    if (isLast) {
      saveAndContinue();
    } else {
      // Skip partner name step if journey is 'self'
      if (step === 1 && data.journey === "self") {
        saveAndContinue();
      } else {
        setStep((s) => s + 1);
      }
    }
  }

  // Step 0 — Name
  if (step === 0) {
    return (
      <div style={{ ...css.page, justifyContent: "center" }}>
        <StepIndicator current={0} total={totalSteps} />
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌸</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: T.text, marginBottom: 8, fontStyle: "italic" }}>
            Welcome. Let's begin.
          </div>
          <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.6 }}>
            A few questions to make this yours. Takes less than a minute.
          </div>
        </div>
        <label style={css.label}>What's your name?</label>
        <input
          style={css.input}
          placeholder="e.g. Sophie"
          value={data.name}
          onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))}
        />
        <button
          style={{ ...css.btn, opacity: data.name.length > 0 ? 1 : 0.4 }}
          onClick={() => data.name.length > 0 && setStep(1)}
          disabled={data.name.length === 0}
        >
          Continue →
        </button>
      </div>
    );
  }

  // Step 1 — Journey choice
  if (step === 1) {
    return (
      <div style={{ ...css.page, justifyContent: "center" }}>
        <StepIndicator current={1} total={totalSteps} />
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌿</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: T.text, marginBottom: 8, fontStyle: "italic" }}>
            How would you like to use GoddessGrounded?
          </div>
          <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.6 }}>
            You can always change this in Settings.
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
          <button
            onClick={() => setData((d) => ({ ...d, journey: "self" }))}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 16,
              background: data.journey === "self" ? T.accentSoft : T.card,
              border: `1px solid ${data.journey === "self" ? T.accent : T.border}`,
              borderRadius: 14,
              padding: "18px 20px",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.2s",
            }}
          >
            <span style={{ fontSize: 28, flexShrink: 0 }}>🌿</span>
            <div>
              <div style={{ fontSize: 15, color: T.text, fontWeight: 500, marginBottom: 4 }}>
                Just for me
              </div>
              <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.5 }}>
                Tips and reflections focused entirely on myself — no relationship context needed.
              </div>
            </div>
          </button>

          <button
            onClick={() => setData((d) => ({ ...d, journey: "relationship" }))}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 16,
              background: data.journey === "relationship" ? T.accentSoft : T.card,
              border: `1px solid ${data.journey === "relationship" ? T.accent : T.border}`,
              borderRadius: 14,
              padding: "18px 20px",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.2s",
            }}
          >
            <span style={{ fontSize: 28, flexShrink: 0 }}>🌸</span>
            <div>
              <div style={{ fontSize: 15, color: T.text, fontWeight: 500, marginBottom: 4 }}>
                Me and my relationship
              </div>
              <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.5 }}>
                Tips and reflections about staying grounded — within myself and within my relationship.
              </div>
            </div>
          </button>
        </div>

        <button
          style={{ ...css.btn, opacity: data.journey ? 1 : 0.4 }}
          onClick={() => data.journey && handleNext()}
          disabled={!data.journey || saving}
        >
          {saving ? "Saving..." : data.journey === "self" ? "Let's begin →" : "Continue →"}
        </button>
      </div>
    );
  }

  // Step 2 — Partner name (only for relationship journey)
  if (step === 2 && data.journey === "relationship") {
    return (
      <div style={{ ...css.page, justifyContent: "center" }}>
        <StepIndicator current={2} total={totalSteps} />
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💛</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: T.text, marginBottom: 8, fontStyle: "italic" }}>
            Your partner
          </div>
          <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.6 }}>
            This helps us personalise your experience. You can skip this.
          </div>
        </div>
        <label style={css.label}>His name (optional)</label>
        <input
          style={css.input}
          placeholder="e.g. Tom"
          value={data.partnerName}
          onChange={(e) => setData((d) => ({ ...d, partnerName: e.target.value }))}
        />
        <button
          style={{ ...css.btn, opacity: !saving ? 1 : 0.6 }}
          onClick={handleNext}
          disabled={saving}
        >
          {saving ? "Saving..." : "Let's begin →"}
        </button>
        <button style={{ ...css.btnGhost, marginTop: 10 }} onClick={() => { setData((d) => ({ ...d, partnerName: "" })); saveAndContinue(); }}>
          Skip
        </button>
      </div>
    );
  }

  return null;
}

// ─── STEP INDICATOR ─────────────────────────────────────────

function StepIndicator({ current, total }) {
  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 40 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? 24 : 8,
            height: 8,
            borderRadius: 4,
            background: i <= current ? T.accent : T.border,
            transition: "all 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────

function MainApp({ userData }) {

  const [tab, setTab] = useState("home");
  const [currentUser, setCurrentUser] = useState(null);
  const [score, setScore] = useState(50);
  const [scoreLoaded, setScoreLoaded] = useState(false);
  const [scoreVersion, setScoreVersion] = useState(0);
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [assessment, setAssessment] = useState(null);
  const [tips, setTips] = useState([]);
  const [dailyTip, setDailyTip] = useState(null);
  const [weeklyRating, setWeeklyRating] = useState(null);
  const [tipRated, setTipRated] = useState(false);
  const [notifyTipEmail, setNotifyTipEmail] = useState(false);
  const [journey, setJourney] = useState(userData?.journey || "self");
  const [partnerName, setPartnerName] = useState(userData?.partnerName || null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user || null);
    });
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user || null);
    });
    return () => authSub.unsubscribe();
  }, []);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load assessment
      const { data: assess } = await supabase
        .from("assessments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (assess) setAssessment(assess);

      // Load tips
      const { data: tipsData } = await supabase
        .from("tips")
        .select("*")
        .eq("status", "active")
        .eq("language", "en")
        .limit(10);
      if (tipsData) {
        setTips(tipsData);
        setDailyTip(tipsData[0] || null);
      }

      // Load weekly rating
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const { data: checkins } = await supabase
        .from("health_scores")
        .select("score")
        .eq("user_id", user.id)
        .gte("recorded_at", sevenDaysAgo.toISOString())
        .order("recorded_at", { ascending: false })
        .limit(1);
      if (checkins && checkins.length > 0) setWeeklyRating(checkins[0].score);

      // Load preferences
      const { data: prefs } = await supabase
        .from("user_preferences")
        .select("notify_tip_email")
        .eq("user_id", user.id)
        .maybeSingle();
      if (prefs) setNotifyTipEmail(prefs.notify_tip_email ?? false);

      // Load streak
      const { data: streakData } = await supabase
        .from("streaks")
        .select("current_streak, longest_streak")
        .eq("user_id", user.id)
        .maybeSingle();
      if (streakData) {
        setStreak(streakData.current_streak || 0);
        setLongestStreak(streakData.longest_streak || 0);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    async function calculateScore() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Base score from assessment
      let base = 40;
      if (assessment) {
        const vals = [
          assessment.self_connection,
          assessment.self_awareness,
          assessment.naming_needs,
          assessment.boundaries,
          assessment.identity,
          assessment.presence,
        ].filter(Boolean);
        if (vals.length > 0) {
          const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
          if (avg <= 1.5) base = 30;
          else if (avg <= 2.5) base = 42;
          else if (avg <= 3.5) base = 54;
          else base = 64;
        }
      }

      let s = base;

      // Streak bonus
      if (streak >= 14) s += 10;
      else if (streak >= 7) s += 6;
      else if (streak >= 3) s += 3;

      // Weekly check-in
      if (weeklyRating) {
        if (weeklyRating >= 4) s += 8;
        else if (weeklyRating === 3) s += 4;
        else if (weeklyRating <= 2) s -= 2;
      } else {
        s -= 4;
      }

      s = Math.max(10, Math.min(95, s));
      setScore(s);
      setScoreLoaded(true);
    }
    calculateScore();
  }, [scoreVersion, assessment, streak, weeklyRating]);

  async function handleCheckIn(val) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("health_scores").insert({
      user_id: user.id,
      score: val,
      recorded_at: new Date().toISOString(),
    });
    setWeeklyRating(val);
    setScoreVersion((v) => v + 1);
  }

  async function handleRateTip(tipId, rating) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("seen_tips").upsert({
      user_id: user.id,
      tip_id: tipId,
      rating,
      seen_at: new Date().toISOString(),
    }, { onConflict: "user_id,tip_id" });
  }

  const scoreColor = score >= 80 ? T.green : score >= 60 ? T.accent : score >= 40 ? T.accentLight : T.muted;

  return (
    <div style={{ width: "100%", maxWidth: 420, paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ padding: "32px 24px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: T.accent, fontStyle: "italic", letterSpacing: 1 }}>
            GoddessGrounded
          </div>
          <div style={{ fontSize: 11, color: T.muted, letterSpacing: 2, textTransform: "uppercase", marginTop: 2 }}>
            for grounded women
          </div>
          {streak > 1 && (
            <div style={{ fontSize: 11, color: T.accent, marginTop: 4 }}>
              🌿 {streak} {streak === 1 ? "day" : "days"} in a row
            </div>
          )}
        </div>
        <div
          onClick={() => setTab("ground")}
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            border: `3px solid ${scoreColor}`,
            background: T.warm,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <div style={{ fontSize: 18, fontFamily: "'Cormorant Garamond', serif", color: scoreColor, lineHeight: 1 }}>
            {scoreLoaded ? score : "—"}
          </div>
          <div style={{ fontSize: 8, color: T.muted, letterSpacing: 1, textTransform: "uppercase" }}>ground</div>
        </div>
      </div>

      {/* Tabs */}
      {tab === "home" && (
        <HomeTab
          tip={dailyTip}
          score={score}
          streak={streak}
          partnerName={userData?.partnerName}
          onCheckIn={handleCheckIn}
          onRateTip={handleRateTip}
          weeklyRating={weeklyRating}
          setWeeklyRating={setWeeklyRating}
          tipRated={tipRated}
          setTipRated={setTipRated}
          setScoreVersion={setScoreVersion}
        />
      )}

      {tab === "tips" && (
        <TipsTab
          tips={tips}
          onRateTip={handleRateTip}
        />
      )}

      {tab === "ground" && (
        <GroundTab
          score={score}
          scoreLoaded={scoreLoaded}
          assessment={assessment}
          streak={streak}
          longestStreak={longestStreak}
        />
      )}

      {tab === "settings" && (
        <SettingsTab
          currentUser={currentUser}
          notifyTipEmail={notifyTipEmail}
          setNotifyTipEmail={setNotifyTipEmail}
          journey={journey}
          setJourney={setJourney}
          partnerName={partnerName}
          setPartnerName={setPartnerName}
        />
      )}

      {/* Bottom Nav */}
      <div style={css.nav}>
        {[
          { id: "home", icon: "🏠", label: "Home" },
          { id: "tips", icon: "🌿", label: "Tips" },
          { id: "ground", icon: "🌳", label: "Ground" },
          { id: "settings", icon: "⚙️", label: "Settings" },
        ].map((n) => (
          <div
            key={n.id}
            onClick={() => setTab(n.id)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              cursor: "pointer",
              opacity: tab === n.id ? 1 : 0.4,
            }}
          >
            <div style={{ fontSize: 20 }}>{n.icon}</div>
            <div style={{ fontSize: 10, color: tab === n.id ? T.accent : T.muted, letterSpacing: 1, textTransform: "uppercase" }}>
              {n.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ROOT ────────────────────────────────────────────────────

export default function GoddessGrounded() {
  const [screen, setScreen] = useState("login");
  const [userData, setUserData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function handleSession(session) {
      if (session) {
        setCurrentUser(session.user);
        const { data: prefs } = await supabase
          .from("user_preferences")
          .select("display_name, partner_name, journey, assessment_completed_at, onboarding_skipped_assessment")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (!prefs?.display_name) {
          setScreen("onboarding");
        } else {
          setUserData({
            name: prefs.display_name,
            partnerName: prefs.partner_name,
            journey: prefs.journey || "self",
          });
          const assessmentDone = prefs?.assessment_completed_at || prefs?.onboarding_skipped_assessment;
          setScreen(assessmentDone ? "app" : "assessment");
        }
      } else {
        setCurrentUser(null);
        setScreen("login");
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div style={css.app}>
      {screen === "login" && <LoginScreen />}
      {screen === "onboarding" && (
        <OnboardingScreen
          currentUser={currentUser}
          onDone={(data) => {
            setUserData(data);
            setScreen("assessment");
          }}
        />
      )}
      {screen === "assessment" && (
        <SelfAssessmentScreen
          currentUser={currentUser}
          onDone={() => setScreen("app")}
          onSkip={() => setScreen("app")}
        />
      )}
      {screen === "app" && <MainApp userData={userData} />}
    </div>
  );
}
