'use client';

import packageJson from '@/package.json';
import { DateTimeToDisplayString, IsStringValid } from '@/extension/string_extension';
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
import UpsertList from '@/component/mainpage/upsertList';
import EvBattery from '@/component/mainpage/evbattery';
import Setting from '@/component/mainpage/setting';
import Loading from '@/component/mainpage/loading';
import SplashScreen from '@/component/modalAsset/splashScreen';
import { ICacheIndexedDB, IMapIndexedDB, IThemeIndexedDB, IUserIndexedDB } from '@/model/indexedDbModel';
import { IChangeCurrentPageRequest } from "@/model/requestModel";
import { MapMetaData } from '@/model/mapModel';
import { IBaseLocation } from '@/model/subentityModel';
import { GetStringContainerClassObject, SetAppBackgroundColorHandler } from '@/extension/style_extension';
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
const indexedDB_CacheStore: string = process.env.NEXT_PUBLIC_INDEXED_STORE_CACHE ?? "";
const indexedDB_CacheKey: string = process.env.NEXT_PUBLIC_INDEXED_STORE_CACHE_KEY ?? "";
const baseUrlApi: string = process.env.NEXT_PUBLIC_BASEURL_API ?? "";
const developedBy: string = process.env.NEXT_PUBLIC_DEVELOPED_BY ?? "";
const softwareVersion: string = packageJson.version

