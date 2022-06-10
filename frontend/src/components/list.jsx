import * as React from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import { FixedSizeList } from 'react-window';
import TripPlanningCard from './card-item';

// This array will be fetched from the backend in future
const destinationList = [
  { title: 'Englisher Garden', image_url: '', type: 'place' },
  { title: 'Englisher Garden', image_url: '', type: 'place' },
  { title: 'Englisher Garden', image_url: '', type: 'place' },
  { title: 'Englisher Garden', image_url: '', type: 'place' },
  { title: 'Englisher Garden', image_url: '', type: 'place' },
  { title: 'Englisher Garden', image_url: '', type: 'place' },
  { title: 'Englisher Garden', image_url: '', type: 'place' },
  { title: 'Englisher Garden', image_url: '', type: 'place' },
  { title: 'Englisher Garden', image_url: '', type: 'place' },
  { title: 'Englisher Garden', image_url: '', type: 'place' },
  { title: 'Englisher Garden', image_url: '', type: 'place' }
];

function renderRow(props) {
  const { index, style } = props;
  const cardItemInfo = destinationList[index];

  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItem>
        <TripPlanningCard title={cardItemInfo.title} type={cardItemInfo.type} />
      </ListItem>
    </ListItem>
  );
}

export default function TripPlanningList() {
  return (
    <Box sx={{ width: '100%', height: 400, maxWidth: 500, bgcolor: 'background.paper' }}>
      <FixedSizeList
        height={600}
        width={500}
        itemSize={150}
        itemCount={destinationList.length}
        overscanCount={5}>
        {renderRow}
      </FixedSizeList>
    </Box>
  );
}
