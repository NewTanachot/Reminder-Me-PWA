import { MapTitleEnum } from "./enumModel";
import { IBaseLocation } from "./subentityModel";
import userIcon from '@/public/image/map-icon/user-icon.png';
import userAltIcon from '@/public/image/map-icon/user-yellow-icon.png';

export interface IContainerClass {
    notMapClass: string[],
    mapClass: string[]
}

// https://cloud.maptiler.com/account/keys/?_ga=2.74998166.504639508.1698037213-71810968.1698037213&_gl=1*1nbzh2s*_gcl_au*NDUzMDM2MTY2LjE2OTgwMzcyMTM.*_ga*NzE4MTA5NjguMTY5ODAzNzIxMw..*_ga_K4SXYBF4HT*MTY5ODAzNzIxMi4xLjEuMTY5ODAzNzI3Mi42MC4wLjA.
export class MapMetaData {

    private static normalZoom = 10;
    private static focusZoom = 17;
    private static default = "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=JYIhTNrwXNynUhyX5fIo";
    private static original = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    private static clean = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png";
    private static light = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
    private static dark = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
    private static satellite = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    private static bright = "https://api.maptiler.com/maps/bright/{z}/{x}/{y}.png?key=JYIhTNrwXNynUhyX5fIo" 
    private static LightMapAsset: IMapAsset = {
        mapTitle: this.light,
        mapUserIcon: userIcon.src
    };
    private static DarkMapAsset: IMapAsset = {
        mapTitle: this.dark,
        mapUserIcon: userAltIcon.src
    };

    public static getMapZoom(isFocus?: boolean) {
        return isFocus ? this.focusZoom : this.normalZoom;
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
                return this.LightMapAsset;

            case MapTitleEnum.Dark:
                return this.DarkMapAsset;

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
                return isDarkTheme ? this.DarkMapAsset : this.LightMapAsset;

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