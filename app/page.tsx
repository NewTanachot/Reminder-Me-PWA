'use client';

import { IsStringValid } from '@/extension/string_extension';
import { CurrentUserRef, ICurrentPage, IDisplayPlace } from '@/model/useStateModel';
import { ISetupIndexedDBModel, ResponseModel } from '@/model/responseModel';
import { Place } from '@prisma/client';
import { useEffect, useState, useRef } from 'react';
import { CalculatePlaceForDisplay, OrderPlaceByDistance } from '@/extension/calculation_extension';
import { CardOrderByEnum, PwaCurrentPageEnum } from '@/model/enumModel';
import { GetCustomGeoLocationOption } from '@/extension/api_extension';
import List from '@/component/mainpage/list';
import Navbar from '@/component/layoutAsset/navbar';
import Map from '@/component/mainpage/map';
import Login from '@/component/authPageAsset/login';
import Register from '@/component/authPageAsset/register';
import Footer from '@/component/layoutAsset/footer';
import AddList from '@/component/mainpage/addList';
import EvBattery from '@/component/mainpage/evbattery';
import Setting from '@/component/mainpage/setting';
import UpdateList from '@/component/mainpage/updateList';
import Loading from '@/component/modalAsset/loading';
import SplashScreen from '@/component/modalAsset/splashScreen';
import { IThemeIndexedDB, IUserIndexedDB } from '@/model/indexedDbModel';

// Initialize .ENV variable
const indexedDB_DBName: string = process.env.NEXT_PUBLIC_INDEXED_DB_NAME ?? "";
const indexedDB_DBVersion: number = +(process.env.NEXT_PUBLIC_INDEXED_DB_VERSION ?? "");
const indexedDB_UserStore: string = process.env.NEXT_PUBLIC_INDEXED_STORE_USER ?? "";
const indexedDB_UserKey: string = process.env.NEXT_PUBLIC_INDEXED_STORE_USER_KEY ?? "";
const indexedDB_ThemeStore: string = process.env.NEXT_PUBLIC_INDEXED_STORE_THEME ?? "";
const indexedDB_ThemeKey: string = process.env.NEXT_PUBLIC_INDEXED_STORE_THEME_KEY ?? "";
const baseUrlApi: string = process.env.NEXT_PUBLIC_BASEURL_API ?? "";

