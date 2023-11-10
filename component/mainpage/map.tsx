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

export default function Map({ placeMarkers, user, mapAsset, isDarkTheme }: IMapProps) {

    // create map ref value
    const mapRef = useRef<L.Map>();
    const isUserFocus = useRef<boolean>(true);

    if (isUserFocus.current) {
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

        // set is focus on user marker or not
        isUserFocus.current = !markerName;

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
        }
    };

    return (
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
    )
}