import { MapTitleEnum } from "./enumModel";
import { IBaseLocation } from "./subentityModel";
import userIcon from '@/public/image/map-icon/user-icon.png';
import userAltIcon from '@/public/image/map-icon/user-yellow-icon.png';
import placeIcon from 'leaflet/dist/images/marker-icon.png';
import placeWithDateIcon from '@/public/image/map-icon/marker-icon-orange.png';
import newPlaceIcon from '@/public/image/map-icon/marker-icon-red.png';
import L from 'leaflet';

export interface IContainerClass {
    notMapClass: string[],
    mapClass: string[]
}

export enum MapViewEnum {
    high, Focus, Zoom, Card
}

// https://cloud.maptiler.com/account/keys/?_ga=2.74998166.504639508.1698037213-71810968.1698037213&_gl=1*1nbzh2s*_gcl_au*NDUzMDM2MTY2LjE2OTgwMzcyMTM.*_ga*NzE4MTA5NjguMTY5ODAzNzIxMw..*_ga_K4SXYBF4HT*MTY5ODAzNzIxMi4xLjEuMTY5ODAzNzI3Mi42MC4wLjA.
export class MapMetaData {

    private static highView = 10;
    private static focusView = 13;
    private static zoomView = 18;
    private static cardView = 16;
    private static zoomAnimationDuration = 2;
    private static default = "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=JYIhTNrwXNynUhyX5fIo";
    private static original = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    private static clean = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png";
    private static light = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
    private static dark = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
    private static satellite = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    private static bright = "https://api.maptiler.com/maps/bright/{z}/{x}/{y}.png?key=JYIhTNrwXNynUhyX5fIo";
    private static lightMapAsset: IMapAsset = {
        mapTitle: this.light,
        mapUserIcon: userIcon.src
    };
    private static darkMapAsset: IMapAsset = {
        mapTitle: this.dark,
        mapUserIcon: userAltIcon.src
    };

    // Add the custom CSS rule to change the popup and tip background color [ #F5F5F599, whitesmoke ]
    private static customPopupStyles = `
        .leaflet-popup-content,
        .leaflet-popup-content-wrapper {
            background-color: transparent;
            margin: 0;
            margin-bottom: 5px;
            padding: 0;
        }
        
        .leaflet-popup-tip,
        .leaflet-popup-close-button {
            display: none;
        }
        `;

    private static customLightPopupStyles = `
        .leaflet-popup-content,
        .leaflet-popup-content-wrapper {
            background-color: #F5F5F599;
            margin: 0;
            margin-bottom: 5px;
            padding: 15px;
        }

        .leaflet-popup-tip {
            display: none;
        }
        `;

    private static customDarkPopupStyles = `
        .leaflet-popup-content,
        .leaflet-popup-content-wrapper {
            background-color: #36454F99;
            margin: 0;
            margin-bottom: 5px;
            padding: 0;
        }
        
        .leaflet-popup-tip {
            display: none;
        }
        `;
        
    public static getPopupStyle(isDarkTheme?: boolean) {
        
        if (isDarkTheme == undefined) {
            return this.customPopupStyles;
        }

        return isDarkTheme ? this.customDarkPopupStyles : this.customLightPopupStyles;
    }

    public static normalPlaceIcon = placeIcon.src;
    public static dataPlaceIcon = placeWithDateIcon.src;
    public static selectPlaceIcon = newPlaceIcon.src;

    public static getFlyToOption(): L.ZoomPanOptions {
        return {
            duration: this.zoomAnimationDuration
        };
    }

    public static getUserFocusTimeOutDuration() {
        return (this.zoomAnimationDuration + 0.2) * 1000; // buffer 0.2 sec
    }

    public static getMapView(type: MapViewEnum) {
        switch(type) {
            case MapViewEnum.Focus:
                return this.focusView;
            case MapViewEnum.high:
                return this.highView;
            case MapViewEnum.Zoom:
                return this.zoomView;
            case MapViewEnum.Card:
                return this.cardView;
        }
    }

    public static getMaptitle(mapName: MapTitleEnum, isDarkTheme: boolean): IMapAsset {
        switch (mapName) {

            case MapTitleEnum.Original:
                return {
                    mapTitle: this.original,
                    mapUserIcon: userIcon.src
                };

            case MapTitleEnum.Clean:
                return {
                    mapTitle: this.clean,
                    mapUserIcon: userIcon.src
                };

            case MapTitleEnum.Light:
                return this.lightMapAsset;

            case MapTitleEnum.Dark:
                return this.darkMapAsset;

            case MapTitleEnum.Satellite:
                return {
                    mapTitle: this.satellite,
                    mapUserIcon: userAltIcon.src
                };

            case MapTitleEnum.Bright:
                return {
                    mapTitle: this.bright,
                    mapUserIcon: userIcon.src
                };

            case MapTitleEnum.Sync:
                return isDarkTheme ? this.darkMapAsset : this.lightMapAsset;

            default:
                return {
                    mapTitle: this.default,
                    mapUserIcon: userIcon.src
                };
        }
    }
}

export interface IMarker {
    markerName: string,
    markerMessage?: string,
    markerDate?: string,
    markerLocation: IBaseLocation
}

export interface IMapAsset {
    mapTitle: string,
    mapUserIcon: string
}

export interface IUserFocusMap {
    isfocus: boolean
    setUserFocus: (isFocus: boolean) => void
}