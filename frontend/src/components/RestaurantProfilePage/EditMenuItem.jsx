import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Modal, Box, Stack, Typography, TextField, Button } from '@mui/material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

function EditMenuItem(props) {
  const { item, inAdd, itemEditAddMode, locationType, handleUpdateCompletionClick } = props;
  const { partnerId } = useParams();

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
    // const isItemUndefined = typeof item !== 'undefined';
    console.log('item: ', item);
    // console.log('isItemUndefined: ', isItemUndefined);
    console.log('inAdd: ', inAdd);
    console.log('!!!inAdd: ', !inAdd);

    setItemId(!inAdd ? item._id : '');
    setItemName(!inAdd ? item.name : '');
    setItemDescription(!inAdd ? item.description : '');
    setItemPrice(!inAdd ? item.price : '');
    if (locationType === 'restaurant') {
      setItemFoodType(!inAdd ? item.type : '');
      setItemPicture(!inAdd ? item.image : '');
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
    <Modal open={itemEditAddMode}>
      <Box sx={{ ...modalStyle, width: 400 }}>
        <Stack spacing={2}>
          <Typography align="center">{buttonText}</Typography>
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
                      itemPicture,
                      partnerId
                    }
                  : {
                      itemId,
                      itemName,
                      itemDescription,
                      itemPrice,
                      partnerId
                    }
              );
            }}>
            {buttonText}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}

export default EditMenuItem;
