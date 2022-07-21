import React from 'react';
import { Paper, List } from '@mui/material';
import BuyableItemCard from './BuyableItemCard';

function ItemListDisplay(props) {
  const { itemList, inEdit } = props;
  return (
    <Paper style={{ maxHeight: 500, overflow: 'auto' }}>
      <List spacing={2} overflow="auto">
        {itemList.map((item) => {
          return (
            <BuyableItemCard
              key={item._id}
              menuId={item._id}
              name={item.name}
              content={item.description}
              price={item.price.toString()}
              image={item.image}
              inEdit={inEdit}
            />
          );
        })}
      </List>
    </Paper>
  );
}

export default ItemListDisplay;
