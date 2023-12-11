'use client';

import 'leaflet/dist/leaflet.css'
import L from 'leaflet';
import { IMarker, MapMetaData, MapViewEnum } from '@/model/mapModel';
import { IMapModalProps } from '@/model/propsModel';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import { IBaseLocation } from '@/model/subentityModel';
import { useRef, useState } from 'react';
import PlaceMapPopup from './placeMapPopup';
import UserMapPopup from './userMapPopup';

const placeMarkerIcon = L.icon({
    iconUrl: MapMetaData.normalPlaceIcon,
    iconSize: [18, 29],
});

const placeWithDateMarkerIcon = L.icon({
    iconUrl: MapMetaData.dataPlaceIcon,
    iconSize: [18, 29],
});

const newPlaceMarkerIcon = L.icon({
    iconUrl: MapMetaData.selectPlaceIcon,
    iconSize: [18, 29],
});

export default function MapModal({ 
    placeMarkers, 
    user, 
    newMarkerInitLocation,
    backtoFormPage, 
    mapAsset, 
    addLocationDataToRef,
    userFocusObj,
    isDarkTheme
}: IMapModalProps) {

    const [newMarkerPosition, setNewMarkerPosition] = useState<IBaseLocation | undefined>(newMarkerInitLocation);

    //  set center location
    const centerLocation: IBaseLocation = newMarkerInitLocation ? newMarkerInitLocation : user.userLocation;
    const initialMapView = newMarkerInitLocation ? MapMetaData.getMapView(MapViewEnum.Focus) : MapMetaData.getMapView(MapViewEnum.high);
    const markersRef = useRef<L.Marker<any>>(); // Create a ref for the markers.
    const mapRef = useRef<L.Map>(); // create map ref value

    if (userFocusObj.isfocus) {

        // check if map is higher than Focus mapview 
        if (mapRef.current && mapRef.current.getZoom() < MapMetaData.getMapView(MapViewEnum.Focus)) {

            // set user focus to false
            userFocusObj.setUserFocus(false);
        }

        mapRef.current?.flyTo([user.userLocation.latitude, user.userLocation.longitude]);
    }

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

    const ResetCenterToUserLocation = () => {
        // set user focus to false [ because I set mapview to high ]
        userFocusObj.setUserFocus(false);

        const centerLocation: L.LatLngExpression = [user.userLocation.latitude, user.userLocation.longitude];
        const zoom = MapMetaData.getMapView(MapViewEnum.high);

        // fly to user location and set zoom to high mapview
        mapRef.current?.flyTo(centerLocation, zoom, MapMetaData.getFlyToOption());
    };

    const SetMapView = (mapView: MapViewEnum, markerName?: string) => {

        // set user focus to false [ for prevent focus when flying ]
        userFocusObj.setUserFocus(false);

        // if marker name is null. it will be set to user marker
        if (markerName) {
            // find place by name
            const marker = placeMarkers?.find(e => e.markerName == markerName);

            if (marker) {
                const centerLocation: L.LatLngExpression = [marker.markerLocation.latitude, marker.markerLocation.longitude];
                const zoom = MapMetaData.getMapView(mapView);

                // fly to center marker location
                mapRef.current?.flyTo(centerLocation, zoom, MapMetaData.getFlyToOption());
            }
        }
        else {
            const centerLocation: L.LatLngExpression = [user.userLocation.latitude, user.userLocation.longitude];
            const zoom = MapMetaData.getMapView(mapView);

            // fly to center marker location
            mapRef.current?.flyTo(centerLocation, zoom, MapMetaData.getFlyToOption());

            // set user focus to true with delay [ if user marker selected with FOCUS, ZOOM mapview ] 
            setTimeout(() => userFocusObj.setUserFocus(true), MapMetaData.getUserFocusTimeOutDuration());
        }
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
    let confirmBtnColorTheme: string;
    let resetBtnColorTheme: string;
    let backBtnColorTheme: string;

    if (isDarkTheme) {
        confirmBtnColorTheme = "bg-steelblue";
        resetBtnColorTheme = "bg-steelblue";
        backBtnColorTheme = "text-lightgray";
    }
    else {
        confirmBtnColorTheme = "bg-viridian-green";
        resetBtnColorTheme = "bg-viridian-green";
        backBtnColorTheme = "";
    }

    // set map user marker
    const userMarkerIcon = L.icon({
        iconUrl: mapAsset.mapUserIcon,
        iconSize: [30, 30]
    });
    
    return (
        <div className='w-100 pos'>
            <div className='map-reset-position-btn'>
                <button 
                    className={`btn shadow ${resetBtnColorTheme} text-white`}
                    onClick={ResetCenterToUserLocation}
                >
                    <i className="fa-solid fa-map-location-dot"></i>
                </button>
            </div>

            <MapContainer 
                className='map-asset' 
                center={[centerLocation.latitude, centerLocation.longitude]} 
                zoom={initialMapView} 
                scrollWheelZoom={true}
                zoomControl={false}
                attributionControl={false}
                ref={map => mapRef.current = map ?? undefined}
            >
                <TileLayer
                    attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
                    url={mapAsset.mapTitle}
                    noWrap={true}
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
                        setMapView={SetMapView}
                        isDarkTheme={isDarkTheme}
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
                                    setMapView={SetMapView}
                                    isDarkTheme={isDarkTheme}
                                ></PlaceMapPopup>
                            </Marker>
                        )
                        : <></>
                }
            </MapContainer>
            <div className='d-flex justify-content-around align-items-center mt-3'>
                <button 
                    className={`btn ${backBtnColorTheme} btn-outline-secondary shadow-sm w-38`}
                    onClick={backtoFormPage}
                >
                    Back
                </button>
                <button 
                    className={`btn ${confirmBtnColorTheme} text-white shadow-sm w-38`}
                    onClick={() => addLocationDataToRef(newMarkerPosition)}
                >
                    Confirm
                </button>
            </div>
        </div>
    )
}