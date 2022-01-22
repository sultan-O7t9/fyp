import React, { useRef } from "react";
import Button from "@material-tailwind/react/Button";
import Icon from "@material-tailwind/react/Icon";
import Tooltips from "@material-tailwind/react/Tooltips";
import TooltipsContent from "@material-tailwind/react/TooltipsContent";

const TableNavButton = props => {
  const { icon, tooltip, onClick } = props;
  const buttonRef = useRef();
  return (
    <div className="mr-4">
      <Button
        ref={buttonRef}
        color="lightBlue"
        buttonType="filled"
        size="regular"
        rounded={true}
        block={false}
        iconOnly={true}
        ripple="light"
        onClick={onClick}
      >
        <Icon name={icon} size="sm" />
      </Button>
      <Tooltips placement="top" ref={buttonRef}>
        <TooltipsContent>{tooltip}</TooltipsContent>
      </Tooltips>
    </div>
  );
};

export default TableNavButton;
