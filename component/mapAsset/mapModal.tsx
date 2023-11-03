'use client';

import 'leaflet/dist/leaflet.css'
import L from 'leaflet';
import { IMarker } from '@/model/mapModel';
import { IMapModalProps } from '@/model/propsModel';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import placeIcon from 'leaflet/dist/images/marker-icon.png';
import newPlaceIcon from 'leaflet/dist/images/marker-icon.png';
import { IBaseLocation } from '@/model/subentityModel';
import { useRef, useState } from 'react';

const placeMarkerIcon = L.icon({
    iconUrl: placeIcon.src,
    iconSize: [18, 29],
});

const newPlaceMarkerIcon = L.icon({
    iconUrl: newPlaceIcon.src,
    iconSize: [18, 29],
});

export default function MapModal({ 
    placeMarkers, 
    user, 
    newMarkerInitLocation,
    backtoFormPage, 
    mapAsset, 
    addLocationDataToRef,
    isDarkTheme
}: IMapModalProps) {

    const [newMarkerPosition, setNewMarkerPosition] = useState<IBaseLocation | undefined>(newMarkerInitLocation);

    //  set center location
    const centerLocation: IBaseLocation = newMarkerInitLocation ? newMarkerInitLocation : user.userLocation;
     // Create a ref for the markers.
    const markersRef = useRef<L.Marker<any>>();

    // create new marker component
    const NewMarker = () => {

        const map = useMapEvents({
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

    // click here handler
    const MarkNewLocationAtUser = () => {

        // close marker popup
        markersRef.current?.closePopup();

        // set location value
        setNewMarkerPosition({
            latitude: user.userLocation.latitude,
            longitude: user.userLocation.longitude
        });
    }

    // create user marker model
    const userMarker: IMarker = {
        markerName: user.userName,
        markerLocation: {
            latitude: user.userLocation.latitude,
            longitude: user.userLocation.longitude
        }
    }

    // check theme color
    let confirmBtnClass: string;
    let cancleBtnClass: string;

    if (isDarkTheme) {
        confirmBtnClass = "bg-mainblue";
        cancleBtnClass = "bg-mainblack";
    }
    else {
        confirmBtnClass = "bg-viridian-green";
        cancleBtnClass = "btn-secondary";
    }

    // set map user marker
    const userMarkerIcon = L.icon({
        iconUrl: mapAsset.mapUserIcon,
        iconSize: [30, 30]
    });
    

    return (
        <>
            <MapContainer 
                className='map-asset shadow-sm rounded-3' 
                center={[centerLocation.latitude, centerLocation.longitude]} 
                zoom={11} 
                scrollWheelZoom={true}
                attributionControl={false}
            >
                <TileLayer
                    url={mapAsset.mapTitle}
                />

                <Marker 
                    position={[userMarker.markerLocation.latitude, userMarker.markerLocation.longitude]}
                    icon={userMarkerIcon}
                    // Add the marker to the ref - [ you can ref component in useRef like this ]
                    ref={(marker) => markersRef.current = marker ?? undefined}
                >
                    <Popup>
                        <span className='text-cobalt-blue text-cursive'>
                            {userMarker.markerName} is here! 
                            <br />
                            <span className='text-secondary'>
                                click&nbsp;
                                <span 
                                    className='text-decoration-underline text-danger'
                                    onClick={MarkNewLocationAtUser}
                                >
                                    here
                                </span> 
                                &nbsp;to mark at this location
                            </span>
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
                <button 
                    className={`btn ${cancleBtnClass} text-white w-38`}
                    onClick={backtoFormPage}
                >
                    Cancel
                </button>
                <button 
                    className={`btn ${confirmBtnClass} text-white w-38`}
                    onClick={() => addLocationDataToRef(newMarkerPosition)}
                >
                    Confirm
                </button>
            </div>
        </>
    )
}