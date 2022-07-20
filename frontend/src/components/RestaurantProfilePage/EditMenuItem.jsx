import React, { useState, useEffect } from 'react';
import { Stack, Typography, TextField, Button } from '@mui/material';

function EditMenuItem(props) {
  const { item, inAdd, locationType, handleUpdateCompletionClick } = props;
  // const { name, description, price, type, image } = item; // reservationDate
  const [itemId, setItemId] = useState('');

  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemPrice, setItemPrice] = useState('');

  // const [itemReservationDate, setItemReservationDate] = useState(reservationDate);

  const [itemFoodType, setItemFoodType] = useState('');
  const [itemPicture, setItemPicture] = useState('');

  const buttonItemNameText = locationType === 'restaurant' ? 'Menu' : 'Ticket';
  const buttonText = inAdd
    ? `Create New ${buttonItemNameText}!`
    : `Complete ${buttonItemNameText} update!`;
  const nameLabel = locationType === 'restaurant' ? 'Menu Name' : 'Ticket Name';
  const descriptionLabel =
    locationType === 'restaurant' ? 'Menu Description' : 'Ticket Description';
  const priceLabel = locationType === 'restaurant' ? 'Menu Price' : 'Ticket Price';

  // const menuType = 'Event Date';

  const menuTypeLabel = 'Menu Food Type';
  const pictureLabel = 'Menu Picture';

  useEffect(() => {
    const isItemUndefined = typeof item !== 'undefined';
    setItemId(isItemUndefined ? item._id : '');
    setItemName(isItemUndefined ? item.name : '');
    setItemDescription(isItemUndefined ? item.description : '');
    setItemPrice(isItemUndefined ? item.price : '');
    if (locationType === 'restaurant') {
      setItemFoodType(isItemUndefined ? item.type : '');
      setItemPicture(isItemUndefined ? item.image : '');
    }
  }, [item]);

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
          handleUpdateCompletionClick(
            e,
            inAdd
              ? {
                  itemId,
                  itemName,
                  itemDescription,
                  itemPrice,
                  itemPicture
                }
              : {
                  itemId,
                  itemName,
                  itemDescription,
                  itemPrice,
                  itemPicture
                }
          );
        }}>
        {buttonText}
      </Button>
    </Stack>
  );
}

export default EditMenuItem;
