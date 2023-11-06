import { MapTitleEnum } from "./enumModel"

export interface IUserIndexedDB {
    userId: string,
    userName: string
}

export interface IThemeIndexedDB {
    isDarkTheme: boolean
}

export interface IMapIndexedDB {
    mapTheme: MapTitleEnum
}