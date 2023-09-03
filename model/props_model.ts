import { PwaCurrentPage } from "./enum_model"
import { IUserLocation } from "./subentity_model"
import { CurrentUserRef, IDisplayPlace, ICurrentPage } from "./useState_model"

export interface INavbarProps {
    currentPageName: PwaCurrentPage,
    orderByDistanceValue: boolean,
    changeOrderByDistanceHandler: (orderByDistance: boolean) => void,
}

export interface IFooterProps {
    currentPageName: PwaCurrentPage,
    changeCurrentPage: (page: PwaCurrentPage, successBox?: boolean, forceFetch?: boolean) => void
}

export interface IListPageProps {
    places: IDisplayPlace[] | undefined,
    currentUser: CurrentUserRef,
    deletePlaceHandler: (placeId: string) => void,
    changePlaceStatusHandler: (placeId: string, setIsDisable: boolean) => void
}

export interface IUserInfoProps {
    username: string,
    location: IUserLocation
}

export interface IPlaceCardProps {
    cardIndex: number,
    data: IDisplayPlace,
    deletePlaceHandler: (placeId: string) => void,
    changePlaceStatusHandler: (placeId: string, setIsDisable: boolean) => void
}

export interface IAddPlace {
    userId: string,
    changeCurrentPage: (page: PwaCurrentPage, successBox?: boolean, forceFetch?: boolean) => void
}

export interface ISettingProps {
    currentUserName: string,
    changeCurrentPage: (page: PwaCurrentPage, successBox?: boolean, forceFetch?: boolean) => void
}

export interface ILoginProps {
    currentPage: ICurrentPage,
    setCurrentUser: (setUser: CurrentUserRef) => void,
    changeCurrentPage: (page: PwaCurrentPage, successBox?: boolean, forceFetch?: boolean) => void
}

export interface IRegisterProps {
    changeCurrentPage: (page: PwaCurrentPage, successBox?: boolean, forceFetch?: boolean) => void
}

export interface IStaticSettingCardProps {
    cardIcon: string,
    cardTitle: string,
    cardInfo: string
}

export interface IThemeSettingCardProps {
    
}


export interface ISuccessModal {
    modalMessage: string
}