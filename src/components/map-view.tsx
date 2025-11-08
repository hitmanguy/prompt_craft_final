'use client';

import React from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';

interface Location {
  lat: number;
  lng: number;
  name?: string;
}

interface MapViewProps {
  location: Location;
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export function MapView({ location }: MapViewProps) {
  if (!API_KEY) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/50 text-center p-4">
        <p className="text-sm text-muted-foreground">Map disabled</p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={API_KEY}>
      <Map
        center={{ lat: location.lat, lng: location.lng }}
        zoom={15}
        mapId="reuniteme-item-map"
        disableDefaultUI={true}
        gestureHandling="none"
      >
        <AdvancedMarker position={{ lat: location.lat, lng: location.lng }} />
      </Map>
    </APIProvider>
  );
}
