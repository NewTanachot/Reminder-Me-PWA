import { CardOrderByEnum, MapTitleEnum, PwaCurrentPageEnum } from "./enumModel"
import { IContainerClass, IMapAsset, IMarker, IUserFocusMap, MapViewEnum } from "./mapModel";
import { IBaseLocation } from "./subentityModel"
import { CurrentUserRef, IDisplayPlace, ICurrentPage } from "./useStateModel"
import {IChangeCurrentPageRequest} from "@/model/requestModel";

interface IBaseProps {
    isDarkTheme: boolean
}

interface IBaseApiUrl {
    baseUrlApi: string
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
    location: IBaseLocation,
    currentCardOrder: CardOrderByEnum,
    changeCardOrderByHandler: (orderBy: CardOrderByEnum) => void
}

export interface IListPageProps extends IBaseProps, IBaseApiUrl {
    places: IDisplayPlace[] | undefined,
    currentUser: CurrentUserRef,
    deletePlaceHandler: (placeId: string) => void,
    changePlaceStatusHandler: (placeId: string, setIsDisable: boolean) => void,
    updatePlaceCardHandler: (cardId: string) => void,
    currentCardOrder: CardOrderByEnum,
    changeCardOrderByHandler: (orderBy: CardOrderByEnum) => void
}

export interface IPlaceCardProps extends IBaseProps, IBaseApiUrl {
    data: IDisplayPlace,
    deletePlaceHandler: (placeId: string) => void,
    changePlaceStatusHandler: (placeId: string, setIsDisable: boolean) => void,
    updatePlaceCardHandler: (cardId: string) => void
}

export interface IAddListProps extends IBaseProps, IBaseApiUrl {
    user: CurrentUserRef,
    mapAsset: IMapAsset,
    places?: IDisplayPlace[],
    containerClassObject: IContainerClass,
    changeCurrentPage: (requestDto: IChangeCurrentPageRequest) => void,
    setIsMapPage: (flag: boolean) => void
}

export interface IUpdateListProps extends IBaseProps, IBaseApiUrl {
    user: CurrentUserRef,
    mapAsset: IMapAsset,
    places?: IDisplayPlace[],
    containerClassObject: IContainerClass,
    cardData: IDisplayPlace,
    changeCurrentPage: (requestDto: IChangeCurrentPageRequest) => void,
    setIsMapPage: (flag: boolean) => void
}

export interface ISettingProps extends IBaseProps {
    currentUserName: string,
    changeCurrentPage: (requestDto: IChangeCurrentPageRequest) => void,
    changeThemeHandler: (currentTheme: boolean) => void,
    userLogoutHandler: () => void,
    softwareVersion: string,
    developedBy: string,
    currentMap: MapTitleEnum,
    changeCurrentMapHandler: (mapStyle: MapTitleEnum) => void
}

export interface ILoginProps extends IBaseProps, IBaseApiUrl {
    currentPage: ICurrentPage,
    userLoginHandler: (setUser: CurrentUserRef) => void,
    changeCurrentPage: (requestDto: IChangeCurrentPageRequest) => void
}

export interface IRegisterProps extends IBaseProps, IBaseApiUrl {
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

export interface ILoadingPageProps extends IBaseProps { }

export interface ILoadingComponentProps extends IBaseProps {
    isDisplay: boolean
}

export interface ISuccessModalProps {
    modalMessage: string
}

export interface ISplashScreenProps { 
    softwareVersion: string
}

export interface INotFoundProps extends IBaseProps {}

export interface IMapProps extends IBaseProps {
    placeMarkers?: IMarker[],
    user: CurrentUserRef,
    mapAsset: IMapAsset,
    userFocusObj: IUserFocusMap 
}

export interface IMapSettingCardProps extends IBaseProps { 
    currentMap: MapTitleEnum,
    changeCurrentMapHandler: (mapStyle: MapTitleEnum) => void
}

export interface IMapModalProps extends IMapProps { 
    newMarkerInitLocation?: IBaseLocation,
    addLocationDataToRef: (location: IBaseLocation | undefined) => void,
    backtoFormPage: () => void
}

interface IBaseMapPopupProps {
    setMapView: (mapView: MapViewEnum, markerName?: string) => void
}

export interface IUserMapPopupProps extends IBaseMapPopupProps, IBaseProps {
    userName: string,
    markNewLocationAtUser?: () => void,
}

export interface IPlaceMapPopupProps extends IBaseMapPopupProps, IBaseProps {
    name: string,
    message?: string,
    date?: string,   
}

export interface IMapPopupFooterProps extends IBaseMapPopupProps, IBaseProps {
    name: string,
}

export interface IUserPopupFooterProps extends IBaseMapPopupProps, IBaseProps {
    markNewLocationAtUser?: () => void
}