import React from "react";
import { useDrag } from "react-dnd";

export const Item = ({ id, name }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: "group",
    item: { id, name },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });
  return (
    <div className="pet-card" ref={dragRef}>
      {name}
      {isDragging && "😱"}
    </div>
  );
};
