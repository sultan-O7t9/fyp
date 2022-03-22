import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { Item } from "./Item";

const GROUPS = [
  { id: 1, name: "SE_18_1" },
  { id: 2, name: "SE_18_18" },
  { id: 3, name: "SE_18_19" },
  { id: 4, name: "SE_18_20" },
];

export const AssignedGroups = () => {
  const [assignedGroups, setAssignedGroups] = useState([]);
  const [{ isOver }, dropRef] = useDrop({
    accept: "group",
    drop: item =>
      setAssignedGroups(assignedGroups =>
        !assignedGroups.includes(item)
          ? [...assignedGroups, item]
          : assignedGroups
      ),
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <React.Fragment>
      <div className="groups">
        {GROUPS.map(group => (
          <Item draggable id={group.id} name={group.name} />
        ))}
      </div>
      <div className="assignedGroups" ref={dropRef}>
        {assignedGroups.map(group => (
          <Item id={group.id} name={group.name} />
        ))}
        {isOver && <div>Drop Here!</div>}
      </div>
    </React.Fragment>
  );
};
