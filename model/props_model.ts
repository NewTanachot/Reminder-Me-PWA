import { PwaCurrentPage } from "./enum_model"
import { CurrentUserRef, IDisplayPlace, ICurrentPage } from "./useState_model"

export interface INavbarProps {
    userName: string,
    currentPageName: PwaCurrentPage,
    changeCurrentPage: (page: PwaCurrentPage, successBox?: boolean, forceFetch?: boolean) => void
}

export interface IFooterProps {
    currentPageName: PwaCurrentPage,
    changeCurrentPage: (page: PwaCurrentPage, successBox?: boolean, forceFetch?: boolean) => void
}

export interface IPlaceCardProps {
    cardIndex: number,
    data: IDisplayPlace,
    deletePlaceHandler: (placeId: string) => void,
    changePlaceStatusHandler: (placeId: string, setIsDisable: boolean) => void
}

export interface IListPageProps {
    places: IDisplayPlace[] | undefined,
    currentUserId: string,
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

export interface ISuccessModal {
    modalMessage: string
}