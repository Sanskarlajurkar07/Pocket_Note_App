import React, { useState } from "react";

import plusIcon from "../assets/plus.png";
import GroupModal from "./GroupModal";
import "./Sidebar.css";

function Sidebar(props) {
    const colors = ["#7C4DFF", "#536DFE", "#448AFF", "#40C4FF", "#64FFDA"];

    const [listOpen, setListOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [initialColor, setInitialColor] = useState(colors[0]);

    const handleCreate = ({ name, color }) => {
        if (props.addGp) {
            const res = props.addGp({ name, color: color || colors[0] });
            if (res && res.error === "duplicate") {
                alert("Group already exists");
                return;
            }
            if (res && res.error === "name-too-short") {
                alert("Group name at least 2 char");
                return;
            }
        }
        setModalOpen(false);
        setListOpen(false);
    };

    return (
        <div className="sidebar">
           <ul className={`sidebar_list ${listOpen ? "sidebar_list_active" : ""}`}>
            {colors.map((item, index) => (
               <li
                  key={index}
                  className="sidebar_list_item"
                  style={{ backgroundColor: item }}
                  onClick={() => { setInitialColor(item); setModalOpen(true); }}
               />
            ))}
           </ul>
           <div className="sidebar_fab" onClick={() => setModalOpen(true)}>
              <img src={plusIcon} alt="Add new note" />
           </div>

        <GroupModal
            visible={modalOpen}
            initialColor={initialColor}
            onClose={() => setModalOpen(false)}
            onCreate={handleCreate}
          />
        </div>
    );
}

export default Sidebar;









