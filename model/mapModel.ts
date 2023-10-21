import { IBaseLocation } from "./subentityModel";

export interface IMarker {
    markerName: string,
    markerMessage?: string,
    markerLocation: IBaseLocation
}