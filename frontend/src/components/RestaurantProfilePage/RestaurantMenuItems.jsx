import React from 'react';
import { Paper, List } from '@mui/material';
import MenuCard from './MenuCard';

function RestaurantMenuItems(props) {
  const { restaurantMenuList, inEdit } = props;
  return (
    <Paper style={{ maxHeight: 500, overflow: 'auto' }}>
      <List spacing={2} overflow="auto">
        {restaurantMenuList.map((menu) => {
          return (
            <MenuCard
              key={menu._id}
              menuId={menu._id}
              name={menu.name}
              content={menu.description}
              price={menu.price.toString()}
              image={menu.image}
              inEdit={inEdit}
            />
          );
        })}
      </List>
    </Paper>
  );
}

export default RestaurantMenuItems;
