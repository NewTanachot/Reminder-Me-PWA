import {PwaCurrentPageEnum} from "@/model/enumModel";

export interface IUpdateCardStatusApiRequest {
    isDisable: boolean
}

export interface IChangeCurrentPageRequest {
    page: PwaCurrentPageEnum,
    successBox?: boolean,
    forceFetch?: boolean,
    backBtn?: boolean
}