import React, { useState, useEffect } from 'react';
import PlaceIcon from '@mui/icons-material/Place';
import GoogleMapReact from 'google-map-react';
import Spinner from './common/Spinner';
import { getCityInfoByName } from '../queries/city-info-queries';

const googleMapCredentials = require('../credentials/googlemap_credentials.json');

function GoogleMap({ selectedCity, selectedPartnerLocations }) {
  const [loading, setLoading] = useState(false);
  const [googleLocationInfoList, setGoogleLocationInfoList] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });

  // Listening to the change in selectedCity
  useEffect(() => {
    if (!selectedCity) {
      return;
    }

    setLoading(true);
    getCityInfoByName(selectedCity)
      .then((data) => {
        if (data) {
          setMapCenter({ lat: data.latitude, lng: data.longitude });
        }
      })
      .finally(() => setLoading(false));
  }, [selectedCity]);

  // Listening to the changes in selectedPartnerLocations
  useEffect(() => {
    setGoogleLocationInfoList(
      selectedPartnerLocations.map(({ googleLocationInfo }) => googleLocationInfo)
    );
  }, [selectedPartnerLocations]);

  return (
    <div>
      <div style={{ height: '25vh', width: '100%' }}>
        {loading ? (
          <Spinner marginTop="1em" />
        ) : (
          <GoogleMapReact
            bootstrapURLKeys={{ key: googleMapCredentials.mapApiKey }}
            defaultCenter={mapCenter}
            defaultZoom={11}>
            {googleLocationInfoList.map((googleLocationInfo) => {
              if (googleLocationInfo) {
                return (
                  <PlaceIcon
                    key={googleLocationInfo.googlePlaceId}
                    fontSize="large"
                    sx={{ color: '#f44336' }}
                    lat={googleLocationInfo.latitude}
                    lng={googleLocationInfo.longitude}
                  />
                );
              }

              return [];
            })}
          </GoogleMapReact>
        )}
      </div>
    </div>
  );
}

export default GoogleMap;
