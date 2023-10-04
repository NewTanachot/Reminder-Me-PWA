import { User } from "@prisma/client"
import { CardOrderByEnum, PwaCurrentPageEnum } from "./enumModel"
import { IUserLocation } from "./subentityModel"
import { CurrentUserRef, IDisplayPlace, ICurrentPage } from "./useStateModel"
import {IChangeCurrentPageRequest} from "@/model/requestModel";

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
    changeCurrentPage: (requestDto: IChangeCurrentPageRequest) => void
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
    changeCurrentPage: (requestDto: IChangeCurrentPageRequest) => void
}

export interface ISettingProps extends IBaseProps {
    currentUserName: string,
    changeCurrentPage: (requestDto: IChangeCurrentPageRequest) => void,
    changeThemeHandler: (currentTheme: boolean) => void,
    softwareVersion: string
}

export interface ILoginProps extends IBaseProps {
    currentPage: ICurrentPage,
    userLoginHandler: (setUser: CurrentUserRef) => void,
    changeCurrentPage: (requestDto: IChangeCurrentPageRequest) => void
}

export interface IRegisterProps extends IBaseProps {
    changeCurrentPage: (requestDto: IChangeCurrentPageRequest) => void
}

export interface IStaticSettingCardProps extends IBaseProps {
    cardIcon: string,
    cardTitle: string,
    cardInfo: string
}

export interface IUserInfoSettingCardProps extends IBaseProps {
    userInfo: string
    changeCurrentPage: (requestDto: IChangeCurrentPageRequest) => void
}

export interface IThemeSettingCardProps extends IBaseProps {
    changeCurrentThemeHandler: (currentTheme: boolean) => void, 
}

export interface IUpdateListProps extends IBaseProps {
    cardData: IDisplayPlace,
    changeCurrentPage: (requestDto: IChangeCurrentPageRequest) => void
}

export interface ILoadingPageProps extends IBaseProps { }

export interface ISuccessModal {
    modalMessage: string
}