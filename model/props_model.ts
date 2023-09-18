import { User } from "@prisma/client"
import { PwaCurrentPage } from "./enum_model"
import { IUserLocation } from "./subentity_model"
import { CurrentUserRef, IDisplayPlace, ICurrentPage } from "./useState_model"

interface IBaseProps {
    isDarkTheme: boolean
}

export interface INavbarProps {
    currentPageName: PwaCurrentPage,
    orderByDistanceValue: boolean,
    changeOrderByDistanceHandler: (orderByDistance: boolean) => void,
}

export interface IFooterProps {
    currentPageName: PwaCurrentPage,
    changeCurrentPage: (page: PwaCurrentPage, successBox?: boolean, forceFetch?: boolean) => void
}

export interface IUserInfoProps {
    username: string,
    location: IUserLocation
}

export interface IListPageProps extends IBaseProps {
    places: IDisplayPlace[] | undefined,
    currentUser: CurrentUserRef,
    deletePlaceHandler: (placeId: string) => void,
    changePlaceStatusHandler: (placeId: string, setIsDisable: boolean) => void,
    updatePlaceCardHandler: (cardId: string) => void
}

export interface IPlaceCardProps extends IBaseProps {
    data: IDisplayPlace,
    deletePlaceHandler: (placeId: string) => void,
    changePlaceStatusHandler: (placeId: string, setIsDisable: boolean) => void,
    updatePlaceCardHandler: (cardId: string) => void
}

export interface IAddPlace {
    userId: string,
    changeCurrentPage: (page: PwaCurrentPage, successBox?: boolean, forceFetch?: boolean) => void
}

export interface ISettingProps {
    currentUserName: string,
    changeCurrentPage: (page: PwaCurrentPage, successBox?: boolean, forceFetch?: boolean) => void,
    changeThemeHandler: (currentTheme: boolean) => void, 
    isDarkTheme: boolean
}

export interface ILoginProps {
    currentPage: ICurrentPage,
    setCurrentUser: (setUser: CurrentUserRef) => void,
    insertUserHandler: (user: User) => void,
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
    changeCurrentThemeHandler: (currentTheme: boolean) => void, 
    isDarkTheme: boolean
}

export interface IUpdateListProps {
    cardData: IDisplayPlace,
    changeCurrentPage: (page: PwaCurrentPage, successBox?: boolean, forceFetch?: boolean) => void
}

export interface ISuccessModal {
    modalMessage: string
}