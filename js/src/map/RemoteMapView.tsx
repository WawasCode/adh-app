import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const CENTER: [number, number] = [52.52, 13.405] // Berlin
const ZOOM = 10
const MAX_ZOOM = 19

const BOUNDS: [[number, number], [number, number]] = [
  [47.26543, 5.864417],
  [55.14777, 15.05078],
]

/*
* MapView component renders a Leaflet map using remote raster tiles.
* The tiles are served from OpenStreetMap.
*/
export function RemoteMapView() {
  return (
    <div className="map-container">
      <MapContainer
        style={{ height: '100%', width: '100%' }}
        center={CENTER}
        zoom={ZOOM}
        maxZoom={MAX_ZOOM}
        maxBounds={BOUNDS}
        maxBoundsViscosity={1}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
          maxZoom={MAX_ZOOM}
        />
      </MapContainer>
    </div>
  )
}
