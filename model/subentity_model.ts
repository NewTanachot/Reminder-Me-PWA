import { Place } from "@prisma/client";

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

export interface IDisplayPlace extends Place {
    locationDistance: number
}