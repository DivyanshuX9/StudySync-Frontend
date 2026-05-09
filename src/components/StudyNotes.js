import React, { useState, useEffect } from "react";
import { auth, onAuthStateChanged } from "./firebase";
import Navbar from "./Navbar";
import "./StudyNotes.css";

const StudyNotes = () => {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem("ss-notes")) || []);
  const [active, setActive] = useState(null);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");

  useEffect(() => { const u = onAuthStateChanged(auth, setUser); return u; }, []);
  useEffect(() => { localStorage.setItem("ss-notes", JSON.stringify(notes)); }, [notes]);

  const createNote = () => {
    const note = {
      id: Date.now(),
      title: "Untitled Note",
      content: "",
      tags: [],
      updatedAt: Date.now(),
    };
    setNotes([note, ...notes]);
    setActive(note);
  };

  const updateNote = (field, value) => {
    const updated = notes.map((n) =>
      n.id === active.id ? { ...n, [field]: value, updatedAt: Date.now() } : n
    );
    setNotes(updated);
    setActive({ ...active, [field]: value });
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((n) => n.id !== id));
    if (active?.id === id) setActive(null);
  };

  const addTag = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      const tag = e.target.value.trim().toLowerCase();
      if (!active.tags.includes(tag)) updateNote("tags", [...active.tags, tag]);
      e.target.value = "";
    }
  };

  const removeTag = (tag) => updateNote("tags", active.tags.filter((t) => t !== tag));

  const allTags = [...new Set(notes.flatMap((n) => n.tags))];

  const filtered = notes.filter((n) => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());
    const matchTag = tagFilter ? n.tags.includes(tagFilter) : true;
    return matchSearch && matchTag;
  });

  const fmt = (ts) => new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric" });

  return (
    <div className="page-wrapper">
      <Navbar user={user} />
      <div className="notes-layout">
        {/* Sidebar */}
        <aside className="notes-sidebar">
          <div className="sidebar-top">
            <h2 className="sidebar-title">Notes</h2>
            <button className="btn-new-note" onClick={createNote}>+</button>
          </div>

          <input
            className="notes-search"
            type="text"
            placeholder="Search notes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {allTags.length > 0 && (
            <div className="tag-filters">
              <button className={!tagFilter ? "tag-chip active" : "tag-chip"} onClick={() => setTagFilter("")}>All</button>
              {allTags.map((t) => (
                <button key={t} className={tagFilter === t ? "tag-chip active" : "tag-chip"} onClick={() => setTagFilter(t)}>
                  #{t}
                </button>
              ))}
            </div>
          )}

          <div className="notes-list">
            {filtered.length === 0 && <p className="empty-state">No notes found.</p>}
            {filtered.map((note) => (
              <div
                key={note.id}
                className={`note-item ${active?.id === note.id ? "active" : ""}`}
                onClick={() => setActive(note)}
              >
                <div className="note-item-header">
                  <span className="note-item-title">{note.title || "Untitled"}</span>
                  <button className="note-item-del" onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}>✕</button>
                </div>
                <p className="note-item-preview">{note.content.slice(0, 60) || "Empty note…"}</p>
                <span className="note-item-date">{fmt(note.updatedAt)}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Editor */}
        <main className="notes-editor">
          {active ? (
            <>
              <input
                className="note-title-input"
                value={active.title}
                onChange={(e) => updateNote("title", e.target.value)}
                placeholder="Note title…"
              />
              <div className="note-tags-row">
                {active.tags.map((t) => (
                  <span key={t} className="note-tag">
                    #{t}
                    <button onClick={() => removeTag(t)}>×</button>
                  </span>
                ))}
                <input
                  className="tag-input"
                  placeholder="Add tag + Enter"
                  onKeyDown={addTag}
                />
              </div>
              <textarea
                className="note-body"
                value={active.content}
                onChange={(e) => updateNote("content", e.target.value)}
                placeholder="Start writing your notes here…"
              />
            </>
          ) : (
            <div className="editor-empty">
              <span>📝</span>
              <p>Select a note or create a new one</p>
              <button className="btn-new-note-lg" onClick={createNote}>+ New Note</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudyNotes;
