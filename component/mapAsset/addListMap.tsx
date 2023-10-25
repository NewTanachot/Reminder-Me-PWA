'use client';

import 'leaflet/dist/leaflet.css'
import L from 'leaflet';
import { IMarker } from '@/model/mapModel';
import { IAddListMapProps } from '@/model/propsModel';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import placeIcon from 'leaflet/dist/images/marker-icon.png';
import newPlaceIcon from 'leaflet/dist/images/marker-icon.png';
import userIcon from '@/public/image/map-icon/user-icon.png';
import { IBaseLocation } from '@/model/subentityModel';
import { useState } from 'react';

const userMarkerIcon = L.icon({
    iconUrl: userIcon.src,
    iconSize: [30, 30]
});

const placeMarkerIcon = L.icon({
    iconUrl: placeIcon.src,
    iconSize: [18, 29],
});

const newPlaceMarkerIcon = L.icon({
    iconUrl: newPlaceIcon.src,
    iconSize: [18, 29],
});

export default function AddListMap({ placeMarkers, user, mapTheme, isDarkTheme }: IAddListMapProps) {

    const [newMarkerPosition, setNewMarkerPosition] = useState<IBaseLocation>();

    const NewMarker = () => {

        useMapEvents({
            click(event) {                                
                setNewMarkerPosition({
                    latitude: event.latlng.lat,
                    longitude: event.latlng.lng
                });               
            },            
        })

        return (
            newMarkerPosition
            ? <Marker
                position={[newMarkerPosition.latitude, newMarkerPosition.longitude]}
                icon={newPlaceMarkerIcon}
            ></Marker>
            : <></>
        )   
        
    }

    const userMarker: IMarker = {
        markerName: user.userName,
        markerLocation: {
            latitude: user.userLocation.latitude,
            longitude: user.userLocation.longitude
        }
    }

    return (
        <>
            <MapContainer 
                className='map-asset' 
                center={[user.userLocation.latitude, user.userLocation.longitude]} 
                zoom={11} 
                scrollWheelZoom={true}
                attributionControl={false}
            >
                <TileLayer
                    url={mapTheme}
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

                <NewMarker></NewMarker>

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
            <div className='d-flex justify-content-around align-items-center mt-3'>
                <button className='btn btn-primary w-38'>Cancel</button>
                <button className='btn btn-primary w-38'>Confirm</button>
            </div>
        </>
    )
}