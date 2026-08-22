import React from 'react';
import TripListing from './TripListing';

// Re-export TripListing to ensure both <MyTrips /> and <TripListing /> render the full Pistachio & Cream UI
export default function MyTrips() {
  return <TripListing />;
}
