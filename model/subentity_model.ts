import { Place } from "@prisma/client";
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

export interface IDisplayPlace extends Place {
    locationDistance: number
}