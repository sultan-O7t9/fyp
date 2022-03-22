import { Draggable } from "react-beautiful-dnd";
import { ListItem as MuiListItem, Typography } from "@mui/material";

const ListItem = ({ item, index }) => {
  // const randomHeader = useMemo(() => lorem.generateWords(5), []);

  return (
    <Draggable draggableId={item} index={index}>
      {(provided, snapshot) => {
        return (
          <MuiListItem
            ref={provided.innerRef}
            snapshot={snapshot}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Typography variant="body1">{item}</Typography>
          </MuiListItem>
        );
      }}
    </Draggable>
  );
};

export default ListItem;
