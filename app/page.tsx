'use client';

import packageJson from '@/package.json';
import { IsStringValid } from '@/extension/string_extension';
import { CurrentUserRef, ICurrentPage, IDisplayPlace } from '@/model/useStateModel';
import { ISetupIndexedDBModel, ResponseModel } from '@/model/responseModel';
import { Place} from '@prisma/client';
import { useEffect, useRef, useState } from 'react';
import { CalculatePlaceForDisplay, GetPlaceMarkers, OrderPlaceByDistance } from '@/extension/calculation_extension';
import { CardOrderByEnum, MapTitleEnum, PwaCurrentPageEnum } from '@/model/enumModel';
import { GetCustomGeoLocationOption } from '@/extension/api_extension';
import dynamic from "next/dynamic"
import List from '@/component/mainpage/list';
import Login from '@/component/authPageAsset/login';
import Register from '@/component/authPageAsset/register';
import Footer from '@/component/layoutAsset/footer';
import AddList from '@/component/mainpage/addList';
import EvBattery from '@/component/mainpage/evbattery';
import Setting from '@/component/mainpage/setting';
import UpdateList from '@/component/mainpage/updateList';
import Loading from '@/component/mainpage/loading';
import SplashScreen from '@/component/modalAsset/splashScreen';
import { IMapIndexedDB, IThemeIndexedDB, IUserIndexedDB } from '@/model/indexedDbModel';
import { IChangeCurrentPageRequest } from "@/model/requestModel";
import { IContainerClass, MapMetaData } from '@/model/mapModel';
import { IBaseLocation } from '@/model/subentityModel';
import { map } from 'leaflet';
const Map = dynamic(() => import("@/component/mainpage/map"), { ssr: false });

// Initialize .ENV variable
const indexedDB_DBName: string = process.env.NEXT_PUBLIC_INDEXED_DB_NAME ?? "";
const indexedDB_DBVersion: number = +(process.env.NEXT_PUBLIC_INDEXED_DB_VERSION ?? "");
const indexedDB_UserStore: string = process.env.NEXT_PUBLIC_INDEXED_STORE_USER ?? "";
const indexedDB_UserKey: string = process.env.NEXT_PUBLIC_INDEXED_STORE_USER_KEY ?? "";
const indexedDB_ThemeStore: string = process.env.NEXT_PUBLIC_INDEXED_STORE_THEME ?? "";
const indexedDB_ThemeKey: string = process.env.NEXT_PUBLIC_INDEXED_STORE_THEME_KEY ?? "";
const indexedDB_MapStore: string = process.env.NEXT_PUBLIC_INDEXED_STORE_MAP ?? "";
const indexedDB_MapKey: string = process.env.NEXT_PUBLIC_INDEXED_STORE_MAP_KEY ?? "";
const baseUrlApi: string = process.env.NEXT_PUBLIC_BASEURL_API ?? "";
const developedBy: string = process.env.NEXT_PUBLIC_DEVELOPED_BY ?? "";
const softwareVersion: string = packageJson.version

// Initialize global const variable
const setDefaultDarkTheme: boolean = true;
const setDefaultMapTheme = MapTitleEnum.Default;
const setDefaultCurrentPage = PwaCurrentPageEnum.SplashScreen;
const containerClassObject: IContainerClass = {
    notMapClass: ["pt-4", "pb-5", "px-3"],
    mapClass: ["pt-3", "pb-0"]
}

// Add the custom CSS rule to change the popup and tip background color [ #F5F5F599, whitesmoke ]
const customPopupStyles = `
.leaflet-popup-content-wrapper, .leaflet-popup-tip {
    background-color: #F5F5F599;
}`;

