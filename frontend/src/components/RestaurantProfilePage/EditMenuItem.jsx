import React, { useState } from 'react';
import { Stack, Typography, TextField, Button } from '@mui/material';

function EditMenuItem(props) {
  const { item, locationType, handleUpdateCompletionClick } = props;
  const { _id, name, description, price, type, image } = item; // reservationDate

  const [itemName, setItemName] = useState(name);
  const [itemDescription, setItemDescription] = useState(description);
  const [itemPrice, setItemPrice] = useState(price);

  // const [itemReservationDate, setItemReservationDate] = useState(reservationDate);

  const [itemFoodType, setItemFoodType] = useState(type);
  const [itemPicture, setItemPicture] = useState(image);

  const buttonText = locationType === 'restaurant' ? 'Menu' : 'Ticket';
  const nameLabel = locationType === 'restaurant' ? 'Menu Name' : 'Ticket Name';
  const descriptionLabel =
    locationType === 'restaurant' ? 'Menu Description' : 'Ticket Description';
  const priceLabel = locationType === 'restaurant' ? 'Menu Price' : 'Ticket Price';

  // const menuType = 'Event Date';

  const menuTypeLabel = 'Menu Food Type';
  const pictureLabel = 'Menu Picture';

  const onItemNameChange = (e) => {
    setItemName(e.target.value);
  };
  const onItemDescriptionChange = (e) => {
    setItemDescription(e.target.value);
  };
  const onItemPriceChange = (e) => {
    setItemPrice(e.target.value);
  };

  // const onItemReservationDateChange = (e) => {
  //   setItemReservationDate(e.target.value);
  // };

  const onItemFoodTypeChange = (e) => {
    setItemFoodType(e.target.value);
  };
  const onItemPictureChange = (e) => {
    setItemPicture(e.target.value);
  };

  return (
    <Stack spacing={2}>
      <Typography align="center">Update Your Menu!</Typography>
      <TextField
        required
        id="outlined-required"
        label={nameLabel}
        value={itemName}
        onChange={(e) => onItemNameChange(e)}
      />
      <TextField
        required
        id="outlined-required"
        label={descriptionLabel}
        value={itemDescription}
        onChange={(e) => onItemDescriptionChange(e)}
      />
      <TextField
        required
        id="outlined-required"
        label={priceLabel}
        value={itemPrice}
        onChange={(e) => onItemPriceChange(e)}
      />
      {locationType === 'restaurant' ? (
        <>
          <TextField
            required
            id="outlined-required"
            label={menuTypeLabel}
            value={itemFoodType}
            onChange={(e) => onItemFoodTypeChange(e)}
          />
          <TextField
            required
            id="outlined-required"
            label={pictureLabel}
            value={itemPicture}
            onChange={(e) => onItemPictureChange(e)}
          />
        </>
      ) : (
        // <TextField
        //   required
        //   id="outlined-required"
        //   label={pictureLabel}
        //   value={itemReservationDate}
        //   onChange={(e) => onItemReservationDateChange(e)}
        // />
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <></>
      )}
      <Button
        onClick={(e) => {
          handleUpdateCompletionClick(e, {
            _id,
            itemName,
            itemDescription,
            itemPrice,
            itemPicture
          });
        }}>
        {' '}
        Complete {buttonText} update!{' '}
      </Button>
    </Stack>
  );
}

export default EditMenuItem;
