import { StringLiteralType } from "typescript"
import { PwaCurrentPage } from "./enum_model"
import { CurrentUserRef, ICurrentPage, IDisplayPlace } from "./subentity_model"

export interface INavbarProps {
    userName: string,
    currentPageName: PwaCurrentPage,
    changeCurrentPage: (page: PwaCurrentPage, successBox?: boolean) => void
}

export interface IFooterProps {
    currentPageName: PwaCurrentPage,
    changeCurrentPage: (page: PwaCurrentPage, successBox?: boolean) => void
}

export interface IPlaceCardProps {
    cardIndex: number,
    data: IDisplayPlace,
    deletePlaceHandler: (placeId: string) => void,
    changePlaceStatusHandler: (placeId: string) => void
}

export interface IListPageProps {
    places: IDisplayPlace[] | undefined,
    currentUserId: string,
    deletePlaceHandler: (placeId: string) => void,
    changePlaceStatusHandler: (placeId: string) => void
}

export interface ILoginProps {
    currentPage: ICurrentPage,
    setCurrentUser: (setUser: CurrentUserRef) => void,
    changeCurrentPage: (page: PwaCurrentPage, successBox?: boolean) => void
}

export interface IRegisterProps {
    changeCurrentPage: (page: PwaCurrentPage, successBox?: boolean) => void
}

export interface ISuccessModal {
    modalMessage: string
}