export default function Home() {

    // react hook initialize
    const user = useRef<CurrentUserRef>({
        userId: "", 
        userName: "", 
        userLocation: {
            latitude: -1,
            longitude: -1
        } 
    });
    const isMountRound = useRef<boolean>(true);
    const isForceFetch = useRef<boolean>(false);
    const isDarkTheme = useRef<boolean>(setDefaultDarkTheme);
    const mapTheme = useRef<MapTitleEnum>(setDefaultMapTheme);
    const currentUpdateCard = useRef<IDisplayPlace>();
    const isMapPage = useRef<boolean>(setDefaultCurrentPage.toString() == PwaCurrentPageEnum.MapView.toString());
    const isUserFocusInMapPage = useRef<boolean>(false);
    const initialMarkerLocationMapPage = useRef<IBaseLocation>();

    const [currentPage, setCurrentPage] = useState<ICurrentPage>({ pageName: setDefaultCurrentPage });
    const [places, setPlaces] = useState<IDisplayPlace[]>();
    const [currentLocation, setCurrentLocation] = useState<GeolocationCoordinates>();
    const [cardOrderBy, setCardOrderBy] = useState<CardOrderByEnum>(CardOrderByEnum.CreateDateDESC);
    const [forceRerenderState, setForceRerenderState] = useState<boolean>(false);

    const ForceRerenderState = () => {
        setForceRerenderState(!forceRerenderState);
    }

    // Define a function to set up indexedDB
    const SetupIndexedDB = () => {

        return new Promise<ISetupIndexedDBModel>((resolve, reject) => {
            
            let themeStore: IDBObjectStore;
            let userStore: IDBObjectStore;
            let mapStore: IDBObjectStore;

            // check user Credentials -> open indexedDB
            const request = indexedDB.open(indexedDB_DBName, indexedDB_DBVersion);
        
            // open indexedDB error handler
            request.onerror = (event: Event) => {

                // reject the promise
                alert("Can't open indexedDB: " + event);

                // reject the promise
                reject();
            };
        
            // open with indexedDB Initialize handler
            request.onupgradeneeded = () => {

                // create currentUser / currentTheme store
                const dbContext = request.result;
                dbContext.createObjectStore(indexedDB_UserStore, { keyPath: indexedDB_UserKey });
                dbContext.createObjectStore(indexedDB_ThemeStore, { keyPath: indexedDB_ThemeKey });
                dbContext.createObjectStore(indexedDB_MapStore, { keyPath: indexedDB_MapKey });

                // fix background color theme when initailize indexedDB
                AdaptiveColorThemeHandler(isDarkTheme.current);

                // change to login page
                ChangeCurrentPage({ page: PwaCurrentPageEnum.Login });

                // reject the promise
                reject();
            }

            // open indexedDB success handler
            request.onsuccess = () => {

                // set up indexedDB
                const dbContext = request.result;
    
                // check theme store name is exist
                if (dbContext.objectStoreNames.contains(indexedDB_ThemeStore)) {
                    
                    // create transaction of indexedDB
                    const transaction = dbContext.transaction(indexedDB_ThemeStore, "readwrite");

                    // create store of indexedDB transaction and set it globle useRef
                    themeStore = transaction.objectStore(indexedDB_ThemeStore);

                    // #region ------------------------- Initialize default theme value

                    // try to get themeStore
                    const themeStoreResponse = themeStore.get(indexedDB_ThemeKey);

                    // set default theme as light theme if themeStore doesn't have any data
                    themeStoreResponse.onsuccess = () => {

                        if (!themeStoreResponse.result) {

                            themeStore.put({CurrentTheme: indexedDB_ThemeKey, isDarkTheme: isDarkTheme.current});
                        }
                    }

                    //  #endregion
                }

                // check map store name is exist
                if (dbContext.objectStoreNames.contains(indexedDB_MapStore)) {

                    const transaction = dbContext.transaction(indexedDB_MapStore, "readwrite");
                    mapStore = transaction.objectStore(indexedDB_MapStore);

                    // #region ------------------------- Initialize default map value

                    // try to get amp Store
                    const mapStoreResponse = mapStore.get(indexedDB_MapKey);

                    // set default theme as light theme if map doesn't have any data
                    mapStoreResponse.onsuccess = () => {

                        if (!mapStoreResponse.result) {

                            mapStore.put({CurrentMap: indexedDB_MapKey, mapTheme: mapTheme.current});
                        }
                    }

                    //  #endregion
                }

                // check use store name is exist
                if (dbContext.objectStoreNames.contains(indexedDB_UserStore)) {
    
                    // create transaction of indexedDB
                    const transaction = dbContext.transaction(indexedDB_UserStore, "readwrite");
                
                    // create store of indexedDB transaction and set it globle useRef
                    userStore = transaction.objectStore(indexedDB_UserStore);
                }
                else {
                    // change to login page
                    ChangeCurrentPage({ page: PwaCurrentPageEnum.Login });
                }

                // create response for two of store
                const response: ISetupIndexedDBModel = {
                    themeStore: themeStore,
                    userStore: userStore,
                    mapStore: mapStore
                }

                // resolve the store to promise 
                resolve(response)
            }
        });
    };

    // check user credential, fetch get place api, get current location
    useEffect(() => {

        // open indexedDB 
        SetupIndexedDB().then((store: ISetupIndexedDBModel) => {

            // #region ------------------------- Theme data

            // get current theme data from indexedDB
            const themeStoreResponse = store.themeStore.get(indexedDB_ThemeKey);

            // set isDarkTheme in useRef and change page Theme
            themeStoreResponse.onsuccess = () => {
    
                // if indexedDB doesn't have Theme data it will set default to false
                isDarkTheme.current = (themeStoreResponse.result as IThemeIndexedDB)?.isDarkTheme ?? setDefaultDarkTheme;

                // set dark theme if user use dark theme as default
                AdaptiveColorThemeHandler(isDarkTheme.current);

                ChangeCurrentPage({ page: PwaCurrentPageEnum.ReminderList });
            }

            // #endregion

            // #region ------------------------- Map data

            // get current map data from indexedDB
            const mapStoreResponse = store.mapStore.get(indexedDB_MapKey);

            // set default map in useRef
            mapStoreResponse.onsuccess = () => {

                // if indexedDB doesn't have map data it will set default
                mapTheme.current = (mapStoreResponse.result as IMapIndexedDB)?.mapTheme ?? setDefaultMapTheme;
            }

            // #endregion

            // #region ------------------------- user data

            // get current user from indexedDB
            const userStoreResponse = store.userStore.get(indexedDB_UserKey);

            // get fail handler
            userStoreResponse.onerror = () => {

                // change to login page
                ChangeCurrentPage({ page: PwaCurrentPageEnum.Login });
            }

            // get success handler
            userStoreResponse.onsuccess = () => {

                // set global current UserId and UserName
                const userIdResponse = (userStoreResponse.result as IUserIndexedDB)?.userId;
                const userNameResponse = (userStoreResponse.result as IUserIndexedDB)?.userName;

                if (IsStringValid(userIdResponse) && IsStringValid(userNameResponse)) {
                    
                    user.current.userId = userIdResponse;
                    user.current.userName = userNameResponse;

                    // get current location -> after get location it will call fetch place api (or get state of place if any) 
                    // for get place data with calculated distanceLocation.
                    const watchId = navigator.geolocation.watchPosition(IfGetLocationSuccess, IfGetLocationError, GetCustomGeoLocationOption());
                }
                else {

                    // change to login page
                    ChangeCurrentPage({ page: PwaCurrentPageEnum.Login });
                }
            }

            // #endregion
        });
    }, []);

    // useEffect for reFetch data
    useEffect(() => {

        // check if it SplashScreen page
        if (currentPage.pageName != PwaCurrentPageEnum.SplashScreen){

            // check if mount round
            if (!isMountRound.current) {

                if (currentPage.pageName == PwaCurrentPageEnum.ReminderList) {
                    // console.log(currentLocation);
                    FetchPlaceData();
                }            
            } 
            else {
                console.log("Mount Round!")
                isMountRound.current = false;
            }
        }

    }, [currentLocation, currentPage, cardOrderBy]);

    // fetch place data from api
    const FetchPlaceData = async () => {

        try {
            // check current user from global variable
            if (IsStringValid(user.current.userId)) {

                // initialize list of DisplayPlace
                let displayPlaces: IDisplayPlace[] = [];
                
                // check if palce [is not undefined], and [check if force fetch is enable]
                if (places && places.at(0)?.userId == user.current.userId && !isForceFetch.current) {

                    console.log("not fetch");

                    // calculate distance between
                    displayPlaces = CalculatePlaceForDisplay(places, user.current.userLocation);
                } 
                else {

                    // fetch get api
                    console.log("fetch get place api");
                    const response = await fetch(`${baseUrlApi}/place/?userId=${user.current.userId}`);
    
                    if (!response.ok) {
            
                        const errorMessage: ResponseModel = await response.json();
                        alert(`Error message: ${errorMessage.message}`);
                    }
                    else {

                        // reset isForceFetch ref data
                        isForceFetch.current = false;

                        const placeResponse: Place[] = await response.json();
                        console.log(placeResponse);
    
                        // calculate distance between and parse placeData to IDisplayPlaceData
                        displayPlaces = CalculatePlaceForDisplay(placeResponse, user.current.userLocation);
                    }
                }

                // order card of display place
                const orderedDiplayPlaces = OrderPlaceByDistance(displayPlaces, cardOrderBy);

                // set display place State
                setPlaces(orderedDiplayPlaces);
            }
            else {
                alert(`Error message: User not found.`);
            }
        }
        catch(error) {
            alert(error);
        }
    };

    // success case for Geolocation
    const IfGetLocationSuccess = (position: GeolocationPosition) => {
        
        console.log('success location');

        // set current user location
        user.current.userLocation.latitude = position.coords.latitude;
        user.current.userLocation.longitude = position.coords.longitude;

        setCurrentLocation(position.coords);
    };

    // error case for Geolocation
    const IfGetLocationError = (error : GeolocationPositionError) => {

        alert(`${error.code}: ${error.message}`)
    };

    // change Current page method
    const ChangeCurrentPage = (requestDto: IChangeCurrentPageRequest) => {

        // set force fetch in FetchData function
        if (requestDto.forceFetch != undefined) {
            isForceFetch.current = requestDto.forceFetch;
        }

        // set isMapPage if current page is map page
        SetIsMapPage(requestDto.page == PwaCurrentPageEnum.MapView);

        // change current page
        setCurrentPage({
            pageName: requestDto.page,
            successAlertBox: requestDto.successBox,
            backBtn: requestDto.backBtn
        });
    };

    const UserLoginHandler = async (setUser: CurrentUserRef) => {

        user.current.userId = setUser.userId;
        user.current.userName = setUser.userName;
        user.current.userLocation = setUser.userLocation;

        // open indexedDB
        const store = await SetupIndexedDB();

        const storeUser: IUserIndexedDB = {
            userId: setUser.userId,
            userName: setUser.userName
        }

        // store currentUser to indexedDB
        store.userStore.put({ CurrentUser: indexedDB_UserKey, ...storeUser });
    };

    const UserLogoutHandler = async () => {

        // change page to login page
        ChangeCurrentPage({ page: PwaCurrentPageEnum.Login });

        // open indexedDB and clear all record in userStore
        const store = await SetupIndexedDB();
        store.userStore.clear();
    }

    const DeletePlaceHandler = (placeId: string) => {
        setPlaces(places?.filter(e => e.id != placeId));
    };

    const ChangePlaceStatusHandler = (placeId: string, setIsDisable: boolean) => {

        setPlaces(places?.map(e => {

            if (e.id === placeId) {
                e.isDisable = setIsDisable;
            }

            return e;
        }));
    };

    const ChangeCardOrderByHandler = (orderBy: CardOrderByEnum) => {
        setCardOrderBy(orderBy);
    };

    const UpdatePlaceCardHandler = (placeId: string) => {
        
        // set cardId to Ref variable
        currentUpdateCard.current = places?.find(x => x.id == placeId);

        // change current page to UpdateCard
        ChangeCurrentPage({ page: PwaCurrentPageEnum.UpdateList });
    };

    const ChangeCurrentMapHandler = async (mapStyle: MapTitleEnum) => {

        // change map style ref variable
        mapTheme.current = mapStyle;

        // open indexedDB
        const store = await SetupIndexedDB();

        // insert theme data to indexedDB
        store.mapStore.put({CurrentMap: indexedDB_MapKey, mapTheme: mapStyle});

        // force rerender state
        ForceRerenderState();
    }

    const ChangeCurrentThemeHandler = async (isDarkThemeHandler: boolean) => {

        // change isDarkTheme ref variable
        isDarkTheme.current = isDarkThemeHandler;

        // set css theme by theme ref variable
        AdaptiveColorThemeHandler(isDarkTheme.current);

        // open indexedDB
        const store = await SetupIndexedDB();

        // insert theme data to indexedDB
        store.themeStore.put({CurrentTheme: indexedDB_ThemeKey, isDarkTheme: isDarkThemeHandler});

        // force rerender state
        ForceRerenderState();
    };

    const SetIsMapPage = (flag: boolean) => {

        isMapPage.current = flag;

        if (flag) {
            ForceRerenderState();
        }
    }

    const SetUserFocus = (isFocus: boolean) => {
        isUserFocusInMapPage.current  = isFocus;
    }

    const LinkCardToMapPageHandler = (placeId: string) => {

        const place = places?.find(x => x.id == placeId);

        // set initial user marker location
        if (place && place.latitude && place.longitude) {
            initialMarkerLocationMapPage.current = {
                latitude: place.latitude,
                longitude: place.longitude
            }
        }

        // set current page to map page
        ChangeCurrentPage({ page: PwaCurrentPageEnum.MapView });

        // set timeout for delay reset initial marker data when it used (0.5 sec)
        setTimeout(() => { initialMarkerLocationMapPage.current = undefined }, 500);
    }

    const AdaptiveColorThemeHandler = (isDarkTheme: boolean) => {

        // get all color theme by name
        const htmlElement: HTMLElement = document.getElementsByTagName("html")[0];
        const bodyElement: HTMLElement = document.getElementsByTagName("body")[0];

        if (isDarkTheme) {

            // BackGround 
            htmlElement.style.backgroundColor = "#36393e";
            bodyElement.style.backgroundColor = "#36393e";
        }
        else {

            // BackGround 
            htmlElement.style.backgroundColor = "#f5f5f5";
            bodyElement.style.backgroundColor = "#f5f5f5";
        }
    };

    // ------------------- [ Return JSX Element ] -------------------------

    if (currentPage.pageName == PwaCurrentPageEnum.SplashScreen) {
        return <SplashScreen softwareVersion={softwareVersion}></SplashScreen>
    }

    const containerClass = isMapPage.current 
        ? containerClassObject.mapClass.join(' ') 
        : containerClassObject.notMapClass.join(' ');

    return (
        <main> 
            <div className="container">
                <div id='containerId' className={containerClass}>
                    {
                        (() => {
                            switch (currentPage.pageName) {

                                case PwaCurrentPageEnum.ReminderList:
                                    return <List 
                                        places={places}
                                        currentUser={user.current}
                                        deletePlaceHandler={DeletePlaceHandler}  
                                        changePlaceStatusHandler={ChangePlaceStatusHandler}
                                        updatePlaceCardHandler={UpdatePlaceCardHandler}
                                        isDarkTheme={isDarkTheme.current}
                                        currentCardOrder={cardOrderBy}
                                        changeCardOrderByHandler={ChangeCardOrderByHandler}
                                        linkCardToMapPageHandler={LinkCardToMapPageHandler}
                                        baseUrlApi={baseUrlApi}
                                    ></List>

                                case PwaCurrentPageEnum.MapView:
                                    return <Map
                                        placeMarkers={GetPlaceMarkers(places)}
                                        user={user.current}
                                        initialMarkerLocation={initialMarkerLocationMapPage.current}
                                        mapAsset={MapMetaData.getMaptitle(mapTheme.current, isDarkTheme.current)}
                                        isDarkTheme={isDarkTheme.current}
                                        userFocusObj={{
                                            isfocus: isUserFocusInMapPage.current,
                                            setUserFocus: SetUserFocus
                                        }}
                                    ></Map>

                                case PwaCurrentPageEnum.AddList:
                                    return <AddList 
                                        user={user.current}
                                        changeCurrentPage={ChangeCurrentPage}
                                        places={places}
                                        mapAsset={MapMetaData.getMaptitle(mapTheme.current, isDarkTheme.current)}
                                        isDarkTheme={isDarkTheme.current}
                                        baseUrlApi={baseUrlApi}
                                        containerClassObject={containerClassObject}
                                        setIsMapPage={SetIsMapPage}
                                        userFocusObj={{
                                            isfocus: isUserFocusInMapPage.current,
                                            setUserFocus: SetUserFocus
                                        }}
                                    ></AddList>

                                case PwaCurrentPageEnum.UpdateList:
                                    if (currentUpdateCard.current) {
                                        return <UpdateList 
                                            user={user.current}
                                            places={places}
                                            cardData={currentUpdateCard.current}
                                            changeCurrentPage={ChangeCurrentPage}
                                            mapAsset={MapMetaData.getMaptitle(mapTheme.current, isDarkTheme.current)}
                                            isDarkTheme={isDarkTheme.current}
                                            baseUrlApi={baseUrlApi}
                                            containerClassObject={containerClassObject}
                                            setIsMapPage={SetIsMapPage}
                                            userFocusObj={{
                                                isfocus: isUserFocusInMapPage.current,
                                                setUserFocus: SetUserFocus
                                            }}
                                        ></UpdateList>
                                    }
                                    else {
                                        return <List 
                                            places={places}
                                            currentUser={user.current}
                                            deletePlaceHandler={DeletePlaceHandler}  
                                            changePlaceStatusHandler={ChangePlaceStatusHandler}
                                            updatePlaceCardHandler={UpdatePlaceCardHandler}
                                            isDarkTheme={isDarkTheme.current}
                                            currentCardOrder={cardOrderBy}
                                            changeCardOrderByHandler={ChangeCardOrderByHandler}
                                            linkCardToMapPageHandler={LinkCardToMapPageHandler}
                                            baseUrlApi={baseUrlApi}
                                        ></List>
                                    }

                                case PwaCurrentPageEnum.EvBattery:
                                    return <EvBattery></EvBattery>

                                case PwaCurrentPageEnum.Setting:
                                    return <Setting
                                        currentUserName={user.current.userName}
                                        changeCurrentPage={ChangeCurrentPage}
                                        changeThemeHandler={ChangeCurrentThemeHandler}
                                        isDarkTheme={isDarkTheme.current}
                                        userLogoutHandler={UserLogoutHandler}
                                        softwareVersion={softwareVersion}
                                        developedBy={developedBy}
                                        currentMap={mapTheme.current}
                                        changeCurrentMapHandler={ChangeCurrentMapHandler}
                                    ></Setting>

                                case PwaCurrentPageEnum.Login:
                                    return <Login 
                                        currentPage={currentPage}
                                        userLoginHandler={UserLoginHandler} 
                                        changeCurrentPage={ChangeCurrentPage}
                                        isDarkTheme={isDarkTheme.current}
                                        baseUrlApi={baseUrlApi}
                                    ></Login>

                                case PwaCurrentPageEnum.Register:
                                    return <Register
                                        changeCurrentPage={ChangeCurrentPage}
                                        isDarkTheme={isDarkTheme.current}
                                        baseUrlApi={baseUrlApi}
                                    ></Register>

                                case PwaCurrentPageEnum.Loading:
                                    return <Loading
                                        isDarkTheme={isDarkTheme.current}
                                    ></Loading>   
                            }
                        })()
                    }
                </div>
            </div>
            <br /><br />
            <Footer 
                isDarkTheme={isDarkTheme.current}
                changeCurrentPage={ChangeCurrentPage} 
                currentPageName={currentPage.pageName}
            ></Footer>
            
            {/* -=-=- [ Style Tag ] -=-=- */}
            <style>{customPopupStyles}</style>
        </main>
    )
}