'use client';

import 'leaflet/dist/leaflet.css'
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { IMapProps } from '@/model/propsModel';
import { IMarker } from '@/model/mapModel';
import placeIcon from 'leaflet/dist/images/marker-icon.png';
import UserMapPopup from '../mapAsset/userMapPopup';
import PlaceMapPopup from '../mapAsset/placeMapPopup';

export default function Map({ placeMarkers, user, mapAsset }: IMapProps) {

    const userMarker: IMarker = {
        markerName: user.userName,
        markerLocation: {
            latitude: user.userLocation.latitude,
            longitude: user.userLocation.longitude
        }
    }

    // set user icon
    const userMarkerIcon = L.icon({
        iconUrl: mapAsset.mapUserIcon,
        iconSize: [30, 30],
    });
    
    // set map icon
    const placeMarkerIcon = L.icon({
        iconUrl: placeIcon.src,
        iconSize: [18, 29],
    });

    return (
        <MapContainer 
            className='map shadow-sm rounded-3' 
            center={[user.userLocation.latitude, user.userLocation.longitude]} 
            zoom={11} 
            scrollWheelZoom={true}
            attributionControl={false}
        >
            <TileLayer
                attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
                url={mapAsset.mapTitle}
            />
            <Marker 
                position={[userMarker.markerLocation.latitude, userMarker.markerLocation.longitude]}
                icon={userMarkerIcon}
            >
                <UserMapPopup
                    userName={userMarker.markerName}
                ></UserMapPopup>
            </Marker>
            {
                placeMarkers 
                    ? placeMarkers.map((marker, index) => 
                        <Marker 
                            key={index}
                            position={[marker.markerLocation.latitude, marker.markerLocation.longitude]}
                            icon={placeMarkerIcon}
                        >
                            <PlaceMapPopup
                                name={marker.markerName}
                                message={marker.markerMessage}
                                date={marker.markerDate}
                            ></PlaceMapPopup>
                        </Marker>
                    )
                    : <></>
            }
        </MapContainer>
    )
}