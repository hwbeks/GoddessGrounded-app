import { T } from "../theme";
import { useState } from "react";

export default function FirstAidKit({ showFirstAidKit, setShowFirstAidKit }) {
  const [view, setView] = useState("overview"); // "overview" | "comingback" | 0-10 (topic index)

  const topics = [
    {
      title: "When telling becomes attacking",
      shortTitle: "When telling becomes attacking",
      shortDesc: null,
      category: "pattern",
      tagline: "The accusation that came out instead of the request.",
      feeling: "Something he does — or doesn't do — has built up over weeks or months. The dirty mugs left on the counter. The way he didn't ask about your day. The fact that you're the one who remembered the school photo deadline. Again. When you finally speak, what comes out is not \"I'd like you to\" but \"You never.\" Not \"this bothered me\" but \"this is who you are.\" The frustration is real, and so is the years of asking quietly. But what you said wasn't a request — it was an accusation. And it landed that way too.",
      forHer: "He may hear your words as a verdict, not a request. Even if your specific point is fair, the \"you always\" or \"you never\" tells him this isn't about today — it's about everything. He may feel suddenly defensive, or shut down, or reach for an explanation that misses the actual point. What you needed him to hear is buried under what feels like attack. He didn't notice the photo deadline; now he's defending his entire worth as a partner.",
      tryThis: "Catch yourself before \"you always\" or \"you never.\" Replace the global claim with a specific moment and a specific feeling. \"When you didn't ask about today, I felt invisible\" lands very differently than \"You never care about me.\" The first invites a response. The second invites defense. You're allowed to be direct. You're allowed to name what's wrong. The shift is from attacking who he is to naming what happened.",
      notSay: "You never help with anything around here.",
      insteadSay: "I noticed I cleared the kitchen alone again tonight. I'd like us to figure out how to share that better.",
    },
    {
      title: "When frustration turns cold",
      shortTitle: "When frustration turns cold",
      shortDesc: null,
      category: "pattern",
      tagline: "The moment your words started carrying a verdict.",
      feeling: "Something has shifted from frustration to something colder. You've stopped expecting much from him. When he speaks, you hear yourself sigh before he finishes. The eye-roll comes before the thought. The sarcastic remark — the one that on the surface is funny because it's true but in its repetition becomes painful — comes easier than the honest sentence. The tone — that specific tone — has crept in. Underneath is something layered: an exaggeration of one of his habits as a caricature, a quiet cynical conviction that he won't change, and a position above him from which you observe rather than meet him. You know you're doing it, and on some level you've decided he's earned it. Maybe he has. But what you're doing now isn't communicating anymore. It's signalling that you've already decided who he is.",
      forHer: "This is the hardest thing to be on the receiving end of. He may not have the words for it, but he feels it — that you're not speaking to him as an equal anymore, but looking at him from somewhere slightly above. He may become quieter, or sharper, or simply less present. Even small kindnesses from him land in a room where you've already passed judgement. He stops trying because there's no place for trying to land. Over time, this can do more damage than any direct conflict — because direct conflict at least assumes there's still something to fight for.",
      tryThis: "This kind of coldness is a sign that real grievances have gone unaddressed for too long. The dry humour, the focus on certain of his habits, the eye-rolls, the cynical tone — these are leakage of frustration that needs to come out more honestly somewhere. Notice when you're doing it. Ask yourself what specific thing is actually behind it. Then make a choice: either name it directly, or let it go. What doesn't work is keeping it underground while signalling it on the surface. The signalling slowly erodes him without giving him anything to respond to. Naming it — even when it's hard — is the opposite of dismissal. It's saying you still care enough to try for something different.",
      notSay: "(sigh, eye-roll) Of course you forgot.",
      insteadSay: "It hurt me that you forgot. Can we talk about why this keeps happening?",
    },
    {
      title: "When you explain before listening",
      shortTitle: "When you explain before listening",
      shortDesc: null,
      category: "pattern",
      tagline: "You took his complaint and turned it into yours before he could finish.",
      feeling: "He says something — about you, about something you did, about something he wishes were different. Before he finishes, you're already constructing the response. The list of reasons why. The context he doesn't know. The unfairness of being criticised when you've been doing so much. Your explanation is ready before his sentence is. The context may be real. The feelings may be fair. But what you've just done is take his complaint and turn it into yours — without him having said anything about you yet. Whatever he was trying to bring to the floor never reached its destination.",
      forHer: "He came to you with something — a complaint, a feeling, a request. He may not have said it perfectly. But before he could land it, he was met with reasons, context, explanations. He may walk away thinking she can't hear me. Or worse — she heard me, and decided I was wrong before I finished. Over time, he may stop trying to bring things up at all. Not because he doesn't have them. Because there's no opening to let them through.",
      tryThis: "The urge to explain is the urge to be understood, and it's a fair urge. But it comes in the wrong order. What you might try first is something harder: hear him before you respond. Not silently waiting for your turn — actually listening, with the willingness to be wrong about something. \"Tell me more about that\" before \"but actually.\" Your context can come later. Your version can come later. The hearing has to come first, or the relationship slowly stops being a place where things can be said.",
      notSay: "You don't understand, I was up all night with the baby.",
      insteadSay: "Tell me what's bothering you about it. I want to understand before I explain.",
    },
    {
      title: "When you go quiet and stay quiet",
      shortTitle: "When you go quiet and stay quiet",
      shortDesc: null,
      category: "pattern",
      tagline: "The conversation went somewhere you couldn't be in anymore, so you left without leaving.",
      feeling: "The conversation has gone somewhere you can't be in anymore. Maybe he's pushing for an answer. Maybe you're flooded with feelings that don't have words yet. Maybe you've been here before and know nothing good comes from continuing. So you go inside. You stop responding. You may keep speaking but the real you isn't there anymore. It feels like self-protection, and it is. But it leaves him alone with whatever started this.",
      forHer: "He may not understand what just happened. One moment you were there, the next the channel between you went silent. He's speaking but nothing reaches you. You may still be in the room, but the connection between you has closed. He may try harder, push more, raise his voice — all of which makes the silence deeper. Or he may walk away too, leaving the conversation unfinished and unresolved. He may interpret your silence as not caring, when really it's the opposite — you care so much that staying present feels unbearable. But he doesn't know that.",
      tryThis: "You don't have to keep talking when you're overwhelmed. But you can name that you're overwhelmed instead of going silent. \"I can't keep going right now, I need twenty minutes.\" That's not the same as going quiet — that's repair. The difference is whether you come back. Walking away and never returning to the conversation teaches him that hard topics disappear. Walking away with a promise to return teaches him that you can both survive the conversation.",
      notSay: "(silence, turned away)",
      insteadSay: "I can't keep talking right now. I need an hour. Then I want to come back to this.",
    },
    {
      title: "When you're ready again — and he doesn't know",
      shortTitle: "When you're ready again — and he doesn't know",
      shortDesc: null,
      category: "situation",
      tagline: "You may have said no enough times that he stopped reaching. He may not know that you're starting to come back.",
      feeling: "Something is shifting. The pressure of the last weeks or months has lifted slightly. You're noticing him again — his shoulders, his voice, the way he moves around the kitchen. You're not exactly there yet, but there's an opening. You may be assuming he can feel that. That after enough soft moments, the temperature between you is obviously rising. But on his side, things may look quieter than they feel for you.",
      forHer: "He has likely been pulling back, slowly, without making it a confrontation. Each \"not tonight,\" each turned shoulder, each moment where he reached and was met with exhaustion or distance — these have accumulated. He may now be operating from a quiet rule: don't try unless the signal is unmistakable. He's not absent. He's waiting. And the waiting, after a while, starts to look like he no longer cares — which is the opposite of what's true.",
      tryThis: "Make one signal slightly clearer than feels natural to you. Not because you owe him something. Because he can't read the slow shift from your side — and waiting for him to \"just notice\" leaves you both stuck. A direct look held a second longer. A hand that lands somewhere it usually wouldn't. Saying out loud, even briefly, that something is opening. The signal doesn't have to mean tonight. It just has to mean: I'm coming back.",
      notSay: "Hoping he picks up on subtle shifts before you're entirely ready.",
      insteadSay: "I've been feeling something shift in me lately. I'm not all the way back, but I wanted you to know I'm not far either.",
    },
    {
      title: "When his efforts feel like too little, too late",
      shortTitle: "When his efforts feel like too little, too late",
      shortDesc: null,
      category: "situation",
      tagline: "He's finally doing something. You're finally doing something. And neither of you quite trusts it yet.",
      feeling: "You've been changing things. Small things — claiming an evening, asking for help instead of managing, naming what you needed. He's been changing things too. He emptied the dishwasher without being asked. He bought flowers on a Tuesday. He asked how you're doing and waited for the actual answer. After all those weeks or months or years of mismatched timing, of feeling invisible to each other, of wanting more — now you're both trying. And something in you can't quite receive what he's offering. The thank-you doesn't come out warm. The irritation comes instead. \"Now you notice?\" Or simply: nothing. You don't react at all, because reacting feels like rewarding something that should have been there all along.",
      forHer: "He took a risk. Doing the thing was already a step out of his comfort zone. Reaching for you — knowing he might be met with cold or critique — was harder still. He noticed you trying too. That's part of why he started reaching. When your response is flat, or sharp, or absent, he may not try again. Not because the resentment is your fault, but because the cost of trying just went up. Over time, he may stop. And then you'll be back where you were, with one more reason to believe nothing will change — and so will he.",
      tryThis: "This is a fragile moment. Both of you have started moving. Neither of you fully trusts that the other will keep moving. What happens here shapes whether the next step gets taken. Your resentment about the past is valid — the years of asking were real. But staying in that resentment now closes the door on the thing you both actually wanted: a relationship that changes. Receiving what he offers isn't forgiveness for what came before. It's a vote of confidence in what's possible next.\n\nAnd sometimes the lightest touch helps most. A small joke about the situation — playful enough that it can't be mistaken for sarcasm, warm enough that it lands as connection rather than commentary. Laughter together can do what a serious conversation can't. It says: we both see it, we're both here now, let's not make this heavier than it already is.",
      notSay: "Wow, took you long enough.",
      insteadSay: "A flower a day keeps the silence away. (then, more genuinely) Really though — I notice what you're doing. Thank you.",
    },
    {
      title: "When you've become the manager of everything",
      shortTitle: "When you've become the manager of everything",
      shortDesc: null,
      category: "situation",
      tagline: "You see what needs doing before he does. He sees what can wait. Over time, that difference hardened into something neither of you wanted.",
      feeling: "You're holding the calendar, the meal plan, the school updates, the doctor's appointments, the birthday gifts for his side of the family. You're the one who remembers to defrost the chicken. You're the one who notices when the kids need new shoes. He may help — when asked, when instructed, when you've already done ninety percent of the thinking. But the asking and instructing is itself exhausting. You're tired. You're resentful. And somewhere inside, you've stopped wanting him to figure it out — because you've decided he won't, or can't, or shouldn't have to be taught.\n\nUnderneath is something neither of you chose. You see things through a kind of continuous care — not as a decision, but as how your attention naturally lands. Tasks arrive with weight. Things that haven't been done yet feel like small alarms. He may see the same things, but without that weight. He can let them wait. Not because he doesn't care — because his attention works differently. Neither orientation is wrong on its own. But in one household, when one person is always alarmed and the other is always at ease, the alarmed person becomes the manager. And the at-ease person becomes a guest.",
      forHer: "He may genuinely not see what you see — not in the way you see it. To him, the undone laundry isn't urgent. To you, it's three days of mounting evidence that nothing happens unless you make it happen. When he does offer to help, your \"I'll do it myself\" or your detailed instructions may register as: she doesn't trust me with this. So he steps back further. The pattern self-reinforces. You scan and act. He defers and waits. You exhaust yourself. He feels increasingly like a guest in his own household. Both of you lose.",
      tryThis: "This pattern only breaks if both of you acknowledge it together. Not as accusation — as recognition. \"We've fallen into something. I'm managing too much. You're being managed too much. Neither of us is happy here.\" That conversation, said out loud, changes what follows.\n\nThen comes the harder part. You have to stop managing. Not \"delegate better\" — actually stop. Hand him entire domains, not tasks with instructions. \"You handle Saturdays\" or \"You own the kids' school stuff this month.\" Then resist the urge to correct, to remind, to oversee. The way he does it will be different. It may not be as efficient. It may not be as good by your standards. But it has to actually be his, or it isn't help — it's outsourcing your list while keeping the alarm.\n\nAnd his work is its own. Years of you taking the lead have slowly switched off the part of him that scans and acts on its own. That capacity can come back, but only with practice, and only with space. The space is yours to give. The practice is his to do. Neither part works without the other.",
      notSay: "Detailed instructions delivered through clenched teeth.",
      insteadSay: "I think we've fallen into something that isn't working for either of us. I want us to look at it together — and then I need to actually let go of some things, even if you do them differently than I would.",
    },
    {
      title: "When you don't recognize yourself anymore",
      shortTitle: "When you don't recognize yourself anymore",
      shortDesc: null,
      category: "situation",
      tagline: "Somewhere along the way, you became a function. You're not sure when it happened.",
      feeling: "You used to read. You used to have opinions about films. You used to laugh easily. You used to be the one who suggested things. Now you're tired by 8 PM. Your thoughts are mostly logistics. You can't remember the last time you wanted something just for yourself — not because someone else needed it, but because you did. When you catch your reflection, there's a small flicker of \"who is that.\" It feels more like absence than anything else — you're functioning, but you're not entirely present in your own life.",
      forHer: "He may not know how to reach you anymore. He may have tried — asked how you are, suggested time alone, offered to take the kids — and met with \"I'm fine\" or \"I'm too tired\" or \"I don't know what I'd do with the time.\" He may have stopped offering because the offers aren't landing. He may be missing you too, without knowing how to say it. Or he may have adjusted to the new normal — efficient partner, tired mother — and stopped expecting more.",
      tryThis: "Coming back to yourself isn't something he can do for you. It's slow work, and it starts small. What did you used to love that you've stopped doing? Not because you don't have time — because you stopped letting yourself want it. Choose one thing. A walk alone. A book that isn't useful. An evening that isn't about anyone but you. Then defend it like it matters, because it does. It's hard to be fully in the relationship if you're not in yourself first.\n\nAnd here's the part that's easy to skip: tell him. Not as a request for permission. As a statement of what's happening and why. \"I've been losing myself in everything I'm doing. I need to come back to myself, and that's going to mean taking some time and space that isn't about us or the kids. I want you to know I'm not pulling away from you. I'm trying to come back — to me, and then to us.\" Without those words, your new time alone may land as withdrawal. With them, it lands as what it actually is: investment in being able to be fully here.",
      notSay: "Disappearing on Sunday morning without explanation.",
      insteadSay: "I need Sunday morning to myself. I've been losing track of who I am, and I want to find my way back — for me, and for us.",
    },
    {
      title: "When you've stopped sharing what really matters",
      shortTitle: "When you've stopped sharing what really matters",
      shortDesc: null,
      category: "situation",
      tagline: "The conversations are about logistics now. The real things stay inside.",
      feeling: "You used to tell him things. The thought you had on the way home. The dream from last night. The small worry about your sister. Now the conversations are about pickup times and grocery lists. The real things — the lonely things, the hopeful things, the unsure things — stay in your head. You may have stopped because his responses didn't feel like landing places. Or because there's no time. Or because by the time the day is quiet enough, you're too tired to find the words.\n\nAnd so a particular kind of loneliness has settled in. Not the loneliness of being alone — the loneliness of being next to someone and keeping the real things from them. You sleep in the same bed. You manage the same household. You may even like each other, mostly. But the person who used to know what was actually going on with you — that person doesn't know anymore. And you're not sure how he would, given how long the silence has lasted.",
      forHer: "He may not know that the real things have gone quiet. Or he knows but doesn't know how to ask back in. The longer the gap, the higher the threshold for restarting it. \"How are you, really\" feels too big a question when you haven't asked it in months. He may have stopped trying because his attempts to ask got short answers, or sighs, or \"later.\" Both of you became efficient. Neither of you stayed close.\n\nHe may be feeling his own version of this. A loneliness he doesn't have words for either. Being known by you used to be one of the quietest pleasures of his life — and somewhere along the way, it stopped happening, without either of you noticing the exact moment.",
      tryThis: "Start small. Pick one thing that's actually in your head — not the biggest thing, not the hardest thing — and just say it out loud. \"Something crossed my mind today\" or \"I've been feeling something I don't know how to name.\" You don't have to know what you want from him. You just have to start letting him back into where you live. The real connection can't return through scheduled conversations. It returns through small unscheduled moments where something honest gets said.",
      notSay: "Saving the real things for \"when there's time.\"",
      insteadSay: "I want to tell you something. It's been on my mind, and I felt like sharing it with you.",
    },
    {
      title: "When your \"no\" becomes automatic",
      shortTitle: "When your \"no\" becomes automatic",
      shortDesc: null,
      category: "situation",
      tagline: "Every request becomes a weight. Even when you might want to say yes.",
      feeling: "He asks if you want to go for dinner Friday. You say no before considering it. He suggests a weekend away. You're already shaking your head. He reaches for you at night. You turn before he's finished reaching. The no comes faster than the thought. It started as protection — you'd been giving so much already, and saying no was the only way to keep something for yourself. But somewhere along the way, the no stopped being a choice and became a reflex. The yes feels like one more thing to manage. Even when, underneath, part of you might have liked to go.",
      forHer: "He stops asking. Not all at once — gradually. The number of small invitations shrinks. The number of reaches lessens. He's not punishing you. He's protecting himself from the small rejections that have been adding up. Then one day you may look up and realize he hasn't suggested anything in weeks. And you may miss it, without quite remembering when it stopped.",
      tryThis: "Pause before the automatic no. Not to force a yes — just to feel what your actual response is. Sometimes the no is real and true and necessary. Sometimes it's a reflex that's no longer protecting anything important. The pause is what creates the choice.\n\nAnd here's what's easy to forget: you lose something too when no becomes automatic. Not just his invitations — the dinners, the walks, the unplanned moments. Life comes with more surprises when you can feel room for a yes. Not because every yes is right, but because the possibility of yes is part of what makes you you. The reflex no kept you safe for a while. It may now be keeping you smaller than you want to be.\n\nWhen you do say yes — to dinner, to a walk, to a small reach — try to say it warmly. Not as a favor. As a choice you actually made.",
      notSay: "Reflex-no before you've considered it.",
      insteadSay: "Let me think about that for a second. Actually — yes. I'd like to.",
    },
    {
      title: "When you keep waiting for him to notice",
      shortTitle: "When you keep waiting for him to notice",
      shortDesc: null,
      category: "situation",
      tagline: "The thing you want him to see is so obvious you can't believe he doesn't. You've stopped pointing it out.",
      feeling: "There's something you wish he would notice. That you're exhausted. That the way he speaks to the kids matters more than he knows. That you'd like a Saturday to yourself without having to ask for it like it's a special favor. You used to mention these things. Now you've stopped. Either he'll figure it out or he won't. And every day he doesn't, the resentment grows quieter and harder.\n\nUnderneath all of this sits a belief that's hard to admit but worth naming: that if he really cared, he would see it without being told. That having to say it out loud somehow makes it count less. That love should arrive as understanding, not as response to explanation. That belief is doing a lot of quiet damage. As long as it stays in place, no amount of clarity from you will feel like enough — because the clarity itself is proof that he didn't get there on his own.",
      forHer: "He may actually see what you see — but not with the same weight. He notices you moving more slowly. He hears the shorter answers. He sees the tired eyes. To him, that registers as \"she's having a tired week.\" For you, it's the third month in a row of running on empty, and the exhaustion is screaming for recognition. He's not blind. He's reading the signal at the wrong volume.\n\nThere's another layer. A man who's spent years in a household where you've always functioned has learned to see your functioning as the baseline. He has no reference for \"too much\" because it has always been this much. What feels like accumulation to you feels like normal to him. Not because he doesn't care — because his calibration is built on what you've shown him.\n\nBy the time he does notice, the gap is so large he doesn't know where to start. He may feel he's failed at something he didn't even know was being measured.",
      tryThis: "The expectation that he'll notice without being told is a setup for both of you. He's not a mind-reader, and waiting for him to become one is a slow form of giving up. Naming what you want is not lowering the bar — it's giving him the chance to actually meet it. The belief that having to ask makes it count less is one of the most expensive beliefs in a long relationship. It costs you the help you need, and it costs him the chance to give it.\n\nYou can say it directly without making it a complaint. \"I want you to know I'm exhausted\" is not a criticism — it's information. He can do something with information. He can't do anything with silent expectations.",
      notSay: "Hoping he'll figure it out, then resenting that he hasn't.",
      insteadSay: "I want to tell you something I should have said earlier. I'm running on empty. I need help, and I don't know yet what it looks like.",
    },
  ];

  if (!showFirstAidKit) {
    return (
      <div
        onClick={() => setShowFirstAidKit(true)}
        style={{
          background: T.warm,
          border: `1px solid ${T.accentLight}`,
          borderRadius: 16,
          padding: "24px 18px",
          marginTop: 16,
          marginBottom: 10,
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        <div style={{ fontSize: 36, marginBottom: 12 }}>⚓</div>
        <div style={{ 
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 16, 
          color: T.accentDark, 
          fontStyle: "italic", 
          marginBottom: 8, 
          lineHeight: 1.5 
        }}>
          If the ground beneath your feet shifts,<br />you might regain your balance here.
        </div>
        <div style={{ fontSize: 11, color: T.muted, letterSpacing: 2, textTransform: "uppercase", marginTop: 8 }}>
          First Aid Kit →
        </div>
      </div>
    );
  }

  // ─── Topic view (Laag 2) ───────────────────────────
  if (typeof view === "number") {
    const t = topics[view];
    return (
      <div style={{ padding: "20px 24px 80px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <span onClick={() => setView("overview")} style={{ fontSize: 12, color: T.muted, cursor: "pointer", letterSpacing: 1 }}>← Back</span>
          <span onClick={() => setShowFirstAidKit(false)} style={{ fontSize: 12, color: T.muted, cursor: "pointer", letterSpacing: 1 }}>✕ Close</span>
        </div>

        <div style={{ fontSize: 11, color: T.accentDark, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
          {t.category === "pattern" ? "Pattern" : "Situation"}
        </div>
        <div style={{ 
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 22, 
          color: T.accentDark, 
          fontStyle: "italic", 
          marginBottom: 6, 
          lineHeight: 1.3 
        }}>
          {t.title}
        </div>
        {t.tagline && (
          <div style={{ fontSize: 14, color: T.muted, fontStyle: "italic", marginBottom: 20, lineHeight: 1.6 }}>
            {t.tagline}
          </div>
        )}

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: T.accentDark, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>What you're feeling</div>
          <div style={{ fontSize: 13, color: T.text, lineHeight: 1.7, whiteSpace: "pre-line" }}>{t.feeling}</div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: T.accentDark, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>How it may land for him</div>
          <div style={{ fontSize: 13, color: T.text, lineHeight: 1.7, whiteSpace: "pre-line" }}>{t.forHer}</div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: T.accentDark, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>What you might try</div>
          <div style={{ fontSize: 13, color: T.text, lineHeight: 1.7, whiteSpace: "pre-line" }}>{t.tryThis}</div>
        </div>

        <div style={{ background: T.warm, border: `1px solid ${T.accentLight}`, borderRadius: 12, padding: "16px 16px", marginTop: 20 }}>
          <div style={{ fontSize: 11, color: T.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Not</div>
          <div style={{ fontSize: 13, color: T.muted, fontStyle: "italic", marginBottom: 12, lineHeight: 1.6 }}>"{t.notSay}"</div>
          <div style={{ fontSize: 11, color: T.accentDark, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Instead</div>
          <div style={{ fontSize: 13, color: T.text, fontStyle: "italic", lineHeight: 1.6 }}>"{t.insteadSay}"</div>
        </div>

        <div style={{ fontSize: 11, color: T.muted, textAlign: "center", marginTop: 24, fontStyle: "italic" }}>
          Want to understand more about this? →
          <div style={{ fontSize: 10, marginTop: 4 }}>(coming in next version)</div>
        </div>
      </div>
    );
  }

  // ─── Coming back view (Laag 1B) ────────────────────
  if (view === "comingback") {
    return (
      <div style={{ padding: "20px 24px 80px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <span onClick={() => setView("overview")} style={{ fontSize: 12, color: T.muted, cursor: "pointer", letterSpacing: 1 }}>← Back</span>
          <span onClick={() => setShowFirstAidKit(false)} style={{ fontSize: 12, color: T.muted, cursor: "pointer", letterSpacing: 1 }}>✕ Close</span>
        </div>

        <div style={{ fontSize: 11, color: T.accentDark, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>A note on</div>
        <div style={{ 
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 26, 
          color: T.accentDark, 
          fontStyle: "italic", 
          marginBottom: 24 
        }}>
          Coming back
        </div>

        <div style={{ fontSize: 13, color: T.text, lineHeight: 1.8, marginBottom: 16 }}>
          Sometimes the silence afterwards hurts a long relationship more than the conflict itself. The unspoken hours. The conversation that ended without ending.
        </div>

        <div style={{ fontSize: 13, color: T.text, lineHeight: 1.8, marginBottom: 16 }}>
          Coming back is the work of returning — to him, and to yourself, after something has gone wrong. It doesn't have to be a big conversation. It doesn't have to use the word "sorry." It just has to be a signal, given consciously, that says: I'm not letting this drift.
        </div>

        <div style={{ fontSize: 13, color: T.text, lineHeight: 1.8, marginBottom: 16 }}>
          Returning to a healed relationship doesn't mean overlooking the return to yourself. The disbalance you came here to work on lived in both places — in the relationship and in your own ground. A repair that fixes one while forgetting the other puts you back where you started, only with a quieter version of the same pattern. Real balance is both — relationship restored, self not abandoned in the process.
        </div>

        <div style={{ fontSize: 13, color: T.text, lineHeight: 1.8, marginBottom: 16 }}>
          You don't have to be the only one who reaches. This is important. A relationship in which one person always repairs and the other always waits is not balance — it's another version of the imbalance you came here to work on. Sometimes coming back means making the first small move. Sometimes it means letting him make it, and receiving what he offers without demanding it be perfect.
        </div>

        <div style={{ fontSize: 13, color: T.text, lineHeight: 1.8, marginBottom: 16 }}>
          What this can look like:
        </div>

        <div style={{ fontSize: 13, color: T.text, lineHeight: 1.8, marginBottom: 16, paddingLeft: 16, borderLeft: `2px solid ${T.accentLight}` }}>
          A small gesture the next morning. A hand on his shoulder when he wasn't expecting it. A short message in the middle of the day: "I'm feeling some distance between us tonight. I'm hoping we can find each other again."
        </div>

        <div style={{ fontSize: 13, color: T.text, lineHeight: 1.8, marginBottom: 16, paddingLeft: 16, borderLeft: `2px solid ${T.accentLight}` }}>
          Or: "I was harder than I meant to be — and I still need us to talk about what's underneath it. But I didn't want the silence to grow."
        </div>

        <div style={{ fontSize: 13, color: T.text, lineHeight: 1.8, marginBottom: 24, paddingLeft: 16, borderLeft: `2px solid ${T.accentLight}` }}>
          Or simply: choosing not to keep the distance going. Sitting next to him. Asking about his day. Letting the kindness happen even when part of you wants to keep the wall up.
        </div>

        <div style={{ fontSize: 13, color: T.text, lineHeight: 1.8, marginBottom: 16 }}>
          Coming back is not the same as agreeing. It's not pretending the disagreement didn't happen. It's saying: the disagreement happened, and we're not letting it become the wall.
        </div>

        <div style={{ fontSize: 13, color: T.text, lineHeight: 1.8, fontStyle: "italic", marginTop: 24, paddingTop: 24, borderTop: `1px solid ${T.border}` }}>
          The acceptance of each other's effort is where the relationship can deepen. The relationships that survive long years aren't the ones without rupture. They're the ones where two people keep finding ways back to each other — even when the ways are small, even when the timing is uneven, even when neither of you knows yet exactly how.
        </div>
      </div>
    );
  }

  // ─── Overview (Laag 1) ─────────────────────────────
  return (
    <div style={{ padding: "20px 24px 80px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: T.accentDark, letterSpacing: 2, textTransform: "uppercase" }}>First Aid Kit</div>
        <span onClick={() => setShowFirstAidKit(false)} style={{ fontSize: 12, color: T.muted, cursor: "pointer", letterSpacing: 1 }}>✕ Close</span>
      </div>

      <div style={{ fontSize: 13, color: T.text, lineHeight: 1.8, marginBottom: 16 }}>
        Before anything else, this:
      </div>

      <div style={{ fontSize: 13, color: T.text, lineHeight: 1.8, marginBottom: 14 }}>
        You're here looking for balance. With yourself, with him, with everything you carry. The work is real and it's quiet — small choices made daily, old hobbies picked up again, a question asked aloud, a moment claimed without guilt.
      </div>

      <div style={{ fontSize: 13, color: T.text, lineHeight: 1.8, marginBottom: 14 }}>
        But balance is not a place you arrive at alone. A relationship that works isn't one where you find your ground while he stays in his confusion. It's one where both of you keep moving — sometimes together, sometimes one step ahead of the other, sometimes through friction that has to be worked through.
      </div>

      <div style={{ fontSize: 13, color: T.text, lineHeight: 1.8, marginBottom: 14 }}>
        And so the friction comes. Maybe because you've been carrying too much for too long, and something finally cracks. Maybe because you're starting to take up more space, and he doesn't yet know what to do with that. Maybe because patterns between you — old, well-practiced — keep pulling you back into the same loop. The crisis isn't a failure of your work. It's the place where the work has to happen between two people instead of one.
      </div>

      <div style={{ fontSize: 13, color: T.text, lineHeight: 1.8, marginBottom: 14 }}>
        This kit is for those moments. To help you stay in choice when things get hard. To find your way back to each other without losing the ground you've gained.
      </div>

      <div style={{ fontSize: 13, color: T.text, lineHeight: 1.8, marginBottom: 14 }}>
        In those moments, when you notice yourself reacting in ways that surprise you — quicker irritation, longer silences, less interest in what he says — something in you may already be protecting. Your patience tightens. Your shoulders set. An old guardedness arrives before you've named it. That's not failure. That's your system remembering.
      </div>

      <div style={{ fontSize: 13, color: T.text, lineHeight: 1.8, marginBottom: 14 }}>
        And here's what's easy to forget in those moments: he probably isn't your enemy. He may be confused, or hurt, or also tired. Even when his words sound like indifference, or excuses, or distance.
      </div>

      <div style={{ fontSize: 13, color: T.text, lineHeight: 1.8, marginBottom: 14 }}>
        Whether or not you've been the one carrying more doesn't change what's happening between you now. Two people reaching for connection — even unevenly — can still wound each other when the patterns take over.
      </div>

      <div style={{ fontSize: 13, color: T.text, lineHeight: 1.8, marginBottom: 14 }}>
        What follows are patterns and situations you may recognize (what you're feeling), a short explanation of how it may land for him (how it may land for him), and suggestions for alternatives (what you might try instead).
      </div>

      <div style={{ fontSize: 13, color: T.text, lineHeight: 1.8, marginBottom: 24 }}>
        These are suggestions, not scripts. You know your relationship. Use what fits, leave what doesn't.
      </div>

      <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: T.accentDark, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>The four patterns</div>
        <div style={{ fontSize: 13, color: T.text, lineHeight: 1.7, marginBottom: 16 }}>
          These patterns can appear in almost every long-term relationship — yours, his, everyone's. Reading them isn't about diagnosing him. It's about recognizing what's happening between you, so you can step out of it.
        </div>
        {topics.filter(t => t.category === "pattern").map((t, i) => (
          <div
            key={i}
            onClick={() => setView(i)}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${T.border}`, cursor: "pointer" }}
          >
            <div style={{ fontSize: 13, color: T.text, fontStyle: "italic" }}>
              {t.shortTitle}
            </div>
            <span style={{ fontSize: 14, color: T.muted }}>›</span>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: T.accentDark, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Other situations</div>
        {topics.map((t, i) => t.category === "situation" && (
          <div
            key={i}
            onClick={() => setView(i)}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${T.border}`, cursor: "pointer" }}
          >
            <div style={{ fontSize: 13, color: T.text, fontStyle: "italic" }}>
              {t.shortTitle}
            </div>
            <span style={{ fontSize: 14, color: T.muted }}>›</span>
          </div>
        ))}
      </div>

      <div
        onClick={() => setView("comingback")}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, cursor: "pointer", marginBottom: 24 }}
      >
        <div style={{ fontSize: 13, color: T.accentDark, fontStyle: "italic" }}>
          A note on coming back
        </div>
        <span style={{ fontSize: 14, color: T.accentDark }}>›</span>
      </div>

      <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.7, marginBottom: 12 }}>
        This kit draws on our own interpretation of long-standing research from John Gottman and others on what makes relationships last — and what slowly erodes them.
      </div>

      <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.7, marginBottom: 12 }}>
        It's intended for the phase before therapy may be needed. Not a replacement for it.
      </div>

      <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.7, marginBottom: 16 }}>
        It's not the right resource for situations involving personality disorders, trauma, or relationships with abuse or violence. If any of these apply, please reach out to a qualified professional.
      </div>

      <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.7, fontStyle: "italic", paddingTop: 16, borderTop: `1px solid ${T.border}` }}>
        If this isn't enough, please reach out to a qualified relationship therapist or counsellor. Many things in long relationships are real and worth working on with someone trained to help.
      </div>
    </div>
  );
}
