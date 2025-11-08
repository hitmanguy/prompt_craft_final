'use client';

import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import type { Item } from '@/lib/types';
import { Button } from './ui/button';
import Link from 'next/link';

interface ItemMapViewProps {
  items: Item[];
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const MAP_ID = 'reuniteme-all-items-map';

export function ItemMapView({ items }: ItemMapViewProps) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  if (!API_KEY) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/50 text-center p-4">
        <p className="font-semibold text-destructive">Google Maps API Key is missing.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Please add your Google Maps API key to the .env file to enable location features.
        </p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={API_KEY}>
      <Map
        defaultCenter={{ lat: 40.7128, lng: -74.006 }}
        defaultZoom={11}
        mapId={MAP_ID}
        gestureHandling="greedy"
      >
        {items.map((item) => (
          <AdvancedMarker
            key={item.id}
            position={{ lat: item.location.lat, lng: item.location.lng }}
            onClick={() => setSelectedItem(item)}
          >
            <Pin
              background={item.status === 'lost' ? '#ef4444' : '#22c55e'}
              borderColor={item.status === 'lost' ? '#b91c1c' : '#15803d'}
              glyphColor="#fff"
            />
          </AdvancedMarker>
        ))}

        {selectedItem && (
          <InfoWindow
            position={{ lat: selectedItem.location.lat, lng: selectedItem.location.lng }}
            onCloseClick={() => setSelectedItem(null)}
          >
            <div className="p-2 max-w-xs">
              <h3 className="font-bold text-lg mb-1">{selectedItem.name}</h3>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{selectedItem.description}</p>
              <Button asChild size="sm">
                <Link href={`/items/${selectedItem.id}`}>View Details</Link>
              </Button>
            </div>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
}
