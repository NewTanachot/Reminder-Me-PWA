'use client';

import 'leaflet/dist/leaflet.css'
import L from 'leaflet';
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import { IMapProps } from '@/model/propsModel';
import { IMarker, MapMetaData, MapViewEnum } from '@/model/mapModel';
import UserMapPopup from '../mapAsset/userMapPopup';
import PlaceMapPopup from '../mapAsset/placeMapPopup';
import { useRef } from 'react';

// set mormal map icon
const placeMarkerIcon = L.icon({
    iconUrl: MapMetaData.normalPlaceIcon,
    iconSize: [18, 29],
});

const placeWithDateMarkerIcon = L.icon({
    iconUrl: MapMetaData.dataPlaceIcon,
    iconSize: [18, 29],
});

export default function Map({ placeMarkers, user, mapAsset, userFocusObj, isDarkTheme }: IMapProps) {

    // create map ref value
    const mapRef = useRef<L.Map>();

    if (userFocusObj.isfocus) {
        mapRef.current?.flyTo([user.userLocation.latitude, user.userLocation.longitude]);
    }

    const userMarker: IMarker = {
        markerName: user.userName,
        markerLocation: {
            latitude: user.userLocation.latitude,
            longitude: user.userLocation.longitude
        }
    };

    // set user icon
    const userMarkerIcon = L.icon({
        iconUrl: mapAsset.mapUserIcon,
        iconSize: [30, 30],
    });

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
                mapRef.current?.flyTo(centerLocation, zoom);
            }
        }
        else {
            const centerLocation: L.LatLngExpression = [user.userLocation.latitude, user.userLocation.longitude];
            const zoom = MapMetaData.getMapView(mapView);

            // fly to center marker location
            mapRef.current?.flyTo(centerLocation, zoom);

            // set user focus to true with 7 sec delay [ if user marker selected with FOCUS, ZOOM mapview ] 
            setTimeout(() => userFocusObj.setUserFocus(true), 7000);
        }
    };

    const ResetCenterToUserLocation = () => {
        // set user focus to false [ because I set mapview to high ]
        userFocusObj.setUserFocus(false);

        const centerLocation: L.LatLngExpression = [user.userLocation.latitude, user.userLocation.longitude];
        const zoom = MapMetaData.getMapView(MapViewEnum.high);

        // fly to user location and set zoom to high mapview
        mapRef.current?.flyTo(centerLocation, zoom);
    };

    let resetBtnColorTheme: string;

    if (isDarkTheme) {
        resetBtnColorTheme = "bg-mainblack";
    }
    else {
        resetBtnColorTheme = "bg-viridian-green";
    }

    return <>
        <div className='map-reset-position-btn'>
            <button 
                className={`btn bg-gradient shadow-sm border ${resetBtnColorTheme} text-white`}
                onClick={ResetCenterToUserLocation}
            >
                <i className="fa-solid fa-map-location-dot"></i>
            </button>
        </div>

        <MapContainer 
            className='map shadow-sm rounded-3' 
            center={[user.userLocation.latitude, user.userLocation.longitude]} 
            zoom={MapMetaData.getMapView(MapViewEnum.high)} 
            scrollWheelZoom={true}
            attributionControl={false}
            ref={map => mapRef.current = map ?? undefined}
        >
            <TileLayer
                attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
                url={mapAsset.mapTitle}
            />

            {/* <div className='map-reset-position-btn'>
                <button 
                    className='btn btn-light bg-gradient shadow-sm border border-2 border-secondary bg-mainblack text-white'
                    onClick={ResetCenterToUserLocation}
                >
                    <i className="fa-solid fa-map-location-dot"></i>
                </button>
            </div> */}

            <Marker 
                position={[userMarker.markerLocation.latitude, userMarker.markerLocation.longitude]}
                icon={userMarkerIcon}
            >
                <UserMapPopup
                    userName={userMarker.markerName}
                    setMapView={SetMapView}
                    isDarkTheme={isDarkTheme}
                ></UserMapPopup>
            </Marker>
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
    </>
}