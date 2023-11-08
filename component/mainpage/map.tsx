'use client';

import 'leaflet/dist/leaflet.css'
import L from 'leaflet';
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import { IMapProps } from '@/model/propsModel';
import { IMarker, MapMetaData } from '@/model/mapModel';
import placeIcon from 'leaflet/dist/images/marker-icon.png';
import placeWithDateIcon from '@/public/image/map-icon/marker-icon-orange.png';
import UserMapPopup from '../mapAsset/userMapPopup';
import PlaceMapPopup from '../mapAsset/placeMapPopup';
import { useRef } from 'react';

// set mormal map icon
const placeMarkerIcon = L.icon({
    iconUrl: placeIcon.src,
    iconSize: [18, 29],
});

const placeWithDateMarkerIcon = L.icon({
    iconUrl: placeWithDateIcon.src,
    iconSize: [18, 29],
});

export default function Map({ placeMarkers, user, mapAsset, isDarkTheme }: IMapProps) {

    // create map ref value
    const mapRef = useRef<L.Map>();

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

    return (
        <MapContainer 
            className='map shadow-sm rounded-3' 
            center={[user.userLocation.latitude, user.userLocation.longitude]} 
            zoom={MapMetaData.getMapZoom()} 
            scrollWheelZoom={true}
            attributionControl={false}
            ref={map => mapRef.current = map ?? undefined}
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
                    zoomUserMarkerHandler={ZoomUserMarkerHandler}
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
                                zoomHandler={ZoomMarkerHandler}
                            ></PlaceMapPopup>
                        </Marker>
                    )
                    : <></>
            }
        </MapContainer>
    )
}