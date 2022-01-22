import React from "react";
import Backdrop from "@mui/material/Backdrop";

const BackDrop = props => {
  const { children, open, onClick } = props;
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }}
      open={open}
      onClick={onClick}
    >
      <div className="w-auto flex justify-center items-center fixed bg-yellow-400">
        {children}
      </div>
    </Backdrop>
  );
};

export default BackDrop;
