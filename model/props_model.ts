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
    deletePlaceHandler: (placeId: string) => void
}

export interface IListPageProps {
    places: IDisplayPlace[],
    currentUserId: string,
    deletePlaceHandler: (placeId: string) => void
}


export interface ILoginProps {
    setCurrentUser: (setUser: CurrentUserRef) => void,
    changeCurrentPage: (page: PwaCurrentPage) => void
}