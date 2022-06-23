import { Button, Box, InputBase, Card, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { getCities } from '../queries/partner-location-queries';

function SearchBar() {
  const [cities, setCities] = useState([]);
  const [item, setItem] = useState('');

  const setSelectedItem = (event) => {
    setItem(event.target.value);
  };
  const searchSelectedItem = (searchTerm) => {
    setItem(searchTerm);
  };

  useEffect(() => {
    getCities().then((data) => {
      setCities(data);
    });
  }, []);

  return (
    <Grid>
      <Box display="flex" justifyContent="center" alignItems="flex-end">
        <Card display="inline-grid">
          <SearchIcon />
          <InputBase
            type="text"
            placeholder="Select a destination"
            value={item}
            onChange={setSelectedItem}
          />
          <Button
            justifyContent="flex-end"
            alignItems="flex-end"
            onClick={() => searchSelectedItem(item)}>
            {' '}
            Search{' '}
          </Button>
        </Card>
        <Card display="inline-grid">
          {cities
            .filter((city) => {
              const searchedItem = item.toLowerCase();
              const cityName = city.toLowerCase();

              return searchedItem && cityName.startsWith(searchedItem) && cityName !== searchedItem;
            })
            .map((city) => (
              <div onClick={() => searchSelectedItem(city)} key={city}>
                {city}
              </div>
            ))}
        </Card>
      </Box>
    </Grid>
  );
}

export default SearchBar;
