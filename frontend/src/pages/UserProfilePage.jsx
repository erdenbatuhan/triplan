import React from 'react';
import TripCard from '../components/TripCard';

const mockTripCardData = [
  {
    id: '0',
    tripName: 'Munich',
    isRated: true,
    href: '/'
  },
  {
    id: '1',
    tripName: 'Berlin',
    isRated: false,
    href: '/'
  }
];

function UserProfilePage() {
  // const [userData, setUserData] = useState([]);
  console.log('mockTripCardData: ', mockTripCardData);
  console.log('mockTripCardData[0]: ', mockTripCardData[0]);

  return (
    <div>
      <div>
        <div>img</div>
        <div>
          <div>Jane Doe</div>
          <div>Berlin</div>
        </div>
      </div>
      <div>
        <div>
          <div>Trips</div>
          <div>Followers</div>
          <div>Following</div>
        </div>
        <div>
          {mockTripCardData.map((tripData) => {
            return (
              <TripCard
                key={tripData.id}
                tripName={tripData.tripName}
                isRated={tripData.isRated}
                href={tripData.href}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
