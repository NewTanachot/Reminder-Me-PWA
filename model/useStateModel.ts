import { User } from "@prisma/client"
import { PwaCurrentPage } from "./enumModel"
import { IUserLocation } from "./subentityModel"

export interface ICurrentPage {
    pageName: PwaCurrentPage,
    successAlertBox: boolean
}

export type CurrentUserRef = {
    userId: string
    userName: string
    userLocation: IUserLocation,
}

export interface IDisplayPlace {
    id: string
    name: string
    latitude: number
    longitude: number
    reminderMessage: string | null
    reminderDate: string | null
    isDisable: boolean
    createdAt: Date
    userId: string
    locationDistance: number
}

export interface IRegisterValidator {
    inputEmptyString: boolean
    duplicateUserName: boolean
}