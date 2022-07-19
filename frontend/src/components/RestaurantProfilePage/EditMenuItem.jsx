import React from 'react';
import { useParams } from 'react-router-dom';

function EditMenuItem(props) {
  // const navigate = useNavigate();
  const { menuId } = props;
  const { partnerId } = useParams();

  // const handleEditClick = () => {
  //   navigate(`/edit-partner-profile/${restaurantId}/${menuId}`);
  // };
  return (
    <div>
      <div>Hey</div>
      <div>{partnerId}</div>
      <div>{menuId}</div>
      <div>Naber</div>
    </div>
  );
}

export default EditMenuItem;
