import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
export default function DestinationMap({ destination: d }) {
  return (
    <div className="destination-map">
      <MapContainer
        center={d.coords}
        zoom={9}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        aria-label={`Map of ${d.name}`}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CircleMarker
          center={d.coords}
          radius={12}
          pathOptions={{
            color: "#123c48",
            fillColor: "#18a999",
            fillOpacity: 0.8,
          }}
        >
          <Popup>
            {d.name}, {d.country}
          </Popup>
        </CircleMarker>
      </MapContainer>
      <a
        className="map-external"
        href={`https://www.openstreetmap.org/?mlat=${d.coords[0]}&mlon=${d.coords[1]}#map=10/${d.coords[0]}/${d.coords[1]}`}
        target="_blank"
        rel="noreferrer"
      >
        Open larger map ↗
      </a>
    </div>
  );
}
