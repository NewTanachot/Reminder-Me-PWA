'use client';

import 'leaflet/dist/leaflet.css'
import L, { map } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { IMapProps } from '@/model/propsModel';
import { IMarker, MapStyleTitle } from '@/model/mapModel';
import placeIcon from 'leaflet/dist/images/marker-icon.png';
import userIcon from '@/public/image/map-icon/user-red-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const userMarkerIcon = L.icon({
    iconUrl: userIcon.src,
    iconSize: [30, 30],
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
            markerDate: place.reminderDate ?? undefined,
            markerLocation: {
                latitude: place.latitude as number,
                longitude: place.longitude as number
            }
        }));

    console.log(placeMarkers)

    return (
        <MapContainer 
            className='map' 
            // center={[13.758442667913602, 100.60116846647361]} 
            center={[user.userLocation.latitude, user.userLocation.longitude]} 
            zoom={11} 
            scrollWheelZoom={true}
            attributionControl={false}
        >
            <TileLayer
                url={MapStyleTitle.street}
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
                    ? placeMarkers.map((marker, index) => 
                        <Marker 
                            key={index}
                            position={[marker.markerLocation.latitude, marker.markerLocation.longitude]}
                            icon={placeMarkerIcon}
                        >
                            <Popup>
                                <span className='text-cobalt-blue text-cursive'>
                                    {marker.markerName} 
                                    {
                                        marker.markerDate
                                            ? <span className='text-danger'>
                                                <br /> {marker.markerDate}
                                            </span>
                                            : <></>
                                    } 
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