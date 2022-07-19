import React from 'react';
import { useParams } from 'react-router-dom';

function EditMenuItemPage() {
  // const navigate = useNavigate();
  const { partnerId, menuId } = useParams();

  // const handleEditClick = () => {
  //   navigate(`/edit-partner-profile/${restaurantId}/${menuId}`);
  // };
  return (
    <div>
      <div>{partnerId}</div>
      <div>{menuId}</div>
    </div>
  );
}

export default EditMenuItemPage;
