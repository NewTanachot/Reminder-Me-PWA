import { IBaseLocation } from "./subentityModel";

export class MapStyleTitle {
    public static default = "https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png";
    public static full = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    public static clean = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png";
    public static white = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
    public static dark = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
    public static satellite = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
}

export interface IMarker {
    markerName: string,
    markerMessage?: string,
    markerDate?: string,
    markerLocation: IBaseLocation
} 