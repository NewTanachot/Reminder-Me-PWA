import { PwaCurrentPageEnum } from "./enumModel"
import { IBaseLocation } from "./subentityModel"

export interface ICurrentPage {
    pageName: PwaCurrentPageEnum,
    successAlertBox?: boolean,
    backBtn?: boolean
}

export type CurrentUserRef = {
    userId: string
    userName: string
    userLocation: IBaseLocation,
}

export interface IDisplayPlace {
    id: string
    name: string
    latitude: number | null
    longitude: number | null
    reminderMessage: string | null
    reminderDate: string | null
    isDisable: boolean
    createdAt: Date
    displayCreateAt: string
    userId: string
    locationDistance: number
}