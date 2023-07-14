'use client';

import { DecimalToNumber, IsStringValid, StringDateToDisplayDate } from '@/extension/string_extension';
import { CurrentUserRef, IDisplayPlace, IUserIndexedDB, PlaceExtensionModel, UpdatePlace } from '@/model/subentity_model';
import { ResponseModel } from '@/model/response_model';
import { Place } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { MouseEvent, useEffect, useState, useRef } from 'react';
import { GetDistanceBetweenPlace, OrderPlaceByDistance } from '@/extension/calculation_extension';
import PlaceCard from '@/component/placeCard';
import { PwaCurrentPage } from '@/model/enum_model';
import List from '@/component/mainpage/list';
import Navbar from '@/component/navbar';
import Map from '@/component/mainpage/map';
import Login from '@/component/mainpage/login';
import Register from '@/component/mainpage/register';

// Initialize .ENV variable
const indexedDB_DBName: string = process.env.NEXT_PUBLIC_INDEXED_DB_NAME ?? "";
const indexedDB_DBVersion: number = +(process.env.NEXT_PUBLIC_INDEXED_DB_VERSION ?? "");
const indexedDB_UserStore: string = process.env.NEXT_PUBLIC_INDEXED_STORE_USER ?? "";
const indexedDB_UserKey: string = process.env.NEXT_PUBLIC_INDEXED_STORE_USER_KEY ?? "";
const baseUrlApi: string = process.env.NEXT_PUBLIC_BASEURL_API ?? "";

export default function Home() {

    // initialize router
    const router = useRouter();

    // react hook initialize
    const user = useRef<CurrentUserRef>({ userId: "", userName: "" });
    const isMountRound = useRef<boolean>(true);
    const skipIndexedDbOnSuccess = useRef<boolean>(false);
    const [currentPage, setCurrentPage] = useState<PwaCurrentPage>(PwaCurrentPage.list);
    const [places, setPlaces] = useState<IDisplayPlace[]>([]);
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
            console.log();

            // create currentUser store
            const dbContext = request.result;
            dbContext.createObjectStore(indexedDB_UserStore, { keyPath: indexedDB_UserKey });

            // set variable for skip onsuccess function
            skipIndexedDbOnSuccess.current = true;

            // Reroute to login page
            router.replace('/auth/login');
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
                
                    // create store of indexedDB transaction
                    const store = transaction.objectStore(indexedDB_UserStore);
                
                    // get current user from indexedDB
                    const response = store.get(indexedDB_UserKey);
        
                    // get fail handler
                    response.onerror = () => {
                        router.replace('/auth/login');
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
                    router.replace('/auth/login');
                }
            }
        }

    }, [])

    // effect for update location Distanct
    useEffect(() => {

        // check if mount rount
        if (!isMountRound.current) {

            console.log(currentLocation)
            FetchPlaceData();
        } 
        else {

            console.log("Mount round!")
            isMountRound.current = false;
        }

    }, [currentLocation])

    // fetch place data from api
    const FetchPlaceData = async () => {

        try {
            // check current user from global variable
            if (IsStringValid(user.current.userId)) {

                // initialize list of DisplayPlace
                let displayPlace: IDisplayPlace[] = [];
                
                // check if palce exist (more than 0 record)
                if (places.length > 0) {
                    
                    console.log("not fetch")
                    displayPlace = places;
                } 
                else {

                    // fetch get api
                    const response = await fetch(`${baseUrlApi}/place/?userId=${user.current.userId}`);

                    if (!response.ok) {
            
                        const errorMessage: ResponseModel = await response.json();
                        alert(`Error message: ${errorMessage.message}`)
                    }
                    else {
                        console.log("fetch get place api");
                        const calculationPlace: Place[] = await response.json();

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
                }

                // set user State and check OrderBy distance
                setPlaces(orderByDistance ? OrderPlaceByDistance(displayPlace) : displayPlace);
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

    // logout handler
    const UserLogout = () => {
        alert("You are logout...");
        router.replace('/auth/login');
    }

    // delete place handler
    const DeletePlace = async (event : MouseEvent<HTMLButtonElement>): Promise<void> => {

        // get placeId
        const placeId = event.currentTarget.value;

        // fetch delete api
        const response = await fetch(`${baseUrlApi}/place/${placeId}`, { method: "DELETE" });

        if (!response.ok) {

            const errorMessage: ResponseModel = await response.json();
            alert(`Error message: ${errorMessage.message}`)
        }

        // set User state
        setPlaces(places.filter(e => e.id != placeId));
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

    // change color theme
    // useEffect(() => {
    //     var a = document.getElementById("bgColor");
    //     if (a != null){
    //         console.log("not null")
    //         a.style.backgroundColor = "#36393e"
    //     }
    // }, [])

    return (
        <main id='bgColor' className='bg-whitesmoke'>

            {/* === [ Navbar ] === */}
            <Navbar userName={user.current.userName} currentPage={currentPage} changeCurrentPage={ChangeCurrentPage}></Navbar>

            <div className="container">
                <div className='py-5 px-3'>
                    {
                        (() => {
                            switch (currentPage) {

                                case PwaCurrentPage.list:
                                    return <List places={places}></List>

                                case PwaCurrentPage.map:
                                    return <Map></Map>

                                case PwaCurrentPage.login:
                                    return <Login></Login>

                                case PwaCurrentPage.register:
                                    return <Register></Register>
                            }
                        })()
                    }
                </div>
            </div>

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
        </main>
    )
  }