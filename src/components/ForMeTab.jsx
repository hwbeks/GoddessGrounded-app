import { T, css } from "../theme";
import { supabase } from "../supabase";
import { useState, useEffect } from "react";

function daysUntil(dateStr) {
  const today = new Date();
  const target = new Date(dateStr + "T00:00:00");
  target.setFullYear(today.getFullYear());
  if (target.getMonth() === today.getMonth() && target.getDate() === today.getDate()) return 0;
  if (target < today) target.setFullYear(today.getFullYear() + 1);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function ForMeTab({ currentUser }) {
  const [view, setView] = useState("events"); // "events" | "reminders"
  const [events, setEvents] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: "", date: "", days_before: 7 });
  const [newReminder, setNewReminder] = useState({ title: "", date: "", time: "", repeat: "never" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      let user = currentUser;
      if (!user) {
        const { data: { user: freshUser } } = await supabase.auth.getUser();
        user = freshUser;
      }
      if (!user) return;

      const { data: eventsData } = await supabase
        .from("events")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: true });

      if (eventsData) {
        setEvents(eventsData.sort((a, b) => daysUntil(a.date) - daysUntil(b.date)));
      }

      const { data: remindersData } = await supabase
        .from("reminders")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: true });

      if (remindersData) setReminders(remindersData);
      setLoading(false);
    }
    load();
  }, [currentUser]);

  async function addEvent() {
    if (!newEvent.name || !newEvent.date) return;
    let user = currentUser;
    if (!user) {
      const { data: { user: freshUser } } = await supabase.auth.getUser();
      user = freshUser;
    }
    if (!user) return;

    const { data } = await supabase.from("events").insert({
      user_id: user.id,
      name: newEvent.name,
      date: newEvent.date,
      days_before: newEvent.days_before,
      emoji: "📅",
      repeat_yearly: true,
    }).select().single();

    if (data) setEvents((e) => [...e, data].sort((a, b) => daysUntil(a.date) - daysUntil(b.date)));
    setNewEvent({ name: "", date: "", days_before: 7 });
    setShowAddEvent(false);
  }

  async function addReminder() {
    if (!newReminder.title || !newReminder.date) return;
    let user = currentUser;
    if (!user) {
      const { data: { user: freshUser } } = await supabase.auth.getUser();
      user = freshUser;
    }
    if (!user) return;

    const { data } = await supabase.from("reminders").insert({
      user_id: user.id,
      title: newReminder.title,
      date: newReminder.date,
      time: newReminder.time || null,
      repeat: newReminder.repeat,
      done: false,
    }).select().single();

    if (data) setReminders((r) => [...r, data]);
    setNewReminder({ title: "", date: "", time: "", repeat: "never" });
    setShowAddReminder(false);
  }

  async function toggleReminder(id) {
    const reminder = reminders.find((r) => r.id === id);
    if (!reminder) return;
    const newDone = !reminder.done;
    await supabase.from("reminders").update({
      done: newDone,
      completed_at: newDone ? new Date().toISOString() : null,
    }).eq("id", id);
    setReminders((r) => r.map((x) => x.id === id ? { ...x, done: newDone } : x));
  }

  async function deleteEvent(id) {
    await supabase.from("events").delete().eq("id", id);
    setEvents((e) => e.filter((x) => x.id !== id));
  }

  async function deleteReminder(id) {
    await supabase.from("reminders").delete().eq("id", id);
    setReminders((r) => r.filter((x) => x.id !== id));
  }

  return (
    <div style={{ padding: "24px 24px 0" }}>

      {/* Toggle */}
      <div style={{ display: "flex", gap: 0, border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden", marginBottom: 24 }}>
        {[{ id: "events", label: "Moments" }, { id: "reminders", label: "Reminders" }].map((s) => (
          <button
            key={s.id}
            onClick={() => setView(s.id)}
            style={{
              flex: 1,
              padding: "10px 14px",
              fontSize: 11,
              fontFamily: "'Jost', sans-serif",
              fontWeight: view === s.id ? 500 : 300,
              background: view === s.id ? T.accent : "transparent",
              color: view === s.id ? T.bg : T.muted,
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

      {/* EVENTS */}
      {view === "events" && (
        <div>
          <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: T.muted, marginBottom: 16 }}>
            Moments that matter to you
          </div>

          {events.length === 0 && !loading && (
            <div style={{ ...css.card, textAlign: "center", padding: "32px 24px", marginBottom: 16 }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>📅</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontStyle: "italic", color: T.muted }}>
                Add moments you want to remember — for yourself or with others.
              </div>
            </div>
          )}

          {events.map((event) => {
            const days = daysUntil(event.date);
            return (
              <div key={event.id} style={{ ...css.card, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 14, color: T.text, marginBottom: 4 }}>{event.name}</div>
                  <div style={{ fontSize: 12, color: days <= 7 ? T.accent : T.muted }}>
                    {days === 0 ? "Today 🌸" : days === 1 ? "Tomorrow" : `In ${days} days`}
                  </div>
                </div>
                <button
                  onClick={() => deleteEvent(event.id)}
                  style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 16, padding: "0 4px" }}
                >
                  ×
                </button>
              </div>
            );
          })}

          <button style={{ ...css.btnGhost, marginTop: 8 }} onClick={() => setShowAddEvent(true)}>
            + Add a moment
          </button>
        </div>
      )}

      {/* REMINDERS */}
      {view === "reminders" && (
        <div>
          <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: T.muted, marginBottom: 16 }}>
            Things you've promised yourself
          </div>

          {reminders.length === 0 && !loading && (
            <div style={{ ...css.card, textAlign: "center", padding: "32px 24px", marginBottom: 16 }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>🌿</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontStyle: "italic", color: T.muted }}>
                Add reminders for things you want to do — for yourself.
              </div>
            </div>
          )}

          {reminders.map((reminder) => (
            <div key={reminder.id} style={{ ...css.card, marginBottom: 12, display: "flex", alignItems: "center", gap: 14 }}>
              <div
                onClick={() => toggleReminder(reminder.id)}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  border: `2px solid ${reminder.done ? T.accent : T.border}`,
                  background: reminder.done ? T.accent : "transparent",
                  cursor: "pointer",
                  flexShrink: 0,
                  transition: "all 0.2s",
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: reminder.done ? T.muted : T.text, textDecoration: reminder.done ? "line-through" : "none" }}>
                  {reminder.title}
                </div>
                <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>
                  {new Date(reminder.date).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}
                  {reminder.time && ` · ${reminder.time.slice(0, 5)}`}
                </div>
              </div>
              <button
                onClick={() => deleteReminder(reminder.id)}
                style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 16, padding: "0 4px" }}
              >
                ×
              </button>
            </div>
          ))}

          <button style={{ ...css.btnGhost, marginTop: 8 }} onClick={() => setShowAddReminder(true)}>
            + Add a reminder
          </button>
        </div>
      )}

      {/* ADD EVENT MODAL */}
      {showAddEvent && (
        <div style={css.modal} onClick={() => setShowAddEvent(false)}>
          <div style={css.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: T.accentDark, marginBottom: 20, fontStyle: "italic" }}>
              Add a moment
            </div>
            <label style={css.label}>What is it?</label>
            <input
              style={css.input}
              placeholder="e.g. My birthday, Girls weekend"
              value={newEvent.name}
              onChange={(e) => setNewEvent((n) => ({ ...n, name: e.target.value }))}
            />
            <label style={css.label}>Date</label>
            <input
              style={css.input}
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent((n) => ({ ...n, date: e.target.value }))}
            />
            <label style={css.label}>Remind me this many days before</label>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {[3, 7, 14, 30].map((d) => (
                <button
                  key={d}
                  onClick={() => setNewEvent((n) => ({ ...n, days_before: d }))}
                  style={{
                    flex: 1,
                    background: newEvent.days_before === d ? T.accent : T.accentSoft,
                    color: newEvent.days_before === d ? T.bg : T.text,
                    border: `1px solid ${newEvent.days_before === d ? T.accent : T.border}`,
                    borderRadius: 10, padding: "10px 4px", fontSize: 13,
                    fontWeight: "bold", cursor: "pointer", fontFamily: "'Jost', sans-serif",
                  }}
                >
                  {d}d
                </button>
              ))}
            </div>
            <button style={{ ...css.btn, opacity: newEvent.name && newEvent.date ? 1 : 0.4 }} onClick={addEvent}>
              Save moment
            </button>
            <button style={{ ...css.btnGhost, marginTop: 10 }} onClick={() => setShowAddEvent(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ADD REMINDER MODAL */}
      {showAddReminder && (
        <div style={css.modal} onClick={() => setShowAddReminder(false)}>
          <div style={css.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: T.accentDark, marginBottom: 20, fontStyle: "italic" }}>
              Add a reminder
            </div>
            <label style={css.label}>What do you want to remember?</label>
            <input
              style={css.input}
              placeholder="e.g. Call mum, Book that yoga class"
              value={newReminder.title}
              onChange={(e) => setNewReminder((r) => ({ ...r, title: e.target.value }))}
            />
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <label style={css.label}>Date</label>
                <input style={{ ...css.input, marginBottom: 12 }} type="date" value={newReminder.date} onChange={(e) => setNewReminder((r) => ({ ...r, date: e.target.value }))} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={css.label}>Time (optional)</label>
                <input style={{ ...css.input, marginBottom: 12 }} type="time" value={newReminder.time} onChange={(e) => setNewReminder((r) => ({ ...r, time: e.target.value }))} />
              </div>
            </div>
            <label style={css.label}>Repeat</label>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {["never", "weekly", "monthly"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setNewReminder((r) => ({ ...r, repeat: opt }))}
                  style={{
                    flex: 1,
                    background: newReminder.repeat === opt ? T.accent : T.accentSoft,
                    color: newReminder.repeat === opt ? T.bg : T.text,
                    border: `1px solid ${newReminder.repeat === opt ? T.accent : T.border}`,
                    borderRadius: 10, padding: "9px 4px", fontSize: 11,
                    fontWeight: "bold", cursor: "pointer", fontFamily: "'Jost', sans-serif",
                    textTransform: "capitalize",
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
            <button style={{ ...css.btn, opacity: newReminder.title && newReminder.date ? 1 : 0.4 }} onClick={addReminder}>
              Save reminder
            </button>
            <button style={{ ...css.btnGhost, marginTop: 10 }} onClick={() => setShowAddReminder(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
