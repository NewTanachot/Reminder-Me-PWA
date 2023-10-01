import { User } from "@prisma/client"
import { CardOrderByEnum, PwaCurrentPageEnum } from "./enumModel"
import { IUserLocation } from "./subentityModel"
import { CurrentUserRef, IDisplayPlace, ICurrentPage } from "./useStateModel"

interface IBaseProps {
    isDarkTheme: boolean
}

export interface INavbarProps extends IBaseProps {
    currentPageName: PwaCurrentPageEnum,
    orderByDistanceValue: boolean,
    changeOrderByDistanceHandler: (orderByDistance: boolean) => void,
}

export interface IFooterProps extends IBaseProps {
    currentPageName: PwaCurrentPageEnum,
    changeCurrentPage: (page: PwaCurrentPageEnum, successBox?: boolean, forceFetch?: boolean) => void
}

export interface IUserInfoProps extends IBaseProps {
    username: string,
    location: IUserLocation,
    changeCardOrderByHandler: (orderBy: CardOrderByEnum) => void
}

export interface IListPageProps extends IBaseProps {
    places: IDisplayPlace[] | undefined,
    currentUser: CurrentUserRef,
    deletePlaceHandler: (placeId: string) => void,
    changePlaceStatusHandler: (placeId: string, setIsDisable: boolean) => void,
    updatePlaceCardHandler: (cardId: string) => void,
    changeCardOrderByHandler: (orderBy: CardOrderByEnum) => void
}

export interface IPlaceCardProps extends IBaseProps {
    data: IDisplayPlace,
    deletePlaceHandler: (placeId: string) => void,
    changePlaceStatusHandler: (placeId: string, setIsDisable: boolean) => void,
    updatePlaceCardHandler: (cardId: string) => void
}

export interface IAddPlace extends IBaseProps {
    userId: string,
    changeCurrentPage: (page: PwaCurrentPageEnum, successBox?: boolean, forceFetch?: boolean) => void
}

export interface ISettingProps {
    currentUserName: string,
    changeCurrentPage: (page: PwaCurrentPageEnum, successBox?: boolean, forceFetch?: boolean) => void,
    changeThemeHandler: (currentTheme: boolean) => void, 
    isDarkTheme: boolean
}

export interface ILoginProps extends IBaseProps {
    currentPage: ICurrentPage,
    userLoginHandler: (setUser: CurrentUserRef) => void,
    changeCurrentPage: (page: PwaCurrentPageEnum, successBox?: boolean, forceFetch?: boolean) => void
}

export interface IRegisterProps extends IBaseProps {
    changeCurrentPage: (page: PwaCurrentPageEnum, successBox?: boolean, forceFetch?: boolean) => void
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
    changeCurrentPage: (page: PwaCurrentPageEnum, successBox?: boolean, forceFetch?: boolean) => void
}

export interface ISuccessModal {
    modalMessage: string
}