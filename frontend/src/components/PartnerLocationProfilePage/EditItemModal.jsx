import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Modal, Box, Stack, Typography, TextField, Button } from '@mui/material';

function EditItemModal(props) {
  const { item, inAdd, itemEditAddMode, locationType, handleItemChangeCompletionClick } = props;
  const { partnerId } = useParams();

  // const { name, description, price, type, image } = item; // reservationDate
  const [_id, setItemId] = useState('');

  const [name, setItemName] = useState('');
  const [description, setItemDescription] = useState('');
  const [price, setItemPrice] = useState('');

  // const [itemReservationDate, setItemReservationDate] = useState(reservationDate);

  const [type, setItemFoodType] = useState('');
  const [image, setItemPicture] = useState('');

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
  const pictureLabel = locationType === 'restaurant' ? 'Menu Picture' : 'Ticket Picture';

  useEffect(() => {
    setItemId(!inAdd ? item._id : '');
    setItemName(!inAdd ? item.name : '');
    setItemDescription(!inAdd ? item.description : '');
    setItemPrice(!inAdd ? item.price : '');
    setItemPicture(!inAdd ? item.image : '');
    if (locationType === 'restaurant') {
      setItemFoodType(!inAdd ? item.type : '');
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

  const getChangedItemObject = () => {
    let itemObject =
      locationType === 'restaurant'
        ? {
            name,
            description,
            price,
            type,
            // type,
            appliedDiscountRate: 0,
            restaurant: partnerId,
            image
          }
        : {
            name,
            description,
            price,
            appliedDiscountRate: 0,
            reservationDate: new Date(),
            expirationDate: new Date(),
            touristAttraction: partnerId,
            image
          };
    itemObject = !inAdd ? { ...itemObject, _id } : itemObject;
    return itemObject;
  };

  return (
    <Modal open={itemEditAddMode}>
      <Box sx={{ width: 400 }}>
        <Stack spacing={2}>
          <Typography align="center">{buttonText}</Typography>
          <TextField
            required
            id="outlined-required"
            label={nameLabel}
            value={name}
            onChange={(e) => onItemNameChange(e)}
          />
          <TextField
            required
            id="outlined-required"
            label={descriptionLabel}
            value={description}
            onChange={(e) => onItemDescriptionChange(e)}
          />
          <TextField
            required
            id="outlined-required"
            label={priceLabel}
            value={price}
            onChange={(e) => onItemPriceChange(e)}
          />
          <TextField
            required
            id="outlined-required"
            label={pictureLabel}
            value={image}
            onChange={(e) => onItemPictureChange(e)}
          />
          {locationType === 'restaurant' ? (
            <TextField
              required
              id="outlined-required"
              label={menuTypeLabel}
              value={type}
              onChange={(e) => onItemFoodTypeChange(e)}
            />
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
              handleItemChangeCompletionClick(e, getChangedItemObject());
            }}>
            {buttonText}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}

export default EditItemModal;
