import React, { useState, useEffect } from "react";
import "./Sidebar.css";

function GroupModal({ visible, onClose, onCreate, initialColor }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(initialColor || "#7C4DFF");

  useEffect(() => {
    if (visible) {
      setColor(initialColor || "#7C4DFF");
      setName("");
    }
  }, [visible, initialColor]);

  if (!visible) return null;

  const colors = ["#7C4DFF", "#E062FF", "#FF80AB", "#FFB74D", "#448AFF", "#2962FF"];

  const canCreate = name.trim().length >= 2;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Create New group</h3>
        <label className="modal-label">Group Name</label>
        <input
          className="modal-input"
          placeholder="Enter group name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div style={{height:12}} />

        <label className="modal-label">Choose colour</label>
        <div className="modal-colors">
          {colors.map((c) => (
            <button
              key={c}
              className={`color-chip ${color === c ? "color-chip-active" : ""}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>

        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            disabled={!canCreate}
            onClick={() => {
              if (!canCreate) return;
              onCreate({ name: name.trim(), color });
              setName("");
            }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

export default GroupModal;