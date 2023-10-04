import {PwaCurrentPageEnum} from "@/model/enumModel";

export interface IChangeCurrentPageRequest {
    page: PwaCurrentPageEnum,
    successBox?: boolean,
    forceFetch?: boolean,
    backBtn?: boolean
}