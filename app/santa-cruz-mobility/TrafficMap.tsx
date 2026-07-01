'use client';

import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

interface MapPoint {
  lat: number;
  lng: number;
  location: string;
  bikes: number;
  peds: number;
  total: number;
  date: string;
}

interface BikePathFeature {
  geometry: { coordinates: number[][] };
  properties: { name: string; type: string; surface: string };
}

interface BCycleStation {
  name: string;
  lat: number;
  lon: number;
  station_id: string;
  capacity: number;
}

function getColor(bikes: number, peds: number): string {
  const ratio = bikes / (bikes + peds || 1);
  if (ratio > 0.5) return '#22c55e';
  if (ratio > 0.3) return '#3b82f6';
  return '#6366f1';
}

function getRadius(bikes: number, peds: number): number {
  const total = bikes + peds;
  if (total > 500) return 14;
  if (total > 200) return 10;
  if (total > 50) return 7;
  return 5;
}

const bikeIcon = new L.DivIcon({
  html: '<div style="background:#22c55e;width:10px;height:10px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 4px rgba(0,0,0,0.5)"></div>',
  className: '',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

export default function TrafficMap({ points }: { points: MapPoint[] }) {
  const center: [number, number] = [36.97, -122.03];
  const [bikePaths, setBikePaths] = useState<BikePathFeature[]>([]);
  const [stations, setStations] = useState<BCycleStation[]>([]);
  const [showPaths, setShowPaths] = useState(true);
  const [showStations, setShowStations] = useState(true);

  useEffect(() => {
    fetch('/data/bike-infrastructure.geojson')
      .then(r => r.json())
      .then(d => setBikePaths(d.features || []))
      .catch(() => {});
    fetch('/data/bcycle-stations.json')
      .then(r => r.json())
      .then(d => {
        const s = (d.data?.stations || d.stations || d || []) as BCycleStation[];
        setStations(s.filter((st: BCycleStation) => st.lat && st.lon));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="relative h-full">
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-1">
        <button
          onClick={() => setShowPaths(!showPaths)}
          className={`px-2 py-1 text-xs rounded ${showPaths ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-400'}`}
        >
          Bike Infra ({bikePaths.length})
        </button>
        <button
          onClick={() => setShowStations(!showStations)}
          className={`px-2 py-1 text-xs rounded ${showStations ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-400'}`}
        >
          BCycle ({stations.length})
        </button>
      </div>
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: '100%', width: '100%', background: '#111827' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {showPaths && bikePaths.map((path, i) => {
          const positions = path.geometry.coordinates.map(c => [c[1], c[0]] as [number, number]);
          const color = path.properties.type === 'cycleway' ? '#06b6d4' : '#0ea5e9';
          return (
            <Polyline
              key={`path-${i}`}
              positions={positions}
              color={color}
              weight={2}
              opacity={0.5}
            />
          );
        })}
        {showStations && stations.map((st, i) => (
          <Marker key={`station-${i}`} position={[st.lat, st.lon]} icon={bikeIcon}>
            <Popup>
              <div style={{ color: '#000', fontSize: '12px' }}>
                <strong>{st.name}</strong><br />
                Capacity: {st.capacity} docks
              </div>
            </Popup>
          </Marker>
        ))}
        {points.map((pt, i) => (
          <CircleMarker
            key={i}
            center={[pt.lat, pt.lng]}
            radius={getRadius(pt.bikes, pt.peds)}
            fillColor={getColor(pt.bikes, pt.peds)}
            color={getColor(pt.bikes, pt.peds)}
            weight={1}
            opacity={0.8}
            fillOpacity={0.6}
          >
            <Popup>
              <div className="text-sm" style={{ color: '#000' }}>
                <strong>{pt.location}</strong><br />
                Bikes: {pt.bikes}<br />
                Peds: {pt.peds}<br />
                {pt.date}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
