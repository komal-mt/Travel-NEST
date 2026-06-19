import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

export default function TourMap({ lat, lng, title }) {
  return (
    <div className="rounded-3xl overflow-hidden h-[400px] w-full">
      <MapContainer
        center={[lat, lng]}
        zoom={10}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[lat, lng]}>
          <Popup>
            📍 {title}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}