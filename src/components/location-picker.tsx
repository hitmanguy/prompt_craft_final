'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap, useAdvancedMarker } from '@vis.gl/react-google-maps';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MapPin, Search } from 'lucide-react';

interface Location {
  lat: number;
  lng: number;
  name: string;
}

interface LocationPickerProps {
  value?: Location;
  onChange: (location: Location) => void;
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const DEFAULT_CENTER = { lat: 40.7128, lng: -74.0060 }; // New York City

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  if (!API_KEY) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-muted/50 text-center p-4">
        <p className="font-semibold text-destructive">Google Maps API Key is missing.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Please add your Google Maps API key to the .env file to enable location features.
        </p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={API_KEY}>
      <div className="space-y-4">
        <Map
          defaultCenter={value ? { lat: value.lat, lng: value.lng } : DEFAULT_CENTER}
          defaultZoom={value ? 15 : 10}
          mapId="reuniteme-map"
          className="h-64 w-full rounded-lg"
          gestureHandling="greedy"
          onClick={(e) => {
            if (e.detail.latLng) {
                const { lat, lng } = e.detail.latLng;
                onChange({ lat, lng, name: value?.name || `Custom location at ${lat.toFixed(4)}, ${lng.toFixed(4)}` });
            }
          }}
        >
          {value && <AdvancedMarker position={{ lat: value.lat, lng: value.lng }} />}
        </Map>
        <LocationSearch value={value} onChange={onChange} />
      </div>
    </APIProvider>
  );
}


function LocationSearch({ value, onChange }: LocationPickerProps) {
  const [inputValue, setInputValue] = useState(value?.name || '');
  const map = useMap();
  
  useEffect(() => {
    setInputValue(value?.name || '');
  }, [value?.name]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;

    const geocoder = new (window as any).google.maps.Geocoder();
    geocoder.geocode({ address: inputValue }, (results: any[], status: string) => {
      if (status === 'OK' && results[0]) {
        const { geometry } = results[0];
        const lat = geometry.location.lat();
        const lng = geometry.location.lng();
        const name = results[0].formatted_address;
        
        onChange({ lat, lng, name });
        if (map) {
          map.panTo({ lat, lng });
          map.setZoom(15);
        }
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  };

  const handleManualEntry = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setInputValue(newName);
    if (value) {
        onChange({ ...value, name: newName });
    }
  }

  return (
    <div className="space-y-2">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            value={inputValue}
            onChange={handleManualEntry}
            placeholder="Search for a location or drop a pin on the map"
            className="pl-10"
          />
        </div>
        <Button type="submit" variant="outline">Search</Button>
      </form>
       {value && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 rounded-md bg-muted/50">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{value.name}</span>
          </div>
        )}
    </div>
  );
}
