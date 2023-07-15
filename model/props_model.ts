import { Dispatch, SetStateAction } from "react"
import { PwaCurrentPage } from "./enum_model"
import { CurrentUserRef, IDisplayPlace } from "./subentity_model"

export interface IPlaceCardProps {
    cardIndex: number
    data: IDisplayPlace
}

export interface IListPageProps {
    places: IDisplayPlace[]
}

export interface INavbarProps {
    userName: string
    currentPage: PwaCurrentPage
    changeCurrentPage: (page: PwaCurrentPage) => void;
}

export interface ILoginProps {
    setCurrentUser: (setUser: CurrentUserRef) => void;
    changeCurrentPage: (page: PwaCurrentPage) => void;
    resetPlaceStste: () => void;
}