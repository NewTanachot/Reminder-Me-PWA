import {PwaCurrentPageEnum} from "@/model/enumModel";

export interface IPlaceApiParam {
    params: {
        id: string
    }
}

export interface IUserApiParam {
    params: {
        id: string
    }
}

export interface IUpdateCardStatusApiRequest {
    isDisable: boolean
}

export interface IChangeCurrentPageRequest {
    page: PwaCurrentPageEnum,
    successBox?: boolean,
    forceFetch?: boolean,
    backBtn?: boolean
}