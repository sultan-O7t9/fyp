import React, { useRef } from "react";

import {
  Button,
  Icon,
  Tooltips,
  TooltipsContent,
} from "@material-tailwind/react";

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
