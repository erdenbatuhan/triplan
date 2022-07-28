import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Stack,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import Spinner from '../common/Spinner';
import { PARTNER_TYPE_RESTAURANT } from '../../shared/constants';
import ImageUpload from '../common/ImageUpload';
import * as constants from '../../shared/constants';

function EditItemModal(props) {
  const { item, locationType, handleItemChangeCompletionClick, itemInAdd, lazyLoading } = props;
  const { partnerId } = useParams();

  // const { name, description, price, type, image } = item; // reservationDate
  const [_id, setItemId] = useState('');

  const [name, setItemName] = useState('');
  const [description, setItemDescription] = useState('');
  const [price, setItemPrice] = useState('');

  // const [itemReservationDate, setItemReservationDate] = useState(reservationDate);

  const [foodType, setItemFoodType] = useState('');
  const [image, setItemImage] = useState('');

  const buttonItemNameText = locationType === PARTNER_TYPE_RESTAURANT ? 'Menu' : 'Ticket';
  const buttonText = itemInAdd
    ? `Create New ${buttonItemNameText}`
    : `Save ${buttonItemNameText} changes`;
  const nameLabel = locationType === PARTNER_TYPE_RESTAURANT ? 'Menu Name' : 'Ticket Name';
  const descriptionLabel =
    locationType === PARTNER_TYPE_RESTAURANT ? 'Menu Description' : 'Ticket Description';
  const priceLabel =
    locationType === PARTNER_TYPE_RESTAURANT ? 'Menu Price in € ' : 'Ticket Price in €';

  // const menuType = 'Event Date';

  const menuTypeLabel = 'Menu Food Type';
  // const pictureLabel = locationType === PARTNER_TYPE_RESTAURANT ? 'Menu Picture' : 'Ticket Picture';

  useEffect(() => {
    setItemId(!itemInAdd ? item._id : '');
    setItemName(!itemInAdd ? item.name : '');
    setItemDescription(!itemInAdd ? item.description : '');
    setItemPrice(!itemInAdd ? item.price : '');
    setItemImage(!itemInAdd ? item.image : '');
    if (locationType === PARTNER_TYPE_RESTAURANT) {
      setItemFoodType(!itemInAdd ? item.foodType : '');
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
  const onItemImageChange = (imageUpdated) => {
    setItemImage(imageUpdated);
  };

  const getChangedItemObject = () => {
    let itemObject =
      locationType === PARTNER_TYPE_RESTAURANT
        ? {
            name,
            description,
            price,
            foodType,
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
    itemObject = !itemInAdd ? { ...itemObject, _id } : itemObject;
    return itemObject;
  };

  return (
    <Box sx={{ width: 400 }}>
      {lazyLoading ? (
        <Spinner marginTop="1em" />
      ) : (
        <Stack spacing={2}>
          <ImageUpload objectId={item._id} image={image} onSaveSuccess={onItemImageChange} />

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

          {locationType === PARTNER_TYPE_RESTAURANT ? (
            <FormControl>
              <InputLabel id="outlined">Food Type</InputLabel>
              <Select
                labelId="outlined"
                id="outlined-required"
                value={foodType}
                label={menuTypeLabel}
                onChange={(e) => onItemFoodTypeChange(e)}>
                {constants.foodTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            []
          )}

          {/* locationType === PARTNER_TYPE_RESTAURANT ? (
          <TextField
            required
            id="outlined-required"
            label={menuTypeLabel}
            value={foodType}
            onChange={(e) => onItemFoodTypeChange(e)}
          />
        ) : (
          // <TextField
          //   required
          //   id="outlined-required"
          //   label={pictureLabel}
          //   value={itemReservationDate}
          //   onChange={(e) => onItemReservationDateChange(e)}
          //
          // eslint-disable-next-line react/jsx-no-useless-fragment
         
        ) */}
          <Button
            onClick={(e) => {
              handleItemChangeCompletionClick(e, getChangedItemObject());
            }}>
            {buttonText}
          </Button>
        </Stack>
      )}
    </Box>
  );
}

export default EditItemModal;
