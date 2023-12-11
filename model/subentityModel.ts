export type UserExtensionModel = {
    name: string,
    password: string
}

export type UpsertPlace = {
    id?: string
    name?: string | undefined
    latitude?: number | undefined
    longitude?: number | undefined
    reminderMessage?: string | undefined
    reminderDate?: Date | undefined
    isDisable?: boolean | undefined
    createdAt?: Date | undefined
    userId?: string | undefined
}

export interface IBaseLocation {
    latitude: number
    longitude: number
}