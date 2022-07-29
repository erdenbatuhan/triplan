/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const ITEM_HEIGHT = 100;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const VALUE_SELECT_ALL = 'select_all';

export default function FilterBox({
  label,
  options,
  nameKey,
  valueKey,
  selections,
  onSelectionChange,
  disabled
}) {
  const getName = (option) => (nameKey ? option[nameKey] : option);
  const getValue = (option) => (valueKey ? option[valueKey] : option);

  const [localSelections, setLocalSelections] = useState(selections || []);
  const [isSelectedAll, setIsSelectedAll] = useState(options.length === localSelections.length);

  const triggerSelectAll = () => {
    if (isSelectedAll) {
      setLocalSelections([]);
    } else {
      setLocalSelections(options.map(getValue));
    }
  };

  const handleChange = (event) => {
    const isSelectAll = event.target.value.includes(VALUE_SELECT_ALL);

    if (isSelectAll) {
      triggerSelectAll();
    } else {
      setLocalSelections(event.target.value);
    }
  };

  useEffect(() => {
    setIsSelectedAll(options.length === localSelections.length);
    onSelectionChange(localSelections);
  }, [localSelections]);

  return (
    <div>
      <FormControl sx={{ mt: 2, mb: 2, width: '100%' }}>
        <InputLabel>{label}</InputLabel>

        <Select
          multiple
          value={localSelections}
          onChange={handleChange}
          input={<OutlinedInput label={label} />}
          renderValue={(selected) =>
            !selected.length
              ? 'No items selected'
              : `${selected.length} ${label.toLocaleLowerCase()}`
          }
          MenuProps={MenuProps}
          disabled={disabled}>
          <MenuItem key={`${label}-SelectAll`} value={VALUE_SELECT_ALL}>
            <Checkbox checked={isSelectedAll} disabled={disabled} />
            <ListItemText
              sx={{ color: disabled ? 'lightgray' : '' }}
              primary="Select All Options"
            />
          </MenuItem>

          {options.map((option, idx) => {
            const _name = getName(option);
            const _value = getValue(option);

            return (
              <MenuItem key={`${label}-${_value}-${idx}`} value={_value}>
                <Checkbox checked={localSelections.indexOf(_value) > -1} disabled={disabled} />
                <ListItemText sx={{ color: disabled ? 'lightgray' : '' }} primary={_name} />
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
}
