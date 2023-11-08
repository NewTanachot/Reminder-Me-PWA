'use client';

import 'leaflet/dist/leaflet.css'
import L from 'leaflet';
import { IMarker, MapMetaData } from '@/model/mapModel';
import { IMapModalProps } from '@/model/propsModel';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import placeIcon from 'leaflet/dist/images/marker-icon.png';
import placeWithDateIcon from '@/public/image/map-icon/marker-icon-orange.png';
import newPlaceIcon from '@/public/image/map-icon/marker-icon-red.png';
import { IBaseLocation } from '@/model/subentityModel';
import { useRef, useState } from 'react';
import PlaceMapPopup from './placeMapPopup';
import UserMapPopup from './userMapPopup';

const placeMarkerIcon = L.icon({
    iconUrl: placeIcon.src,
    iconSize: [18, 29],
});

const placeWithDateMarkerIcon = L.icon({
    iconUrl: placeWithDateIcon.src,
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
    const markersRef = useRef<L.Marker<any>>(); // Create a ref for the markers.
    const mapRef = useRef<L.Map>(); // create map ref value

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

    const ZoomMarkerHandler = (markerName: string, isZoomIn?: boolean) => {

        // find place by name
        const marker = placeMarkers?.find(e => e.markerName == markerName);

        if (marker) {
            const centerLocation: L.LatLngExpression = [marker.markerLocation.latitude, marker.markerLocation.longitude];
            const zoom = isZoomIn ? MapMetaData.getMapZoom(true) : MapMetaData.getMapZoom(false);

            // fly to center marker location
            mapRef.current?.flyTo(centerLocation, zoom);
        }
    };

    const ZoomUserMarkerHandler = (isZoomIn?: boolean) => {
        
        const centerLocation: L.LatLngExpression = [user.userLocation.latitude, user.userLocation.longitude];
        const zoom = isZoomIn ? MapMetaData.getMapZoom(true) : MapMetaData.getMapZoom(false);

        // fly to center marker location
        mapRef.current?.flyTo(centerLocation, zoom);
    };

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
                zoom={MapMetaData.getMapZoom()} 
                scrollWheelZoom={true}
                attributionControl={false}
                ref={map => mapRef.current = map ?? undefined}
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
                    <UserMapPopup
                        userName={user.userName}
                        markNewLocationAtUser={MarkNewLocationAtUser}
                        zoomUserMarkerHandler={ZoomUserMarkerHandler}
                    ></UserMapPopup>
                </Marker>

                <NewMarker></NewMarker>

                {
                    placeMarkers 
                        ? placeMarkers.map((marker, index) => 
                            <Marker 
                                key={index}
                                position={[marker.markerLocation.latitude, marker.markerLocation.longitude]}
                                icon={marker.markerDate ? placeWithDateMarkerIcon : placeMarkerIcon}
                            >
                                <PlaceMapPopup
                                    name={marker.markerName}
                                    message={marker.markerMessage}
                                    date={marker.markerDate}
                                    zoomHandler={ZoomMarkerHandler}
                                ></PlaceMapPopup>
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