// Initialize global const variable
const setDefaultDarkTheme: boolean = true;
const setDefaultMapTheme = MapTitleEnum.Default;
const setDefaultCurrentPage = PwaCurrentPageEnum.SplashScreen;
const setMyUserToDefaultUser: boolean = true; 
const defaultUserStore: IUserIndexedDB = {
    userId: "cljg1wriz00025hlz6u7kzzgi",
    userName: "new"
}
const resolutionAlert = `This site was developed for mobile first. So I set the width in mobile resolution.

    1 Open this site in mobile.
    2 Add to home screen to use this site as native application.
    -------- OR --------
    F12 and set to mobile resolution.
`

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
    const lastCacheClearing = useRef<string>(DateTimeToDisplayString(new Date()));

    const [currentPage, setCurrentPage] = useState<ICurrentPage>({ pageName: setDefaultCurrentPage });
    const [places, setPlaces] = useState<IDisplayPlace[]>();
    const [currentLocation, setCurrentLocation] = useState<GeolocationCoordinates>();
    const [cardOrderBy, setCardOrderBy] = useState<CardOrderByEnum>(CardOrderByEnum.CreateDateDESC);
    const [forceRerenderState, setForceRerenderState] = useState<boolean>(false);

    // force useState to re render function
    const ForceRerenderState = () => {
        setForceRerenderState(!forceRerenderState);
    }

    // Define a function to set up indexedDB
    const SetupIndexedDB = () => {

        return new Promise<ISetupIndexedDBModel>((resolve, reject) => {
            
            let themeStore: IDBObjectStore;
            let userStore: IDBObjectStore;
            let mapStore: IDBObjectStore;
            let cacheStore: IDBObjectStore;

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

                // create currentUser
                const dbContext = request.result;

                // create user store
                userStore = dbContext.createObjectStore(indexedDB_UserStore, { keyPath: indexedDB_UserKey });

                // create and setup theme store
                themeStore = dbContext.createObjectStore(indexedDB_ThemeStore, { keyPath: indexedDB_ThemeKey });
                themeStore.put({CurrentTheme: indexedDB_ThemeKey, isDarkTheme: isDarkTheme.current});

                // create and setup map store
                mapStore = dbContext.createObjectStore(indexedDB_MapStore, { keyPath: indexedDB_MapKey });
                mapStore.put({CurrentMap: indexedDB_MapKey, mapTheme: mapTheme.current});

                // create and setup cache store
                cacheStore = dbContext.createObjectStore(indexedDB_CacheStore, { keyPath: indexedDB_CacheKey });
                cacheStore.put({CacheKey: indexedDB_CacheKey, lastCacheClearing: lastCacheClearing.current });

                if (setMyUserToDefaultUser) {            
                    userStore.put({ CurrentUser: indexedDB_UserKey, ...defaultUserStore });
                }
                else {
                    // change to login page
                    ChangeCurrentPage({ page: PwaCurrentPageEnum.Login });
                }

                // reject the promise
                reject();
            }

            // open indexedDB success handler
            request.onsuccess = () => {

                // set up indexedDB
                const indexedDbContext = request.result;
    
                // check theme store name is exist
                if (indexedDbContext.objectStoreNames.contains(indexedDB_ThemeStore)) {
                    
                    const transaction = indexedDbContext.transaction(indexedDB_ThemeStore, "readwrite");
                    themeStore = transaction.objectStore(indexedDB_ThemeStore);
                }

                // check map store name is exist
                if (!mapStore && indexedDbContext.objectStoreNames.contains(indexedDB_MapStore)) {

                    const transaction = indexedDbContext.transaction(indexedDB_MapStore, "readwrite");
                    mapStore = transaction.objectStore(indexedDB_MapStore);
                }

                // check cache store name is exist
                if (!cacheStore && indexedDbContext.objectStoreNames.contains(indexedDB_CacheStore)) {

                    const transaction = indexedDbContext.transaction(indexedDB_CacheStore, "readonly");
                    cacheStore = transaction.objectStore(indexedDB_CacheStore);                    
                }

                // check user store name is exist [user store always should be bottom list of store]
                if (!userStore && indexedDbContext.objectStoreNames.contains(indexedDB_UserStore)) {
    
                    const transaction = indexedDbContext.transaction(indexedDB_UserStore, "readwrite");
                    userStore = transaction.objectStore(indexedDB_UserStore);
                }
                else {
                    setMyUserToDefaultUser 
                        ? window.location.reload() 
                        : ChangeCurrentPage({ page: PwaCurrentPageEnum.Login });
                }

                // create response for two of store
                const response: ISetupIndexedDBModel = {
                    themeStore: themeStore,
                    userStore: userStore,
                    mapStore: mapStore,
                    cacheStore: cacheStore
                }

                // resolve the store to promise 
                resolve(response)
            }
        });
    };

    // Define a function to delete indexedDB
    const DeleteIndexedDB = () => {
        
        const result = indexedDB.deleteDatabase(indexedDB_DBName);

        // reload this page to trigger set indexedDB again [ even it blocked.. ]
        result.onsuccess = () => window.location.reload();  
        result.onblocked = () => window.location.reload();  

        result.onerror = (event: any) => {
            alert(`Error deleting indexedDB - ${event.target.error}`);
        };
    };

    // check user credential, fetch get place api, get current location
    useEffect(() => {

        // open indexedDB 
        SetupIndexedDB().then((store: ISetupIndexedDBModel) => {

            // #region ------------------------- Theme data

            // get theme store from indexedDB
            const themeStoreResponse = store.themeStore.get(indexedDB_ThemeKey);

            // set isDarkTheme in useRef and change page Theme
            themeStoreResponse.onsuccess = () => {
    
                // if indexedDB doesn't have Theme data it will set default to false
                isDarkTheme.current = (themeStoreResponse.result as IThemeIndexedDB)?.isDarkTheme ?? setDefaultDarkTheme;

                // set timeout for change currnt page from Splash Screen to ReminderList page (0.5 sec)
                setTimeout(() => { 
                    ChangeCurrentPage({ page: PwaCurrentPageEnum.ReminderList });
                }, 500);
            }

            // #endregion

            // #region ------------------------- Map data

            // get map store from indexedDB
            const mapStoreResponse = store.mapStore.get(indexedDB_MapKey);

            // set default map in useRef
            mapStoreResponse.onsuccess = () => {

                // if indexedDB doesn't have map data it will set default
                mapTheme.current = (mapStoreResponse.result as IMapIndexedDB)?.mapTheme ?? setDefaultMapTheme;
            }

            // #endregion

            // #region ------------------------- cache data

            // get cache store from indexedDB
            const cacheStoreResponse = store.cacheStore.get(indexedDB_CacheKey);

            // set lastCacheClearing data in useRef
            cacheStoreResponse.onsuccess = () => {

                lastCacheClearing.current = (cacheStoreResponse.result as ICacheIndexedDB)?.lastCacheClearing;
            }

            // #endregion

            // #region ------------------------- user data

            // get current user Store from indexedDB
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
                    if (setMyUserToDefaultUser) {
                        store.userStore.put({ CurrentUser: indexedDB_UserKey, ...defaultUserStore });
                        window.location.reload()                        
                    }
                    else {
                        ChangeCurrentPage({ page: PwaCurrentPageEnum.Login });
                    }
                }
            }

            // #endregion

            // alert user info about window size (mobile first)
            if (window.innerWidth > 400) {
                alert(resolutionAlert);
            }
        });
    }, []);

    // useEffect for reFetch data
    useEffect(() => {

        // check if it SplashScreen page
        if (currentPage.pageName != PwaCurrentPageEnum.SplashScreen){

            // check if mount round
            if (!isMountRound.current) {

                if (currentPage.pageName == PwaCurrentPageEnum.ReminderList) {
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

        if (currentPage.pageName != requestDto.page) {
            
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
        }
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
        ChangeCurrentPage({ page: PwaCurrentPageEnum.UpdateCard });
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
        SetAppBackgroundColorHandler(isDarkTheme.current, isMapPage.current, mapTheme.current, true);

        // open indexedDB
        const store = await SetupIndexedDB();

        // insert theme data to indexedDB
        store.themeStore.put({CurrentTheme: indexedDB_ThemeKey, isDarkTheme: isDarkThemeHandler});

        // force rerender state
        ForceRerenderState();
    };

    const SetIsMapPage = (flag: boolean) => {
        isMapPage.current = flag;  
        ForceRerenderState();
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

        // set user focus to flase
        SetUserFocus(false);

        // set timeout for delay reset initial marker data when it used (0.5 sec)
        setTimeout(() => { initialMarkerLocationMapPage.current = undefined }, 500);
    }

    // ------------------- [ Return JSX Element ] -------------------------

    // get container css class and set app bg-Color
    const containerClass = GetStringContainerClassObject(isMapPage.current);
    SetAppBackgroundColorHandler(isDarkTheme.current, isMapPage.current, mapTheme.current);

    const mainApp = (
        <main> 
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

                            case PwaCurrentPageEnum.CreateCard:
                                return <UpsertList 
                                    user={user.current}
                                    changeCurrentPage={ChangeCurrentPage}
                                    places={places}
                                    mapAsset={MapMetaData.getMaptitle(mapTheme.current, isDarkTheme.current)}
                                    isDarkTheme={isDarkTheme.current}
                                    baseUrlApi={baseUrlApi}
                                    setIsMapPage={SetIsMapPage}
                                    userFocusObj={{
                                        isfocus: isUserFocusInMapPage.current,
                                        setUserFocus: SetUserFocus
                                    }}
                                ></UpsertList>

                            case PwaCurrentPageEnum.UpdateCard:
                                return <UpsertList 
                                    user={user.current}
                                    changeCurrentPage={ChangeCurrentPage}
                                    cardData={currentUpdateCard.current}
                                    places={places}
                                    mapAsset={MapMetaData.getMaptitle(mapTheme.current, isDarkTheme.current)}
                                    isDarkTheme={isDarkTheme.current}
                                    baseUrlApi={baseUrlApi}
                                    setIsMapPage={SetIsMapPage}
                                    userFocusObj={{
                                        isfocus: isUserFocusInMapPage.current,
                                        setUserFocus: SetUserFocus
                                    }}
                                ></UpsertList>

                            case PwaCurrentPageEnum.EvBattery:
                                return <EvBattery></EvBattery>

                            case PwaCurrentPageEnum.Setting:
                                return <Setting
                                    currentUserName={user.current.userName}
                                    changeCurrentPage={ChangeCurrentPage}
                                    changeThemeHandler={ChangeCurrentThemeHandler}
                                    isDarkTheme={isDarkTheme.current}
                                    softwareVersion={softwareVersion}
                                    developedBy={developedBy}
                                    currentMap={mapTheme.current}
                                    changeCurrentMapHandler={ChangeCurrentMapHandler}
                                    lastCacheClearing={lastCacheClearing.current}
                                    deleteIndexedDB={DeleteIndexedDB}
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
                                    currentPage={currentPage}
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
            <br /><br />
            <Footer
                isDarkTheme={isDarkTheme.current}
                isMapPage={isMapPage.current}
                changeCurrentPage={ChangeCurrentPage} 
                currentPageName={currentPage.pageName}
            ></Footer>
            
            {/* -=-=- [ Style Tag ] -=-=- */}
            <style>{MapMetaData.getPopupStyle()}</style>
        </main>
    )

    return currentPage.pageName == PwaCurrentPageEnum.SplashScreen
        ? <SplashScreen softwareVersion={softwareVersion}></SplashScreen>
        : mainApp
}