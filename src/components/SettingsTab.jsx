import { T, css } from "../theme";
import { supabase } from "../supabase";
import { useState } from "react";
import TheCode from "./TheCode";

export default function SettingsTab({ currentUser, notifyTipEmail, setNotifyTipEmail, journey, setJourney, partnerName, setPartnerName, showTheCode, setShowTheCode }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [saved, setSaved] = useState(false);
  const [journeySaved, setJourneySaved] = useState(false);
  const [localPartnerName, setLocalPartnerName] = useState(partnerName || "");

  async function savePreferences() {
    let user = currentUser;
    if (!user) {
      const { data: { user: freshUser } } = await supabase.auth.getUser();
      user = freshUser;
    }
    if (!user) return;
    await supabase.from("user_preferences").upsert({
      user_id: user.id,
      notify_tip_email: notifyTipEmail,
    }, { onConflict: "user_id" });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function saveJourney(newJourney) {
    let user = currentUser;
    if (!user) {
      const { data: { user: freshUser } } = await supabase.auth.getUser();
      user = freshUser;
    }
    if (!user) return;
    const update = { user_id: user.id, journey: newJourney };
    if (newJourney === "relationship" && localPartnerName) {
      update.partner_name = localPartnerName;
    }
    if (newJourney === "self") {
      update.partner_name = null;
    }
    await supabase.from("user_preferences").upsert(update, { onConflict: "user_id" });
    setJourney(newJourney);
    if (setPartnerName) setPartnerName(newJourney === "self" ? null : localPartnerName);
    setJourneySaved(true);
    setTimeout(() => setJourneySaved(false), 2000);
  }

  async function handleDeleteAccount() {
    setDeleteLoading(true);
    setDeleteError("");
    try {
      const user = currentUser;
      if (!user) throw new Error("Not logged in");
      const uid = user.id;
      await supabase.from("seen_tips").delete().eq("user_id", uid);
      await supabase.from("health_scores").delete().eq("user_id", uid);
      await supabase.from("assessments").delete().eq("user_id", uid);
      await supabase.from("streaks").delete().eq("user_id", uid);
      await supabase.from("user_preferences").delete().eq("user_id", uid);
      await supabase.from("users").delete().eq("id", uid);
      await supabase.auth.signOut();
      window.location.href = "https://goddessgrounded.app";
    } catch (err) {
      setDeleteError("Something went wrong. Please contact hello@goddessalert.com.");
      setDeleteLoading(false);
    }
  }

  return (
    <div style={{ padding: "24px 24px 0" }}>

      {/* Account */}
      <div style={{ fontSize: 10, letterSpacing: 5, textTransform: "uppercase", color: T.muted, marginBottom: 12 }}>
        Account
      </div>
      <div style={{ ...css.card, marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: T.muted, marginBottom: 4 }}>Signed in as</div>
        <div style={{ fontSize: 15, color: T.text, fontWeight: 400 }}>{currentUser?.email || "—"}</div>
        <button onClick={() => supabase.auth.signOut()} style={{ ...css.btnGhost, marginTop: 16, fontSize: 11 }}>
          Sign out
        </button>
      </div>

      {/* Journey */}
      <div style={{ fontSize: 10, letterSpacing: 5, textTransform: "uppercase", color: T.muted, marginBottom: 12 }}>
        Your path
      </div>
      <div style={{ ...css.card, marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: T.muted, marginBottom: 16, lineHeight: 1.6 }}>
          How would you like to use GoddessGrounded?
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 8 }}>
          <button
            onClick={() => saveJourney("self")}
            style={{
              display: "flex", alignItems: "flex-start", gap: 14,
              background: journey === "self" ? T.accentSoft : T.warm,
              border: `1px solid ${journey === "self" ? T.accent : T.border}`,
              borderRadius: 12, padding: "14px 16px", cursor: "pointer",
              textAlign: "left", transition: "all 0.2s",
            }}
          >
            <span style={{ fontSize: 22, flexShrink: 0 }}>🌿</span>
            <div>
              <div style={{ fontSize: 14, color: T.text, fontWeight: journey === "self" ? 500 : 300, marginBottom: 2 }}>
                Just for me
              </div>
              <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>
                Tips and reflections focused entirely on myself.
              </div>
            </div>
          </button>

          <button
            onClick={() => saveJourney("relationship")}
            style={{
              display: "flex", alignItems: "flex-start", gap: 14,
              background: journey === "relationship" ? T.accentSoft : T.warm,
              border: `1px solid ${journey === "relationship" ? T.accent : T.border}`,
              borderRadius: 12, padding: "14px 16px", cursor: "pointer",
              textAlign: "left", transition: "all 0.2s",
            }}
          >
            <span style={{ fontSize: 22, flexShrink: 0 }}>🌸</span>
            <div>
              <div style={{ fontSize: 14, color: T.text, fontWeight: journey === "relationship" ? 500 : 300, marginBottom: 2 }}>
                Me and my relationship
              </div>
              <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>
                Tips and reflections including relationship context.
              </div>
            </div>
          </button>
        </div>

        {journey === "relationship" && (
          <div style={{ marginTop: 12 }}>
            <label style={{ ...css.label, marginBottom: 6 }}>His name (optional)</label>
            <input
              style={{ ...css.input, marginBottom: 10 }}
              placeholder="e.g. Tom"
              value={localPartnerName}
              onChange={(e) => setLocalPartnerName(e.target.value)}
            />
            <button style={{ ...css.btn, fontSize: 11 }} onClick={() => saveJourney("relationship")}>
              {journeySaved ? "Saved ✓" : "Save"}
            </button>
          </div>
        )}

        {journeySaved && journey === "self" && (
          <div style={{ fontSize: 12, color: T.accent, textAlign: "center", letterSpacing: 1, marginTop: 8 }}>
            Saved ✓
          </div>
        )}
      </div>

      {/* Notifications */}
      <div style={{ fontSize: 10, letterSpacing: 5, textTransform: "uppercase", color: T.muted, marginBottom: 12 }}>
        Notifications
      </div>
      <div style={{ ...css.card, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 14, color: T.text }}>Daily tip by email</div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>Receive your daily intention in your inbox</div>
          </div>
          <div
            onClick={() => setNotifyTipEmail(!notifyTipEmail)}
            style={{
              width: 44, height: 24, borderRadius: 12,
              background: notifyTipEmail ? T.accent : T.border,
              cursor: "pointer", position: "relative",
              transition: "background 0.2s", flexShrink: 0,
            }}
          >
            <div style={{
              position: "absolute", top: 3,
              left: notifyTipEmail ? 23 : 3,
              width: 18, height: 18, borderRadius: "50%",
              background: "#fff", transition: "left 0.2s",
            }} />
          </div>
        </div>
        <button style={{ ...css.btn, marginTop: 16 }} onClick={savePreferences}>
          {saved ? "Saved ✓" : "Save preferences"}
        </button>
      </div>

      {/* Mission */}
      <div style={{ fontSize: 10, letterSpacing: 5, textTransform: "uppercase", color: T.muted, marginBottom: 12 }}>
        Our mission
      </div>
      <div style={{ ...css.card, background: T.warm, border: `1px solid ${T.border}`, marginBottom: 20 }}>
        <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.7 }}>
          GoddessGrounded is free — always. It is funded through GoddessAlert, which donates{" "}
          <strong style={{ color: T.accentDark }}>10% of profits to women's equality</strong> and{" "}
          <strong style={{ color: T.accentDark }}>10% to sustainability</strong>. Not a marketing line — a commitment from day one.
        </p>
      </div>

      {/* Legal */}
      <div style={{ fontSize: 10, letterSpacing: 5, textTransform: "uppercase", color: T.muted, marginBottom: 12 }}>
        Legal
      </div>
      <div style={{ ...css.card, marginBottom: 20 }}>
        <a href="https://goddessgrounded.app/privacy.html" target="_blank" rel="noreferrer" style={{ display: "block", fontSize: 13, color: T.accent, marginBottom: 10, textDecoration: "none" }}>
          Privacy Policy →
        </a>
        <a href="https://goddessgrounded.app/terms.html" target="_blank" rel="noreferrer" style={{ display: "block", fontSize: 13, color: T.accent, textDecoration: "none" }}>
          Terms of Use →
        </a>
      </div>

      {/* Danger zone */}
      <div style={{ fontSize: 10, letterSpacing: 5, textTransform: "uppercase", color: T.muted, marginBottom: 12 }}>
        Danger zone
      </div>
      <div style={{ ...css.card, marginBottom: 40 }}>
        <button onClick={() => setShowDeleteModal(true)} style={{ ...css.btnGhost, borderColor: T.red, color: T.red, fontSize: 11 }}>
          Delete my account
        </button>
      </div>

      {showDeleteModal && (
        <div style={css.modal} onClick={() => !deleteLoading && setShowDeleteModal(false)}>
          <div style={css.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🌧️</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: T.red, marginBottom: 8 }}>Delete my account</div>
              <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.7 }}>
                This will permanently delete all your data. This cannot be undone.
              </div>
            </div>
            {deleteError && (
              <div style={{ fontSize: 13, color: T.red, textAlign: "center", marginBottom: 12, padding: 10, background: "#fff8f8", borderRadius: 8 }}>
                {deleteError}
              </div>
            )}
            <button style={{ ...css.btn, background: T.red, opacity: deleteLoading ? 0.6 : 1, marginBottom: 10 }} onClick={handleDeleteAccount} disabled={deleteLoading}>
              {deleteLoading ? "Deleting..." : "Yes, delete everything"}
            </button>
            <button style={css.btnGhost} onClick={() => !deleteLoading && setShowDeleteModal(false)} disabled={deleteLoading}>
              Cancel
            </button>
          </div>
        </div>
      )}
      {/* The Code */}
      <TheCode showTheCode={showTheCode} setShowTheCode={setShowTheCode} />
      
    </div>
  );
}
