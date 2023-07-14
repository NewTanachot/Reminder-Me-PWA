import { User } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";

export type UserExtensionModel = {
    name: string,
    password: string
}

export type PlaceExtensionModel = {
    name: string,
    latitude: number,
    longitude: number,
    reminderMessage? : string,
    reminderDate?: Date,
    userId: string
}

export type UpdatePlace = {
    id: string
    name?: string | undefined
    latitude?: Decimal | undefined
    longitude?: Decimal | undefined
    reminderMessage?: string | undefined
    reminderDate?: string | undefined
    isDisable?: boolean | undefined
    createdAt?: Date | undefined
    userId?: string | undefined
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

export interface IPlaceCardProps {
    cardIndex: number
    data: IDisplayPlace
}