/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Button, InputBase, Card, Grid } from '@mui/material';
import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';

const data = [{ name: 'Munich' }, { name: 'Berlin' }, { name: 'Istanbul' }, { name: 'Malaga' }];

const CustomCard = styled(Card)(() => ({
  width: '30%'
}));

function SearchBar() {
  const [item, setItem] = useState('');
  const setSelectedItem = (event) => {
    setItem(event.target.value);
  };
  const searchSelectedItem = (searchTerm) => {
    setItem(searchTerm);
  };
  return (
    <Grid>
      <Grid>
        <CustomCard>
          <SearchIcon />
          <InputBase
            type="text"
            placeholder="Select a destination"
            value={item}
            onChange={setSelectedItem}
          />
          <Button onClick={() => searchSelectedItem(item)}> Search </Button>
        </CustomCard>
        <CustomCard>
          {data
            .filter((dataItem) => {
              const searchedItem = item.toLowerCase();
              const dataItemName = dataItem.name.toLowerCase();

              return (
                searchedItem &&
                dataItemName.startsWith(searchedItem) &&
                dataItemName !== searchedItem
              );
            })
            .map((dataItem) => (
              <div onClick={() => searchSelectedItem(dataItem.name)} key={dataItem.name}>
                {dataItem.name}
              </div>
            ))}
        </CustomCard>
      </Grid>
    </Grid>
  );
}

export default SearchBar;
