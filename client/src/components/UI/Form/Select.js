import React, { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Select as MuiSelect } from "@mui/material";

export default function Select(props) {
  const { label, options, onSelect, multiple, disabled } = props;
  const [value, setValue] = useState([]);

  const optionSelectHandler = event => {
    if (multiple && event.target.value.length > 3) {
      return;
    }
    onSelect(event);
    setValue(event.target.value);
  };

  return (
    <FormControl required fullWidth>
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <MuiSelect
        multiple={multiple}
        disabled={disabled}
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value}
        label={label}
        onChange={optionSelectHandler}
      >
        {options && options.length
          ? options.map(option => (
              <MenuItem
                key={option.id}
                disabled={option.disabled}
                value={option.value}
              >
                {option.label}
              </MenuItem>
            ))
          : null}
      </MuiSelect>
    </FormControl>
  );
}
