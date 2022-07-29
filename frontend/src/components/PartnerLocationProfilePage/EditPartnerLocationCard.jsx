import React, { useState, useEffect } from 'react';
import { Box, Grid, TextField, Button, List } from '@mui/material';
import Spinner from '../common/Spinner';
import ImageUpload from '../common/ImageUpload';
import { PARTNER_TYPE_RESTAURANT } from '../../shared/constants';
import EditRestaurantMultipleSelectDropdown from './EditRestaurantMultipleSelectDropdown';
import * as constants from '../../shared/constants';

export default function EditPartnerLocationCard({
  partner,
  lazyLoading,
  handlePartnerFieldsChange
}) {
  const [partnerName, setPartnerName] = useState(partner.name);
  const [partnerAddress, setPartnerAddress] = useState(partner.address);
  const [partnerPhoneNumber, setPartnerPhoneNumber] = useState(partner.phoneNumber);
  const [partnerLocationPicture, setPartnerLocationPicture] = useState(partner.locationPicture);

  const [restaurantCuisines, setRestaurantCuisines] = useState(partner.cuisines);
  const [restaurantFoodTypes, setRestaurantFoodTypes] = useState(partner.foodTypes);
  const [restaurantPriceLevels, setRestaurantPriceLevels] = useState(partner.priceLevels);

  const LABEL_PREFIX =
    partner.partnerType === PARTNER_TYPE_RESTAURANT ? 'Restaurant' : 'Tourist Attraction';

  // Listening to the changes in partner
  useEffect(() => {
    setPartnerName(partner.name);
    setPartnerAddress(partner.address);
    setPartnerPhoneNumber(partner.phoneNumber);
    setPartnerLocationPicture(partner.locationPicture);
  }, [partner]);

  const onPartnerNameChange = (event) => {
    setPartnerName(event.target.value);
  };

  const onPartnerAddressChange = (event) => {
    setPartnerAddress(event.target.value);
  };

  const onPartnerPhoneNumberChange = (event) => {
    setPartnerPhoneNumber(event.target.value);
  };

  const onPartnerLocationPictureChange = (profilePictureUpdated) => {
    setPartnerLocationPicture(profilePictureUpdated);
  };

  const handleCuisineChange = (params) => {
    setRestaurantCuisines(params);
  };

  const handleFoodTypeChange = (params) => {
    setRestaurantFoodTypes(params);
  };

  const handlePriceLevelChange = (params) => {
    setRestaurantPriceLevels(params);
  };

  return (
    <Box component="form" sx={{ width: '100%' }} justifyContent="center">
      <Grid container direction="column" justifyContent="center" spacing={2}>
        {lazyLoading ? (
          <Spinner marginTop="1em" />
        ) : (
          <List
            sx={{
              width: '100%',
              bgcolor: 'background.paper',
              position: 'relative',
              overflow: 'auto',
              minHeight: '1.5em',
              maxHeight: '30em',
              marginTop: '10px',
              '& ul': { padding: 0 }
            }}>
            <Grid>
              <Grid container direction="column" justifyContent="center" spacing={2}>
                <Grid sx={{ mt: 2, mb: 2 }} container item>
                  <Grid item xs={2} />

                  <Grid item xs={8}>
                    <ImageUpload
                      objectId={partner._id}
                      image={partnerLocationPicture}
                      onSaveSuccess={onPartnerLocationPictureChange}
                    />
                  </Grid>

                  <Grid item xs={2} />
                </Grid>

                <Grid container item>
                  <Grid item xs={2} />

                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      required
                      id="outlined-required"
                      label={`${LABEL_PREFIX} Name`}
                      value={partnerName}
                      onChange={onPartnerNameChange}
                    />
                  </Grid>

                  <Grid item xs={2} />
                </Grid>

                <Grid container item>
                  <Grid item xs={2} />

                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      id="outlined-required"
                      label={`${LABEL_PREFIX} Phone Number`}
                      value={partnerPhoneNumber}
                      onChange={onPartnerPhoneNumberChange}
                    />
                  </Grid>

                  <Grid item xs={2} />
                </Grid>

                <Grid container item>
                  <Grid item xs={2} />

                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      required
                      id="outlined-required"
                      label={`${LABEL_PREFIX} Address`}
                      value={partnerAddress}
                      onChange={onPartnerAddressChange}
                    />
                  </Grid>

                  <Grid item xs={2} />
                </Grid>

                <Grid container item>
                  <Grid item xs={2} />

                  {partner.partnerType === PARTNER_TYPE_RESTAURANT ? (
                    <Grid item xs={8}>
                      <EditRestaurantMultipleSelectDropdown
                        label="Cuisine(s)"
                        itemList={constants.cuisines}
                        selectedItems={restaurantCuisines}
                        handleDropdownSelection={handleCuisineChange}
                      />
                    </Grid>
                  ) : (
                    <Grid item xs={8} />
                  )}

                  <Grid item xs={2} />
                </Grid>

                <Grid container item>
                  <Grid item xs={2} />

                  {partner.partnerType === PARTNER_TYPE_RESTAURANT ? (
                    <Grid item xs={8}>
                      <EditRestaurantMultipleSelectDropdown
                        label="Food Types"
                        itemList={constants.foodTypes}
                        selectedItems={restaurantFoodTypes}
                        handleDropdownSelection={handleFoodTypeChange}
                      />
                    </Grid>
                  ) : (
                    <Grid item xs={8} />
                  )}
                  <Grid item xs={2} />
                </Grid>

                <Grid container item>
                  <Grid item xs={2} />
                  {partner.partnerType === PARTNER_TYPE_RESTAURANT ? (
                    <Grid item xs={8}>
                      <EditRestaurantMultipleSelectDropdown
                        label="Price Levels"
                        itemList={constants.priceLevels}
                        selectedItems={restaurantPriceLevels}
                        handleDropdownSelection={handlePriceLevelChange}
                      />
                    </Grid>
                  ) : (
                    <Grid item xs={8} />
                  )}

                  <Grid item xs={2} />
                </Grid>

                <Grid container item>
                  <Grid item xs={2} />

                  <Grid
                    container
                    item
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    xs={8}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        handlePartnerFieldsChange({
                          partnerName,
                          partnerAddress,
                          partnerPhoneNumber,
                          partnerLocationPicture,
                          restaurantCuisines,
                          restaurantFoodTypes,
                          restaurantPriceLevels
                        });
                      }}>
                      Save
                    </Button>
                  </Grid>

                  <Grid item xs={2} />
                </Grid>
              </Grid>
            </Grid>
          </List>
        )}
      </Grid>
    </Box>
  );
}
