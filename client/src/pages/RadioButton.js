import React from "react";
import Radio from "@material-tailwind/react/Radio";

export default function RadioButton() {
  return (
    <>
      <Radio color="lightBlue" text="Option 1" id="option-1" name="option" />
      <Radio color="lightBlue" text="Option 2" id="option-2" name="option" />
    </>
  );
}
