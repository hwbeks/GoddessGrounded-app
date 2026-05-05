import React from "react";
import ReactDOM from "react-dom/client";
import GoddessGrounded from "./App";

// Google Fonts — Cormorant Garamond + Jost
const link = document.createElement("link");
link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Jost:wght@300;400;500&display=swap";
link.rel = "stylesheet";
document.head.appendChild(link);

// Global reset
const style = document.createElement("style");
style.textContent = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #faf7f2; }
  button { font-family: 'Jost', sans-serif; }
  input { font-family: 'Jost', sans-serif; }
`;
document.head.appendChild(style);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<GoddessGrounded />);
