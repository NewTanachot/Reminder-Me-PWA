'use client';

import 'leaflet/dist/leaflet.css'
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

// #region ------------------------- Fix marker bug

let DefaultIcon = L.icon({
    iconUrl: icon.src,
    shadowUrl: iconShadow.src
});

L.Marker.prototype.options.icon = DefaultIcon;

//  #endregion

export default function Map() {
    return (
        <MapContainer className='map' center={[13.7586519635038, 100.540589311115]} zoom={13} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[13.7586519635038, 100.540589311115]}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    )
}