// Initialize global const variable
const setDefaultLightTheme: boolean = true;

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
    const isDarkTheme = useRef<boolean>(!setDefaultLightTheme);
    const currentUpdateCard = useRef<IDisplayPlace>();
    const [currentPage, setCurrentPage] = useState<ICurrentPage>({ pageName: PwaCurrentPageEnum.SplashScreen, successAlertBox: false });
    const [places, setPlaces] = useState<IDisplayPlace[]>();
    const [currentLocation, setCurrentLocation] = useState<GeolocationCoordinates>();
    const [cardOrderBy, setCardOrderBy] = useState<CardOrderByEnum>(CardOrderByEnum.CreateDate);
    const [forceRerenderState, setForceRerenderState] = useState<boolean>(false);

    const ForceRerenderState = () => {
        setForceRerenderState(!forceRerenderState);
    }

    // Define a function to set up indexedDB
    const SetupIndexedDB = () => {

        return new Promise<ISetupIndexedDBModel>((resolve, reject) => {
            
            let themeStore: IDBObjectStore;
            let userStore: IDBObjectStore;

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

                // change to login page
                ChangeCurrentPage(PwaCurrentPageEnum.Login);

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

                // check use store name is exist
                if (dbContext.objectStoreNames.contains(indexedDB_UserStore)) {
    
                    // create transaction of indexedDB
                    const transaction = dbContext.transaction(indexedDB_UserStore, "readwrite");
                
                    // create store of indexedDB transaction and set it globle useRef
                    userStore = transaction.objectStore(indexedDB_UserStore);
                }
                else {
                    // change to login page
                    ChangeCurrentPage(PwaCurrentPageEnum.Login);
                }

                // create response for two of store
                const response: ISetupIndexedDBModel = {
                    themeStore: themeStore,
                    userStore: userStore
                }

                // resolve the store to promise 
                resolve(response)
            }
        });
    };

    // check user creadential, fetch get place api, get current location
    useEffect(() => {

        // open indexedDB 
        SetupIndexedDB().then((store: ISetupIndexedDBModel) => {

            // get current theme data from indexedDB
            const themeStoreResponse = store.themeStore.get(indexedDB_ThemeKey);

            // set isDarkTheme in useRef and change page Theme
            themeStoreResponse.onsuccess = () => {
    
                // if indexedDB doesn't have Theme data it will set default to false
                isDarkTheme.current = (themeStoreResponse.result as IThemeIndexedDB)?.isDarkTheme ?? false

                // set dark theme if user use dark theme as default
                if (isDarkTheme.current) {

                    AdaptiveColorThemeHandler(isDarkTheme.current)
                }
                
                ChangeCurrentPage(PwaCurrentPageEnum.ReminderList);
            }

            // get current user from indexedDB
            const userStoreResponse = store.userStore.get(indexedDB_UserKey);

            // get fail handler
            userStoreResponse.onerror = () => {

                // change to login page
                ChangeCurrentPage(PwaCurrentPageEnum.Login);
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
                    ChangeCurrentPage(PwaCurrentPageEnum.Login);
                }
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
                    console.log(currentLocation);
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
    const ChangeCurrentPage = (page: PwaCurrentPageEnum, successBox: boolean = false, forceFetch = false) => {

        // set force fetch in FetchData function
        isForceFetch.current = forceFetch;

        // change current page
        setCurrentPage({
            pageName: page,
            successAlertBox: successBox
        });
    };

    const UserLoginHandler = async (setUser: CurrentUserRef) => {

        user.current.userId = setUser.userId;
        user.current.userName = setUser.userName;
        user.current.userLocation = setUser.userLocation;

        // open indexedDB
        const store = await SetupIndexedDB();

        // store currentUser to indexedDB
        // store.userStore.put({ CurrentUser: indexedDB_UserKey, ...user });

        const storeUser: IUserIndexedDB = {
            userId: setUser.userId,
            userName: setUser.userName
        }

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

    const UpdatePlaceCardHandler = (cardId: string) => {
        
        // set cardId to Ref variable
        currentUpdateCard.current = places?.find(x => x.id == cardId);

        // change current page to UpdateCard
        ChangeCurrentPage(PwaCurrentPageEnum.UpdateList);
    };

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
        return <SplashScreen></SplashScreen>
    }

    return (
        <main>
            {/* <Navbar 
                isDarkTheme={isDarkTheme.current}
                currentPageName={currentPage.pageName} 
                orderByDistanceValue={orderByDistance}
                changeOrderByDistanceHandler={ChangeOrderByDistanceHandler}
            ></Navbar>
            <br /> <br /> */}
            
            <div className="container">
                <div className='pt-4 pb-5 px-3'>
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
                                        changeCardOrderByHandler={ChangeCardOrderByHandler}
                                    ></List>

                                case PwaCurrentPageEnum.MapView:
                                    return <Map></Map>

                                case PwaCurrentPageEnum.AddList:
                                    return <AddList 
                                        userId={user.current.userId}
                                        changeCurrentPage={ChangeCurrentPage}
                                        isDarkTheme={isDarkTheme.current}
                                    ></AddList>

                                case PwaCurrentPageEnum.UpdateList:
                                    if (currentUpdateCard.current) {
                                        return <UpdateList 
                                            cardData={currentUpdateCard.current}
                                            changeCurrentPage={ChangeCurrentPage}
                                            isDarkTheme={isDarkTheme.current}
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
                                            changeCardOrderByHandler={ChangeCardOrderByHandler}
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
                                    ></Setting>

                                case PwaCurrentPageEnum.Login:
                                    return <Login 
                                        currentPage={currentPage}
                                        userLoginHandler={UserLoginHandler} 
                                        changeCurrentPage={ChangeCurrentPage}
                                        isDarkTheme={isDarkTheme.current}
                                    ></Login>

                                case PwaCurrentPageEnum.Register:
                                    return <Register
                                        changeCurrentPage={ChangeCurrentPage}
                                        isDarkTheme={isDarkTheme.current}
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
        </main>
    )
}