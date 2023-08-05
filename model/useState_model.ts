import { User } from "@prisma/client"
import { PwaCurrentPage } from "./enum_model"

export interface ICurrentPage {
    pageName: PwaCurrentPage,
    successAlertBox: boolean
}

export type CurrentUserRef = {
    userId: string
    userName: string
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

export interface IUserIndexedDB extends User {
    CurrentUser: string
}

export interface IRegisterValidator {
    inputEmptyString: boolean
    duplicateUserName: boolean
}