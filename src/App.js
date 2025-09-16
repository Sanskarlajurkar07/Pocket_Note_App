import React, { useEffect, useState } from "react";

import NoteContainer from "./Components/NoteContainer/NoteContainer";
import Sidebar from "./Components/Sidebar/Sidebar";
import GroupModal from "./Components/Sidebar/GroupModal";

import "./App.css";

function App() {
  // groups: array of { id, name, color }
  const [groups, setGroups] = useState(
    JSON.parse(localStorage.getItem("pocket-groups")) || []
  );

  // active group id
  const [activeGroupId, setActiveGroupId] = useState(
    localStorage.getItem("pocket-active-group") || null
  );

  // notes is derived from active group
  const [notes, setNotes] = useState(
    JSON.parse(localStorage.getItem("pocket-notes-" + (localStorage.getItem("pocket-active-group") || ""))) || []
  );

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("pocket-groups", JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem("pocket-active-group", activeGroupId);
    // load notes for active group
    const stored = JSON.parse(localStorage.getItem("pocket-notes-" + (activeGroupId || ""))) || [];
    setNotes(stored);
  }, [activeGroupId]);

  const addGroup = ({ name, color }) => {
    const trimmed = name.trim();
    if (trimmed.length < 2) return { error: "name-too-short" };
    // prevent duplicates (case-insensitive)
    if (groups.some((g) => g.name.toLowerCase() === trimmed.toLowerCase())) {
      return { error: "duplicate" };
    }
    const newGroup = { id: Date.now() + "" + Math.floor(Math.random() * 99), name: trimmed, color };
    const next = [...groups, newGroup];
    setGroups(next);
    // auto-select new group
    setActiveGroupId(newGroup.id);
    setModalOpen(false);
    return { ok: true };
  };

  const persistNotesForActive = (nextNotes) => {
    setNotes(nextNotes);
    localStorage.setItem("pocket-notes-" + (activeGroupId || ""), JSON.stringify(nextNotes));
  };

  const addNoteToGroup = (text) => {
    const next = [
      ...notes,
      { id: Date.now() + "" + Math.floor(Math.random() * 99), text, createdAt: Date.now(), updatedAt: Date.now() }
    ];
    persistNotesForActive(next);
  };

  const deleteNote = (id) => {
    const next = notes.filter((n) => n.id !== id);
    persistNotesForActive(next);
  };

  const updateText = (text, id) => {
    const next = notes.map((n) => (n.id === id ? { ...n, text, updatedAt: Date.now() } : n));
    persistNotesForActive(next);
  };

  const activeGroup = groups.find((g) => g.id === activeGroupId) || null;

  return (
    <div className="App">
      <div className="left-column">
        <div className="brand">Pocket Notes</div>

        <div className="groups-list">
          {groups.length === 0 ? (
            <div className="groups-empty">No groups yet</div>
          ) : (
            groups.map((g) => (
              <div
                key={g.id}
                onClick={() => setActiveGroupId(g.id)}
                className={`left-group-item ${g.id === activeGroupId ? 'active' : ''}`}
              >
                <div className="group-avatar" style={{background: g.color}}>
                  {g.name.slice(0,2).toUpperCase()}
                </div>
                <div className="group-name">{g.name}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Top bar - only show when there's an active group */}
      {activeGroup && (
        <div className="top-bar">
          <div className="avatar" style={{background: activeGroup.color}}>
            {activeGroup.name.slice(0,2).toUpperCase()}
          </div>
          <div style={{fontWeight:600}}>{activeGroup.name}</div>
        </div>
      )}

      <div className="app-body">
        {!activeGroup ? (
          <div className="hero">
            <div className="hero-illustration" style={{backgroundImage: `url(/assets/illustration.svg)`}} />
            <h2 className="hero-title">Pocket Notes</h2>
            <p className="hero-subtitle">
              Send and receive messages without keeping your phone online.<br />
              Use Pocket Notes on up to 4 linked devices and 1 mobile phone
            </p>
            <div className="encryption-indicator">
              <span>🔒</span>
              <span>end-to-end encrypted</span>
            </div>
          </div>
        ) : (
          <div className="notes-area">
            <div className="notes-canvas">
              <NoteContainer
                notes={notes}
                deleteNote={deleteNote}
                updateText={updateText}
                addNoteToGroup={addNoteToGroup}
                activeGroup={activeGroup}
              />
            </div>
          </div>
        )}
      </div>

      {/* Left-positioned FAB */}
      <div className="fab-left" onClick={() => setModalOpen(true)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Group creation modal */}
      <GroupModal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={addGroup}
        initialColor="#7C4DFF"
      />
    </div>
  );
}

export default App;