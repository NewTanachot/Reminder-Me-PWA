export type ResponseModel = {
    isSuccess: boolean
    message: string
}

export interface ISetupIndexedDBModel {
    themeStore: IDBObjectStore,
    userStore: IDBObjectStore,
    mapStore: IDBObjectStore
}