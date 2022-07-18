import React from 'react';
import { Paper, List } from '@mui/material';
import MenuCard from './RestaurantProfilePage/MenuCard';

function EditRestaurantMenuItems(props) {
  const { restaurantMenuList, updateMenuList } = props;
  return (
    <Paper style={{ maxHeight: 500, overflow: 'auto' }}>
      <List spacing={2} overflow="auto">
        {restaurantMenuList.map((menu, idx) => {
          return (
            <MenuCard
              // eslint-disable-next-line react/no-array-index-key
              key={menu.name + idx}
              name={menu.name}
              content={menu.content}
              price={menu.price}
              imgUrl={menu.img_url}
              updateMenuList={updateMenuList}
              inEdit
            />
          );
        })}
      </List>
    </Paper>
  );
}

export default EditRestaurantMenuItems;
