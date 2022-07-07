/* eslint-disable react/prop-types */
import React from 'react';
import { Map } from 'google-maps-react';

const mapStyles = {
  width: '100%',
  height: '100%'
};

export default function GoogleMaps() {
  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627
    },
    zoom: 11
  };

  return (
    <Map
      google={this.props.google}
      zoom={14}
      style={mapStyles}
      initialCenter={{
        lat: -1.2884,
        lng: 36.8233
      }}
    />
  );
}
