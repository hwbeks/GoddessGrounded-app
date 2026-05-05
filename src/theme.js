export const T = {
  // Backgrounds
  bg: "#faf7f2",
  warm: "#f2ece0",
  card: "#ffffff",
  bark: "#3d2f1e",

  // Earth tones
  accent: "#8b6f47",
  accentLight: "#b89468",
  accentDark: "#5c4a30",
  accentSoft: "rgba(139,111,71,0.08)",

  // Text
  text: "#2c1f0e",
  muted: "#9e8e7a",

  // Semantic
  border: "#e2d8cc",
  red: "#c0392b",
  green: "#4a7c59",
  premium: "#8b6f47",
};

export const css = {
  app: {
    minHeight: "100vh",
    background: T.bg,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "'Jost', 'Georgia', serif",
    fontWeight: 300,
    color: T.text,
  },

  page: {
    width: "100%",
    maxWidth: 420,
    padding: "24px 24px 100px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    minHeight: "100vh",
  },

  card: {
    background: T.card,
    border: `1px solid ${T.border}`,
    borderRadius: 16,
    padding: "20px 24px",
  },

  label: {
    fontSize: 10,
    letterSpacing: 4,
    textTransform: "uppercase",
    color: T.muted,
    marginBottom: 6,
    display: "block",
    fontFamily: "'Jost', sans-serif",
  },

  input: {
    width: "100%",
    background: T.card,
    border: `1px solid ${T.border}`,
    borderRadius: 10,
    padding: "14px 16px",
    fontSize: 15,
    color: T.text,
    fontFamily: "'Jost', sans-serif",
    fontWeight: 300,
    outline: "none",
    marginBottom: 14,
    boxSizing: "border-box",
  },

  btn: {
    width: "100%",
    background: T.accent,
    color: T.bg,
    border: "none",
    borderRadius: 12,
    padding: "16px 24px",
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: 3,
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: "'Jost', sans-serif",
    transition: "background 0.2s",
  },

  btnGhost: {
    width: "100%",
    background: "transparent",
    color: T.accent,
    border: `1px solid ${T.accentLight}`,
    borderRadius: 12,
    padding: "14px 24px",
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: 3,
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: "'Jost', sans-serif",
  },

  nav: {
    position: "fixed",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "100%",
    maxWidth: 420,
    background: T.card,
    borderTop: `1px solid ${T.border}`,
    display: "flex",
    justifyContent: "space-around",
    padding: "12px 0 20px",
    zIndex: 200,
  },

  modal: {
    position: "fixed",
    inset: 0,
    background: "rgba(44,31,14,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 400,
    padding: 24,
  },

  modalBox: {
    background: T.card,
    borderRadius: 20,
    padding: "32px 28px",
    width: "100%",
    maxWidth: 380,
    border: `1px solid ${T.border}`,
  },
};
