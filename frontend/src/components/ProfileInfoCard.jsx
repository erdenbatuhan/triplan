import { useNavigate } from 'react-router-dom';
import { Card } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

function ProfileInfoCard(props) {
  const { title, value, href } = props;
  const navigate = useNavigate();

  const cardClickHandler = () => {
    navigate(href);
  };

  return (
    <Card onClick={cardClickHandler}>
      <div>
        <div>{title}</div>
        <div>{value}</div>
      </div>
    </Card>
  );
}

ProfileInfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired
};

// ProfileInfoCard.defaultProps = {
// };

export default ProfileInfoCard;
