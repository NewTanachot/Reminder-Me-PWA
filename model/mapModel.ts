import { MapStyleTitleEnum } from "./enumModel";
import { IBaseLocation } from "./subentityModel";

export interface IContainerClass {
    notMapClass: string[],
    mapClass: string[]
}

// https://cloud.maptiler.com/account/keys/?_ga=2.74998166.504639508.1698037213-71810968.1698037213&_gl=1*1nbzh2s*_gcl_au*NDUzMDM2MTY2LjE2OTgwMzcyMTM.*_ga*NzE4MTA5NjguMTY5ODAzNzIxMw..*_ga_K4SXYBF4HT*MTY5ODAzNzIxMi4xLjEuMTY5ODAzNzI3Mi42MC4wLjA.
export class MapStyleTitle {
    public static default = "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=JYIhTNrwXNynUhyX5fIo";
    public static original = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    public static clean = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png";
    public static light = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
    public static dark = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
    public static satellite = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    public static bright = "https://api.maptiler.com/maps/bright/{z}/{x}/{y}.png?key=JYIhTNrwXNynUhyX5fIo"

    
    public static getMaptitle(mapName: MapStyleTitleEnum, isDarkTheme: boolean) {
        switch (mapName) {
            case MapStyleTitleEnum.Original:
                return this.original;
            case MapStyleTitleEnum.Clean:
                return this.clean;    
            case MapStyleTitleEnum.Light:
                return this.light;    
            case MapStyleTitleEnum.Dark:
                return this.dark;    
            case MapStyleTitleEnum.Satellite:
                return this.satellite;    
            case MapStyleTitleEnum.Bright:
                return this.bright;    
            case MapStyleTitleEnum.Sync:
                return isDarkTheme ? this.dark : this.light;
            default:
                return this.default;
        }
    }
}

export interface IMarker {
    markerName: string,
    markerMessage?: string,
    markerDate?: string,
    markerLocation: IBaseLocation
} 