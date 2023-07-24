'use client';

import { DecimalToNumber, IsStringValid, StringDateToDisplayDate } from '@/extension/string_extension';
import { CurrentUserRef, IDisplayPlace, IUserIndexedDB, PlaceExtensionModel } from '@/model/subentity_model';
import { ResponseModel } from '@/model/response_model';
import { Place } from '@prisma/client';
// import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { GetDistanceBetweenPlace, OrderPlaceByDistance } from '@/extension/calculation_extension';
import { PwaCurrentPage } from '@/model/enum_model';
import List from '@/component/mainpage/list';
import Navbar from '@/component/navbar';
import Map from '@/component/mainpage/map';
import Login from '@/component/mainpage/login';
import Register from '@/component/mainpage/register';
import Footer from '@/component/footer';
import AddList from '@/component/mainpage/addList';

// Initialize .ENV variable
const indexedDB_DBName: string = process.env.NEXT_PUBLIC_INDEXED_DB_NAME ?? "";
const indexedDB_DBVersion: number = +(process.env.NEXT_PUBLIC_INDEXED_DB_VERSION ?? "");
const indexedDB_UserStore: string = process.env.NEXT_PUBLIC_INDEXED_STORE_USER ?? "";
const indexedDB_UserKey: string = process.env.NEXT_PUBLIC_INDEXED_STORE_USER_KEY ?? "";
const baseUrlApi: string = process.env.NEXT_PUBLIC_BASEURL_API ?? "";

