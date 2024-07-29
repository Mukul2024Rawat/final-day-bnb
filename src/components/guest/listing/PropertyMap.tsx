"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

const customIcon = new Icon({
  iconUrl: "/marker.png",
  iconSize: [32, 32],
});

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  title: string;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ latitude, longitude, title }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Where you&apos;ll be</h2> {/* Escaped apostrophe */}
      <div className="rounded-lg overflow-hidden border border-gray-300">
        <MapContainer center={[latitude, longitude]} zoom={13} style={{ height: "400px", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[latitude, longitude]} icon={customIcon}>
            <Popup>{title}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default PropertyMap;
