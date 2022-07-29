import React, { useState, useEffect } from 'react';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListSubheader from '@mui/material/ListSubheader';
import { CardActionArea } from '@mui/material';

const DEFAULT_MIN_HEIGHT = 350;

export default function FilterBox({
  label,
  height,
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

  const handleChange = (value) => {
    const valueIdx = localSelections.indexOf(value);
    const isPreviouslySelected = valueIdx > -1;

    if (isPreviouslySelected) {
      setLocalSelections(localSelections.filter((_, idx) => valueIdx !== idx)); // Deselect
    } else {
      setLocalSelections([...localSelections, value]); // Select
    }
  };

  useEffect(() => {
    setIsSelectedAll(options.length === localSelections.length);
    onSelectionChange(localSelections);
  }, [localSelections]);

  return (
    <List
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
        position: 'relative',
        border: 1,
        borderColor: 'lightgray',
        borderRadius: '4px',
        color: disabled ? 'lightgray' : '',
        overflow: 'auto',
        height: height || DEFAULT_MIN_HEIGHT,
        '& ul': { padding: 0 }
      }}
      subheader={<li />}>
      <li>
        <ul>
          <ListSubheader>
            <>
              {label}

              <CardActionArea onClick={triggerSelectAll} disabled={disabled}>
                <ListItem sx={{ p: 0 }}>
                  <Checkbox
                    key={`${label}-SelectAll`}
                    checked={isSelectedAll}
                    disabled={disabled}
                  />

                  <ListItemText
                    sx={{ color: disabled ? 'lightgray' : '' }}
                    primary="Select All Options"
                  />
                </ListItem>
              </CardActionArea>
            </>
          </ListSubheader>

          {options.map((option, idx) => {
            const _name = getName(option);
            const _value = getValue(option);

            return (
              <li key={`${label}-${_value}-${idx}`}>
                <ul>
                  <CardActionArea onClick={() => handleChange(_value)} disabled={disabled}>
                    <ListItem key={_value}>
                      <Checkbox
                        key={`${label}-${_value}`}
                        checked={localSelections.indexOf(_value) > -1}
                        disabled={disabled}
                      />

                      <ListItemText sx={{ color: disabled ? 'lightgray' : '' }} primary={_name} />
                    </ListItem>
                  </CardActionArea>
                </ul>
              </li>
            );
          })}
        </ul>
      </li>
    </List>
  );
}
