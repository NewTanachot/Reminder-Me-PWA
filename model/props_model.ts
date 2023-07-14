import { PwaCurrentPage } from "./enum_model"
import { IDisplayPlace } from "./subentity_model"

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