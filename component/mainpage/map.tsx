'use client';

import 'leaflet/dist/leaflet.css'
import L, { map } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { IMapProps } from '@/model/propsModel';
import { IMarker } from '@/model/mapModel';
import placeIcon from 'leaflet/dist/images/marker-icon.png';
import userIcon from '@/public/image/Simpleicons_Places_map-marker-with-a-person-shape.svg.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const userMarkerIcon = L.icon({
    iconUrl: userIcon.src,
    iconSize: [22, 25],
    // shadowUrl: iconShadow.src
});

const placeMarkerIcon = L.icon({
    iconUrl: placeIcon.src,
    iconSize: [18, 29],
    // shadowUrl: iconShadow.src
});

export default function Map({ places, user, mapTheme, isDarkTheme }: IMapProps) {

    const userMarker: IMarker = {
        markerName: user.userName,
        markerLocation: {
            latitude: user.userLocation.latitude,
            longitude: user.userLocation.longitude
        }
    }

    const placeMarkers: IMarker[] | undefined = places?.filter(place => place.latitude && place.longitude && !place.isDisable)
        .map(place => ({
            markerName: place.name,
            markerMessage: place.reminderMessage ?? undefined,
            markerLocation: {
                latitude: place.latitude as number,
                longitude: place.longitude as number
            }
        }));

    return (
        <MapContainer 
            className='map' 
            center={[13.758442667913602, 100.60116846647361]} 
            zoom={11} 
            scrollWheelZoom={true}
            attributionControl={false}
        >
            <TileLayer
                url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png'
            />
            <Marker 
                position={[userMarker.markerLocation.latitude, userMarker.markerLocation.longitude]}
                icon={userMarkerIcon}
            >
                <Popup>
                    <span className='text-cobalt-blue text-cursive'>
                        {userMarker.markerName} is here! 
                    </span>
                </Popup>
            </Marker>
            {
                placeMarkers 
                    ? placeMarkers.map(marker => 
                        <Marker 
                            position={[marker.markerLocation.latitude, marker.markerLocation.longitude]}
                            icon={placeMarkerIcon}
                        >
                            <Popup>
                                <span className='text-cobalt-blue text-cursive'>
                                    {marker.markerName} 
                                    {
                                        marker.markerMessage
                                            ? <span className='text-secondary'>
                                                <br /> {marker.markerMessage}
                                            </span>
                                            : <></>
                                    }
                                </span>
                            </Popup>
                        </Marker>
                    )
                    : <></>
            }
        </MapContainer>
    )
}

// map 

// https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
// https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png