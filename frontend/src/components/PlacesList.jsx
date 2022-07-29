/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Grid, Pagination } from '@mui/material';
import PlaceCard from './PlaceCard';

const PAGE_SIZE = 20;

export default function PlacesList({
  partnerLocations,
  selectedPartnerLocationObject,
  onSelectedPartnerLocationsChange,
  onPaginationChange
}) {
  const [partnerLocationDictionary, setPartnerLocationDictionary] = useState({});
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Listening to the changes in partnerLocations
  useEffect(() => {
    // The dictionary is used for O(1) access
    setPartnerLocationDictionary(
      Object.assign(
        {},
        ...partnerLocations.map((partnerLocation) => ({ [partnerLocation._id]: partnerLocation }))
      )
    );

    // Set number of pages
    setNumPages(Math.ceil(partnerLocations.length / PAGE_SIZE));
  }, [partnerLocations]);

  const getPage = () => {
    return Array.from({ length: PAGE_SIZE }, (_, idx) => (currentPage - 1) * PAGE_SIZE + idx);
  };

  const selectPartnerLocation = (selectedPartnerLocationId) => {
    onSelectedPartnerLocationsChange({
      ...selectedPartnerLocationObject,
      [selectedPartnerLocationId]: partnerLocationDictionary[selectedPartnerLocationId]
    });
  };

  const deselectPartnerLocation = (deselectedPartnerLocationId) => {
    const selectedPartnerLocationsUpdated = { ...selectedPartnerLocationObject }; // Copy the object
    delete selectedPartnerLocationsUpdated[deselectedPartnerLocationId]; // Delete the deselected one

    onSelectedPartnerLocationsChange(selectedPartnerLocationsUpdated);
  };

  const isSelected = (partnerLocationToId) => {
    return selectedPartnerLocationObject[partnerLocationToId];
  };

  return (
    <Grid>
      {partnerLocations
        ? getPage()
            .filter((idx) => idx < partnerLocations.length)
            .map((idx) => (
              <PlaceCard
                key={partnerLocations[idx]._id}
                partnerLocation={partnerLocations[idx]}
                cardSelected={isSelected(partnerLocations[idx]._id)}
                onPlaceCardSelect={selectPartnerLocation}
                onPlaceCardDeselect={deselectPartnerLocation}
              />
            ))
        : []}

      <Pagination
        sx={{
          display: 'flex',
          justifyContent: 'center',
          li: {
            display: 'block'
          },
          mt: 2,
          mb: 2
        }}
        page={currentPage}
        count={numPages}
        onChange={(_, page) => {
          setCurrentPage(page);
          onPaginationChange();
        }}
        color="primary"
        variant="outlined"
      />
    </Grid>
  );
}
