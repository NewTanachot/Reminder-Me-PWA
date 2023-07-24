import { StringLiteralType } from "typescript"
import { PwaCurrentPage } from "./enum_model"
import { CurrentUserRef, IDisplayPlace } from "./subentity_model"

export interface INavbarProps {
    userName: string,
    currentPage: PwaCurrentPage,
    changeCurrentPage: (page: PwaCurrentPage) => void
}

export interface IFooterProps {
    currentPage: PwaCurrentPage,
    changeCurrentPage: (page: PwaCurrentPage) => void
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
    setCurrentUser: (setUser: CurrentUserRef) => void,
    changeCurrentPage: (page: PwaCurrentPage) => void
}