export default function Home() {

    // initialize router
    // const router = useRouter();

    // react hook initialize
    const user = useRef<CurrentUserRef>({ userId: "", userName: "" });
    const indexedDbUserStore = useRef<IDBObjectStore>();
    const isMountRound = useRef<boolean>(true);
    const skipIndexedDbOnSuccess = useRef<boolean>(false);
    const [currentPage, setCurrentPage] = useState<PwaCurrentPage>(PwaCurrentPage.ReminderList);
    const [places, setPlaces] = useState<IDisplayPlace[]>();
    const [currentLocation, setCurrentLocation] = useState<GeolocationCoordinates>();
    const [orderByDistance, setOrderByDistance] = useState<boolean>(true);

    // check user creadential, fetch get place api, get current location
    useEffect(() => {

        // check user Credentials -> open indexedDB
        const request = indexedDB.open(indexedDB_DBName, indexedDB_DBVersion);

        // open indexedDB error handler
        request.onerror = (event: Event) => {
            alert("Can't open indexedDB.");
        }

        // open with indexedDB Initialize handler
        request.onupgradeneeded = () => {

            // create currentUser store
            const dbContext = request.result;
            dbContext.createObjectStore(indexedDB_UserStore, { keyPath: indexedDB_UserKey });

            // set variable for skip onsuccess function
            skipIndexedDbOnSuccess.current = true;

            // change to login page
            setCurrentPage(PwaCurrentPage.Login);
            // router.replace('/auth/login');
        }

        // open indexedDB success handler
        request.onsuccess = () => {

            if (!skipIndexedDbOnSuccess.current)
            {
                // set up indexedDB
                const dbContext = request.result;
    
                // check store name is exist
                if (dbContext.objectStoreNames.contains(indexedDB_UserStore)) {
                    
                    // create transaction of indexedDB
                    const transaction = dbContext.transaction(indexedDB_UserStore, "readwrite")
                
                    // create store of indexedDB transaction and set it globle useRef
                    const store = transaction.objectStore(indexedDB_UserStore);
                    indexedDbUserStore.current = store;


                    // get current user from indexedDB
                    const response = indexedDbUserStore.current.get(indexedDB_UserKey);
        
                    // get fail handler
                    response.onerror = () => {
                        // change to login page
                        setCurrentPage(PwaCurrentPage.Login);
                        // router.replace('/auth/login');
                    }
        
                    // get success handler
                    response.onsuccess = () => {
        
                        // set global current UserId and UserName
                        user.current.userId = (response.result as IUserIndexedDB).id;
                        user.current.userName = (response.result as IUserIndexedDB).name;

                        // get current location -> after get location it will call fetch place api (or get state of place if any) for get place data with calculated distanceLocation.
                        const watchId = navigator.geolocation.watchPosition(IfGetLocationSuccess, IfGetLocationError, geoLocationOption);
                    }
                }
                else {
                    // change to login page
                    setCurrentPage(PwaCurrentPage.Login);
                    // router.replace('/auth/login');
                }
            }
        }

    }, [])

    // effect for update location Distanct and elogin handler
    useEffect(() => {

        // check if mount rount
        if (!isMountRound.current) {

            if (currentPage == PwaCurrentPage.ReminderList) {
                console.log(currentLocation);
                FetchPlaceData();
            }
            else {
                console.log("not list page");
            }
            
        } 
        else {
            console.log("Mount Round!")
            isMountRound.current = false;
        }

    }, [currentLocation, currentPage])


    // fetch place data from api
    const FetchPlaceData = async (isForceFetch: boolean = false) => {

        try {
            // check current user from global variable
            if (IsStringValid(user.current.userId)) {

                // initialize list of DisplayPlace
                let displayPlace: IDisplayPlace[] = [];
                
                // check if palce [is not undefined], and [check if force fetch is enable]
                if (places && places.at(0)?.userId == user.current.userId && !isForceFetch) {

                    console.log("not fetch");
                    displayPlace = places;
                } 
                else {

                    // fetch get api
                    console.log("fetch get place api");
                    const response = await fetch(`${baseUrlApi}/place/?userId=${user.current.userId}`);
    
                    if (!response.ok) {
            
                        const errorMessage: ResponseModel = await response.json();
                        alert(`Error message: ${errorMessage.message}`)
                    }
                    else {
                        const calculationPlace: Place[] = await response.json();
                        console.log(calculationPlace)
    
                        // find location distance
                        displayPlace = calculationPlace.map((e) => {
    
                            // get location distance for each place
                            const newTypePlace: IDisplayPlace = {
                                id: e.id,
                                name: e.name,
                                latitude: DecimalToNumber(e.latitude),
                                longitude: DecimalToNumber(e.longitude),
                                reminderMessage: e.reminderMessage,
                                reminderDate: StringDateToDisplayDate(e.reminderDate),
                                isDisable: e.isDisable,
                                createdAt: e.createdAt,
                                userId: e.userId,
                                locationDistance: GetDistanceBetweenPlace({
                                    latitude_1: currentLocation?.latitude,
                                    longitude_1: currentLocation?.longitude,
                                    latitude_2: DecimalToNumber(e.latitude),
                                    longitude_2: DecimalToNumber(e.longitude)
                                })
                            } 
    
                            return newTypePlace;
                        })
                    }
    
                    // set user State and check OrderBy distance
                    setPlaces(orderByDistance ? OrderPlaceByDistance(displayPlace) : displayPlace);
                }
            }
            else {
                alert(`Error message: User not found.`)
            }
        }
        catch(error) {
            alert(error)
        }
    }

    // success case for Geolocation
    const IfGetLocationSuccess = (position: GeolocationPosition) => {
        
        console.log('success location')
        setCurrentLocation(position.coords);
    }

    // error case for Geolocation
    const IfGetLocationError = (error : GeolocationPositionError) => {

        alert(`${error.code}: ${error.message}`)
    }

    // option srtting for Geolocation
    const geoLocationOption: PositionOptions = {
        enableHighAccuracy: true, // use hign accuraacy location
        timeout: 60000, // 60 sec or 1 min timeout
        maximumAge: 0, // no location cache
    }

    // add place handler
    const AddNewPlace = async () => {

        // check current user from global variable   
        if (IsStringValid(user.current.userId)) {

            // get data from input form
            const placeNameInput = document.getElementById("placeNameInput") as HTMLInputElement;
            const latitudeInput = document.getElementById("latitudeInput") as HTMLInputElement;
            const longitudeInput = document.getElementById("longitudeInput") as HTMLInputElement;
            const reminderMessageInput = document.getElementById("reminderMessageInput") as HTMLInputElement;
            const reminderDateInput = document.getElementById("reminderDateInput") as HTMLInputElement;

            const newPlace: PlaceExtensionModel = {
                name: placeNameInput.value,
                latitude: +latitudeInput.value, // cast string to number
                longitude: +longitudeInput.value, // cast string to number
                reminderMessage: IsStringValid(reminderMessageInput.value) ? reminderMessageInput.value : undefined,
                reminderDate: IsStringValid(reminderDateInput.value) ? new Date(reminderDateInput.value) : undefined,
                userId: user.current.userId,
            }

            // fetch creaet place api
            const response = await fetch(`${process.env.baseUrlApi}/place`, {
                method: "POST",
                body: JSON.stringify(newPlace)
            });

            if (!response.ok) {
    
                const errorMessage: ResponseModel = await response.json();
                alert(`Error message: ${errorMessage.message}`)
            }
            
            // set place state
            FetchPlaceData();
        }
        else {
            alert(`Error message: User not found.`)
        }
    }

    // change Current page method
    const ChangeCurrentPage = (page: PwaCurrentPage) => {
        setCurrentPage(page);
    }

    const SetCurrentUser = (setUser: CurrentUserRef) => {
        user.current.userId = setUser.userId;
        user.current.userName = setUser.userName;
    }

    const DeletePlaceHandler = (placeId: string) => {
        setPlaces(places?.filter(e => e.id != placeId));
    }

    const ChangePlaceStatusHandler = (placeId: string) => {

        setPlaces(places?.map(e => {

            if (e.id === placeId) {
                e.isDisable = !e.isDisable;
            }

            return e;
        }));
    }

    // change color theme
    // useEffect(() => {
    //     var a = document.getElementById("bgColor");
    //     if (a != null){
    //         console.log("not null")
    //         a.style.backgroundColor = "#36393e"
    //     }
    // }, [])

    return (
        <main>
            <Navbar 
                userName={user.current.userName} 
                currentPage={currentPage} 
                changeCurrentPage={ChangeCurrentPage}
            ></Navbar>
            <br /> <br />
            <div className="container">
                <div className='py-5 px-3'>
                    {
                        (() => {
                            switch (currentPage) {

                                case PwaCurrentPage.ReminderList:
                                    return <List 
                                        places={places}
                                        currentUserId={user.current.userId}
                                        deletePlaceHandler={DeletePlaceHandler}  
                                        changePlaceStatusHandler={ChangePlaceStatusHandler}
                                    ></List>

                                case PwaCurrentPage.MapView:
                                    return <Map></Map>

                                case PwaCurrentPage.AddList:
                                    return <AddList></AddList>

                                case PwaCurrentPage.Login:
                                    return <Login 
                                        setCurrentUser={SetCurrentUser} 
                                        changeCurrentPage={ChangeCurrentPage}
                                    ></Login>

                                case PwaCurrentPage.Register:
                                    return <Register></Register>
                            }
                        })()
                    }
                </div>
            </div>
            <br /><br />
            <Footer changeCurrentPage={ChangeCurrentPage} currentPage={currentPage}></Footer>
        </main>
    )
  }

              {/* {
                !IsStringValid(User.current.userId) ? 
                <h1>loading...</h1> : 
                <>
                    <div>
                        <Link href="/auth/login" replace={true}>Login</Link>
                        &nbsp; &nbsp; &nbsp;
                        <button onClick={UserLogout}>logout</button>
                        &nbsp; &nbsp; &nbsp;
                        <Link href="/auth/register">Register page</Link>
                    </div>
                    <div>
                        <ul>
                            {
                                places.length > 0 ?
                                places.map((place, index) => 
                                    <li key={index}>
                                        ({place.locationDistance}) - , 
                                        {place.name}, 
                                        {place.latitude?.toString()}, 
                                        {place.longitude?.toString()}, 
                                        {place.reminderMessage ?? "-"},
                                        {StringDateToDisplayDate(place.reminderDate)}
                                        <input type="checkbox" checked={!place.isDisable} onChange={() => ChangePlaceStatus(index, place.isDisable)}/>
                                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                                        <button onClick={DeletePlace} value={place.id}>delete</button>
                                    </li>
                                )
                                : <p>No place data...</p>
                            }
                        </ul>
                    </div>
                    <br />
                    <br />
                    <div>
                        <h2>Current location: {`${currentLocation?.latitude ?? '-'}, ${currentLocation?.longitude ?? '-'}`}</h2>
                    </div>
                    <br />
                    <br />
                    <div>
                        <div>
                            <h2>Add New Place</h2>
                            <p>PlaceName:</p>
                            <input id="placeNameInput" type="text" required/>
                            <p>Latitude:</p>
                            <input id="latitudeInput" type="number" step={.1} required/>
                            <p>Longitude:</p>
                            <input id="longitudeInput" type="number" step={.1} required/>
                            <p>Reminder Message:</p>
                            <input id="reminderMessageInput" type="text" required/>
                            <p>Reminder Date:</p>
                            <input id="reminderDateInput" type="date" required/>
                        </div>
                        <br />
                        <button onClick={AddNewPlace}>add place</button>
                    </div>
                </>
            } */}