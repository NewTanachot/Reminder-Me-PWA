import { User } from "@prisma/client"
import { PwaCurrentPage } from "./enumModel"
import { IUserLocation } from "./subentityModel"
import { CurrentUserRef, IDisplayPlace, ICurrentPage } from "./useStateModel"

interface IBaseProps {
    isDarkTheme: boolean
}

export interface INavbarProps extends IBaseProps {
    currentPageName: PwaCurrentPage,
    orderByDistanceValue: boolean,
    changeOrderByDistanceHandler: (orderByDistance: boolean) => void,
}

export interface IFooterProps extends IBaseProps {
    currentPageName: PwaCurrentPage,
    changeCurrentPage: (page: PwaCurrentPage, successBox?: boolean, forceFetch?: boolean) => void
}

export interface IUserInfoProps extends IBaseProps {
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

export interface IAddPlace extends IBaseProps {
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
    userLoginHandler: (setUser: CurrentUserRef) => void,
    changeCurrentPage: (page: PwaCurrentPage, successBox?: boolean, forceFetch?: boolean) => void
}

export interface IRegisterProps {
    changeCurrentPage: (page: PwaCurrentPage, successBox?: boolean, forceFetch?: boolean) => void
}

export interface IStaticSettingCardProps extends IBaseProps {
    cardIcon: string,
    cardTitle: string,
    cardInfo: string
}

export interface IThemeSettingCardProps extends IBaseProps {
    changeCurrentThemeHandler: (currentTheme: boolean) => void, 
}

export interface IUpdateListProps extends IBaseProps {
    cardData: IDisplayPlace,
    changeCurrentPage: (page: PwaCurrentPage, successBox?: boolean, forceFetch?: boolean) => void
}

export interface ISuccessModal {
    modalMessage: string
}