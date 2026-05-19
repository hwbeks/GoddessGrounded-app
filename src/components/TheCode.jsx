import { T } from "../theme";

export default function TheCode({ showTheCode, setShowTheCode }) {
  const content = [
    ["I", "Your family revolves around you. That doesn't mean you have to disappear into them.",
     "Somewhere along the way, you became the one who notices when something is off — with him, with the kids, with the household. That awareness is real, and it's also exhausting. Being the center of a family doesn't mean being the servant of it. You're allowed to stay visible to yourself."],
     
    ["II", "Doing less is not neglect.",
     "Carrying everything quietly is not love — it's training the people around you to expect it. Putting something down doesn't mean it won't get done. It might mean someone else finally sees it. Or it might mean it doesn't get done — and the world won't end."],
     
    ["III", "Ask for help, don't manage.",
     "Telling him exactly how, when, and in what tone to do something is not partnership — it's outsourcing your mental list while keeping the mental load. Ask once. Let him do it his way. Resist the urge to correct. The mess of his version is part of what makes it his."],
     
    ["IV", "Your irritation is information.",
     "Small frustrations aren't flaws to manage or apologise for. They're signals — usually about something that has gone unsaid for too long. Listen to them before you swallow them. What are they actually trying to tell you?"],
     
    ["V", "Intimacy lives between two people who are present.",
     "When you've spent your day giving, it's hard to find yourself by evening. Intimacy can become another performance — caring partner, attentive lover. But intimacy isn't delivery. It's meeting. That requires you to be there, not just available. Sometimes meeting means honest no's. Sometimes it means reaching toward him because something in you wants to. Both come from the same place: you, not the version of you that everyone else needs."],
     
    ["VI", "He is also working it out, in his own way.",
     "He may not say it. He may not show it the way you would. But he is probably also carrying something — about you, the children, work, himself. His quiet is not always absence. Sometimes it's processing. Hold space for the possibility that he is doing his own internal work, even when it doesn't look like yours."],
     
    ["VII", "Receive what is offered, even when it comes in smaller portions.",
     "When he tries to show up — but not in the way or to the degree you hoped — something in you may want to refuse the offering. \"It's not enough\" or \"It should be bigger.\" That feeling is valid. But refusing small portions cements the pattern you're trying to break. Receiving is not forgiveness. It's choosing to leave room for things to grow."],
     
    ["VIII", "Coming back to yourself is not going away from him.",
     "When you start taking up more space — for your own thoughts, your own time, friendships outside the family, rest that isn't earned — he may not know what to do with it at first. He may experience it as distance. Stay with it anyway. The relationship you can build from a place of being yourself is stronger than the one you held together by ignoring yourself."],
  ];

  if (!showTheCode) {
    return (
      <div style={{ textAlign: "center", paddingTop: 24, paddingBottom: 40 }}>
        <span 
          onClick={() => setShowTheCode(true)} 
          style={{ 
            fontSize: 11, 
            color: T.muted, 
            cursor: "pointer", 
            letterSpacing: 2,
            textTransform: "uppercase"
          }}
        >
          · The Code
        </span>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px 8px 40px" }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: 24 
      }}>
        <div style={{ 
          fontSize: 10, 
          color: T.accentDark, 
          letterSpacing: 5, 
          textTransform: "uppercase" 
        }}>
          The Code
        </div>
        <span 
          onClick={() => setShowTheCode(false)} 
          style={{ 
            fontSize: 11, 
            color: T.muted, 
            cursor: "pointer", 
            letterSpacing: 1 
          }}
        >
          ✕ close
        </span>
      </div>
      
      {content.map(([num, title, body]) => (
        <div key={num} style={{ marginBottom: 28 }}>
          <div style={{ 
            fontSize: 10, 
            color: T.muted, 
            letterSpacing: 3,
            marginBottom: 4
          }}>
            {num}
          </div>
          <div style={{ 
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 18, 
            color: T.accentDark, 
            fontStyle: "italic", 
            lineHeight: 1.4,
            marginBottom: 10 
          }}>
            {title}
          </div>
          <div style={{ 
            fontSize: 13, 
            color: T.muted, 
            lineHeight: 1.7 
          }}>
            {body}
          </div>
        </div>
      ))}
    </div>
  );
}
