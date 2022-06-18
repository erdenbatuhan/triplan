import React from 'react';
import TripCard from '../components/TripCard';
import ProfileInfoCard from '../components/ProfileInfoCard';

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

const mockProfileInfoCardData = [
  {
    id: '0',
    title: 'Trips',
    value: '3',
    href: '/'
  },
  {
    id: '1',
    title: 'Followers',
    value: '10',
    href: '/'
  },
  {
    id: '2',
    title: 'Following',
    value: '17',
    href: '/'
  }
];

function UserProfilePage() {
  // const [userData, setUserData] = useState([]);

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
          {mockProfileInfoCardData.map((infoData) => {
            return (
              <ProfileInfoCard
                key={infoData.id}
                title={infoData.title}
                value={infoData.value}
                href={infoData.href}
              />
            );
          })}
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
