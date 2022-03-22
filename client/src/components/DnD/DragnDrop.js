import React, { useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DraggableElement from "./DraggableElement";
// import uuid from "uuid/v5";
const DragDropContextContainer = ({ children }) => {
  return (
    <div
      style={{
        padding: "20px",
        width: "600px",
        height: "800px",
        border: "4px solid blue",
        borderRadius: "6px",
      }}
    >
      {children}
    </div>
  );
};

const ListGrid = ({ children }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridGap: "8px",
        margin: "10px",
      }}
    >
      {children}
    </div>
  );
};

// fake data generator
const getItems = (count, prefix) =>
  Array.from({ length: count }, (v, k) => k).map(k => {
    const randomId = Math.floor(Math.random() * 1000);
    return {
      id: `item-${randomId}`,
      prefix,
      content: `item ${randomId}`,
    };
  });

const removeFromList = (list, index) => {
  const result = Array.from(list);
  const [removed] = result.splice(index, 1);
  return [removed, result];
};

const addToList = (list, index, element) => {
  const result = Array.from(list);
  result.splice(index, 0, element);
  return result;
};

const lists = ["All Groups", "Assigned Groups"];
// const allGroups = ["SE_18_18", "SE_18_19", "SE_18_20", "SE_18_21", "SE_18_22"];

const generateLists = () =>
  lists.reduce(
    (acc, listKey) => ({ ...acc, [listKey]: getItems(10, listKey) }),
    {}
  );

const allGroups = [
  {
    id: new Date().getTime() * Math.random().toString(),
    name: "Group 1",
  },
  {
    id: new Date().getTime() * Math.random().toString(),
    name: "Group 2",
  },
  {
    id: new Date().getTime() * Math.random().toString(),
    name: "Group 3",
  },
];
const columns = [
  {
    [new Date().getTime() * Math.random().toString()]: {
      name: "All Groups",
      items: [...allGroups],
    },
  },
];

const DragnDrop = () => {
  return (
    <DragDropContextContainer>
      <DragDropContext onDropEnd={result => console.log(result)}>
        {Object.entries(columns).map(([id, column]) => {
          return (
            <Droppable droppableId={id}>
              {(provided, snapshot) => {
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    background: snapshot.isDraggingOver
                      ? "lightblue"
                      : "lightgrey",
                    padding: "10px",
                    borderRadius: "6px",
                    width: "250px",
                    height: "500px",
                  }}
                >
                  {columns.items.map(item => {
                    return (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                      ></Draggable>
                    );
                  })}
                </div>;
              }}
            </Droppable>
          );
        })}
      </DragDropContext>
    </DragDropContextContainer>
  );
};

export default DragnDrop;

// function DragList() {
//   const [elements, setElements] = React.useState({
//     AllGroups: [...allGroups],
//     AssignedGroups: [],
//   });

//   //   useEffect(() => {
//   //     setElements(generateLists());
//   //   }, []);

//   const onDragEnd = result => {
//     if (!result.destination) {
//       return;
//     }
//     const listCopy = { ...elements };

//     const sourceList = listCopy[result.source.droppableId];
//     const [removedElement, newSourceList] = removeFromList(
//       sourceList,
//       result.source.index
//     );
//     listCopy[result.source.droppableId] = newSourceList;
//     const destinationList = listCopy[result.destination.droppableId];
//     listCopy[result.destination.droppableId] = addToList(
//       destinationList,
//       result.destination.index,
//       removedElement
//     );

//     setElements(listCopy);
//   };

//   return (
//     <DragDropContextContainer>
//       <DragDropContext onDragEnd={onDragEnd}>
//         <ListGrid>
//           {/* {lists.map(listKey => (
//             <DraggableElement
//               elements={elements[listKey]}
//               key={listKey}
//               prefix={listKey}
//             />
//           ))} */}
//           <DraggableElement
//             elements={allGroups}
//             key={23242}
//             prefix={"All Groups"}
//           />
//         </ListGrid>
//       </DragDropContext>
//     </DragDropContextContainer>
//   );
// }

// export default DragList;
