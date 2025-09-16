import React, { useState, useEffect, useRef } from "react";

import Note from "../Note/Note";

import "./NoteContainer.css";

function NoteContainer(props) {
  const [text, setText] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    // clear input when group changes
    setText("");
  }, [props.activeGroup]);
  
  const reverArray = (arr) => {
    const array = [];
    for (let i = arr.length - 1; i >= 0; --i) {
      array.push(arr[i]);
    }
    return array;
  };

  const notes = reverArray(props.notes);

  const handleCreate = () => {
    const content = text.trim();
    if (!content) return;
    props.addNoteToGroup(content);
    setText("");
    inputRef.current && inputRef.current.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCreate();
    }
  };

  return (
    <div className="note-container">
      <div className="note-container_notes custom-scroll">
        {notes?.length > 0 ? (
          notes.map((item) => (
            <Note
              key={item.id}
              note={item}
              deleteNote={props.deleteNote}
              updateText={props.updateText}
            />
          ))
        ) : (
          <h3>No Notes present</h3>
        )}
      </div>

      <div className="note-input-bar">
        <textarea
          ref={inputRef}
          className="note-input"
          placeholder="Enter your text here..........."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className={`note-send ${text.trim() ? "note-send-active" : ""}`}
          onClick={handleCreate}
          aria-label="send"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default NoteContainer;