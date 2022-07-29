import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LandingPageBar from '../landingPage/NavigationBarLandingPage';
import NavigationBar from '../NavigationBarGeneral';

export default function NavBar() {
  const location = useLocation();

  useEffect(() => {
    console.log(location.pathname);
  }, [location]);

  return location.pathname !== '/' ? <NavigationBar /> : <LandingPageBar />;
}
