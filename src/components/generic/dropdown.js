import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"

export const DefaultDropdownItem = (item, index) => <MenuItem key={index} value={item.value}>{item.name}</MenuItem>

export const Dropdown = ({ title, disabled=false, value, onChange, items = [], renderItems = DefaultDropdownItem }) => {
  return (<FormControl disabled={disabled} fullWidth>
    <InputLabel id={`select-dropdown-${title}`}>{title}</InputLabel>
    <Select
      labelId={`select-dropdown-${title}`}
      value={value}
      label={title}
      onChange={onChange}
    >
      {items.map(renderItems)}
    </Select>
  </FormControl>)
}