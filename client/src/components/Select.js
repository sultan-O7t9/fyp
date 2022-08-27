import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Select as MuiSelect } from "@mui/material";

const Select = props => {
  const { value, setValue, label, items, ...restProps } = props;
  console.log(value);
  const handleChange = event => {
    console.log(event.target.value, value);

    setValue(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        {label ? (
          <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        ) : null}
        <MuiSelect
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label={label}
          onChange={handleChange}
          {...restProps}
        >
          {items && items.length
            ? items.map(item => (
                <MenuItem
                  key={item.id}
                  value={item.value ? item.value : item.id}
                >
                  {item.text}
                </MenuItem>
              ))
            : null}
        </MuiSelect>
      </FormControl>
    </Box>
  );
};
export default Select;
