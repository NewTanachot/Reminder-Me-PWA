import { User } from "@prisma/client"
import { PwaCurrentPageEnum } from "./enumModel"
import { IUserLocation } from "./subentityModel"

export interface ICurrentPage {
    pageName: PwaCurrentPageEnum,
    successAlertBox?: boolean,
    backBtn?: boolean
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
    displayCreateAt: string
    userId: string
    locationDistance: number
}

export interface IRegisterValidator {
    inputEmptyString: boolean
    duplicateUserName: boolean
}