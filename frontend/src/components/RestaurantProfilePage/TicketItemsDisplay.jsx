import React from 'react';
import { Paper, List } from '@mui/material';
import TicketCard from './TicketCard';

function TicketItemDisplay(props) {
  const { ticketList, inEdit } = props;
  return (
    <Paper style={{ maxHeight: 500, overflow: 'auto' }}>
      <List spacing={2} overflow="auto">
        {ticketList.map((ticket) => {
          return (
            <TicketCard
              key={ticket._id}
              ticketId={ticket._id}
              name={ticket.name}
              content={ticket.description}
              price={ticket.price.toString()}
              inEdit={inEdit}
            />
          );
        })}
      </List>
    </Paper>
  );
}

export default TicketItemDisplay;
