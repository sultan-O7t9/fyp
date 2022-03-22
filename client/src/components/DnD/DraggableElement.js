import { Draggable, Droppable } from "react-beautiful-dnd";
import ListItem from "./ListItem";
import React from "react";
import { Typography } from "@mui/material";

// const ColumnHeader = styled.div`
//   text-transform: uppercase;
//   margin-bottom: 20px;
// `;

const DroppableStyles = ({ children }) => {
  return (
    <div
      style={{ padding: "10px", borderRadius: "6px", background: "#d4d4d4" }}
    >
      {children}
    </div>
  );
};

const DraggableElement = ({ prefix, elements }) => (
  <DroppableStyles>
    {/* <ColumnHeader>{prefix}</ColumnHeader> */}
    <Draggable draggableId={`${prefix}`}>
      {provided => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          {elements.map((item, index) => (
            // <ListItem key={item} item={item} index={index} />
            <Typography key={item}>{item}</Typography>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Draggable>
  </DroppableStyles>
);

export default DraggableElement;
