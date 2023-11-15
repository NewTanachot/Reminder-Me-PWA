import dynamic from "next/dynamic";
import {IsStringValid, IsStringValidEmpty} from "@/extension/string_extension";
import {PwaCurrentPageEnum} from "@/model/enumModel";
import {IAddListProps} from "@/model/propsModel";
import {ResponseModel} from "@/model/responseModel";
import {IBaseLocation, PlaceExtensionModel} from "@/model/subentityModel";
import {FormEvent, useRef, useState} from "react";
import LoadingComponent from "../modalAsset/loading";
import { GetNewMarkerLocation, GetPlaceMarkers } from "@/extension/calculation_extension";
import { IUpsertFormData } from "@/model/useStateModel";
import { SetPageContainerClass } from "@/extension/style_extension";
const MapModal = dynamic(() => import("@/component/mapAsset/mapModal"), { ssr: false });

export default function AddList({ 
    user, 
    places, 
    changeCurrentPage, 
    mapAsset, 
    isDarkTheme, 
    baseUrlApi, 
    containerClassObject,
    setIsMapPage,
    userFocusObj
}: IAddListProps) {

    const [displayLoadingComponent, setDisplayLoadingComponent] = useState<boolean>(false);
    const [displayMapModal, setDisplayMapModal] = useState<boolean>(false);
    const formDataRef = useRef<IUpsertFormData>();

    // add place handler
    const AddNewPlace = async (event: FormEvent<HTMLFormElement>) => {

        // check current user from global variable   
        if (IsStringValid(user.userId)) {

            // show loading component
            setDisplayLoadingComponent(true);

            event.preventDefault();
            const formInput = new FormData(event.currentTarget);
        
            // get data from input form
            const placeNameInput = formInput.get("placeNameInput")?.toString();
            const latitudeInput = formInput.get("latitudeInput")?.toString();
            const longitudeInput = formInput.get("longitudeInput")?.toString();
            const reminderMessageInput = formInput.get("reminderMessageInput")?.toString();
            const reminderDateInput = formInput.get("reminderDateInput")?.toString();
            const isActiveInput = formInput.get("isActiveInput")?.toString();

            const latitude = IsStringValidEmpty(latitudeInput);
            const longitude = IsStringValidEmpty(longitudeInput);

            const newPlace: PlaceExtensionModel = {
                name: IsStringValidEmpty(placeNameInput),
                latitude: latitude != "" ? +latitude : undefined, // cast string to number
                longitude: longitude != "" ? +longitude : undefined, // cast string to number
                reminderMessage: reminderMessageInput,
                reminderDate: IsStringValid(reminderDateInput) ? new Date(reminderDateInput ?? "") : undefined,
                isDisable: !IsStringValid(isActiveInput), // if isActiveInput is "on" it return false
                userId: user.userId,
            }

            // fetch create place api
            const response = await fetch(`${baseUrlApi}/place`, {
                method: "POST",
                body: JSON.stringify(newPlace)
            });

            if (!response.ok) {
    
                const errorMessage: ResponseModel = await response.json();

                // hide loading component and alert error
                alert(`Error message: ${errorMessage.message}`);
                setDisplayLoadingComponent(false);
            }
            else {

                changeCurrentPage({
                    page: PwaCurrentPageEnum.ReminderList,
                    forceFetch: true
                });
            }
        }
        else {
            // hide loading component and alert error
            alert(`Error message: User not found.`);
            setDisplayLoadingComponent(false);
        }
    }

    // clear date in datepicker handler
    const ClearDatePickerFormHandler = () => {

        const reminderDateForm = document.getElementsByName("reminderDateInput")[0] as HTMLInputElement;
        reminderDateForm.value = "";
    }

    // clear location data
    const ClearLocationFormData = () => {
        
        const latitudeInput = document.getElementsByName("latitudeInput")[0] as HTMLInputElement;
        const longitudeInput = document.getElementsByName("longitudeInput")[0] as HTMLInputElement;

        latitudeInput.value = "";
        longitudeInput.value = "";
    }

    // mark location button handler
    const GoToMapModalPage = () => {

        const placeNameInput = document.getElementsByName("placeNameInput")[0] as HTMLInputElement;
        const reminderMessageInput = document.getElementsByName("reminderMessageInput")[0] as HTMLInputElement;
        const reminderDateInput = document.getElementsByName("reminderDateInput")[0] as HTMLInputElement;
        const isActiveInput = document.getElementsByName("isActiveInput")[0] as HTMLInputElement;
        const latitudeInput = document.getElementsByName("latitudeInput")[0] as HTMLInputElement;
        const longitudeInput = document.getElementsByName("longitudeInput")[0] as HTMLInputElement;
        
        // change container class to map page
        SetPageContainerClass(containerClassObject, true);

        formDataRef.current = {
            name: placeNameInput.value,
            message: reminderMessageInput.value,
            reminderDate: reminderDateInput.value,
            latitude: latitudeInput.value,
            longitude: longitudeInput.value,
            enableSwitch: isActiveInput.checked
        };

        // set go to page map
        setDisplayMapModal(true);
        setIsMapPage(true);
    }

    // confirm btn handler
    const AddLocationDataToRef = (location: IBaseLocation | undefined) => {

        // add Location to ref data
        if (formDataRef.current) {
            formDataRef.current.latitude = location?.latitude.toString();
            formDataRef.current.longitude = location?.longitude.toString();
        }

        // change container class to not map page
        SetPageContainerClass(containerClassObject, false);

        // back to form page
        setDisplayMapModal(false);
    }

    // cancle btn handler 
    const BackToFormPage = () => {
        
        // change container class to not map page
        SetPageContainerClass(containerClassObject, false);

        // back to form page
        setDisplayMapModal(false);
        setIsMapPage(false);
    }

    let formColorTheme: string;
    let cardColorTheme: string;
    let cardHeaderColorTheme: string;
    let textHeaderColorTheme: string;
    let submitBtnColorTheme: string;
    let switchBtnColorTheme: string;
    let cardBorderThemeColor: string;

    if (isDarkTheme) {
        formColorTheme = "bg-whitesmoke";
        cardColorTheme = "bg-mainGray";
        cardHeaderColorTheme = "bg-mainblack";
        textHeaderColorTheme = "text-whiteSmoke"
        submitBtnColorTheme = "bg-mainblack";
        switchBtnColorTheme = "custom-switch-dark";
        cardBorderThemeColor = "border-secondary";
    }
    else {
        formColorTheme = "bg-white";
        cardColorTheme = "bg-peach-65";
        cardHeaderColorTheme = "bg-warning-subtle";
        textHeaderColorTheme = "text-viridian-green";
        submitBtnColorTheme = "bg-viridian-green";
        switchBtnColorTheme = "custom-switch-light";
        cardBorderThemeColor = "";
    }

    const MapPage = <MapModal
        placeMarkers={GetPlaceMarkers(places)}
        user={user}
        mapAsset={mapAsset}
        newMarkerInitLocation={GetNewMarkerLocation(formDataRef.current)}
        backtoFormPage={BackToFormPage}
        addLocationDataToRef={AddLocationDataToRef}
        userFocusObj={userFocusObj}
        isDarkTheme={isDarkTheme}
    ></MapModal>

    const AddListPage = <>
        <LoadingComponent 
            isDarkTheme={isDarkTheme}
            isDisplay={displayLoadingComponent}
        ></LoadingComponent>
        <div className={`card shadow-sm ${cardBorderThemeColor} ${cardColorTheme}`}>
            <div className={`card-header ${cardHeaderColorTheme} ${textHeaderColorTheme} bg-gradient`}>
                <h4 className="m-0 text-center">Create new location</h4>
            </div>
            <form className="card-body m-2" onSubmit={AddNewPlace}>
                <div className="mb-3">
                    <p className="mb-1">
                        Name:<span className="text-danger">*</span>
                    </p>
                    <input 
                        type="text"
                        name="placeNameInput" 
                        className={`form-control w-100 shadow-sm ${formColorTheme}`} 
                        defaultValue={formDataRef.current?.name}
                        placeholder="..."
                        maxLength={50} 
                        required
                    />
                </div>
                <div className="mt-3">
                    <p className="mb-1">
                        Reminder Message:
                    </p>
                    <textarea 
                        name="reminderMessageInput" 
                        className={`form-control w-100 shadow-sm ${formColorTheme}`} 
                        defaultValue={formDataRef.current?.message}
                        placeholder="..."
                        maxLength={50} 
                        rows={2}
                    />
                </div>
                <div className="mt-3">
                    <p className="mb-1">
                        Reminder Date:
                    </p>
                    <div className="input-group">
                        <input 
                            type="date"
                            name="reminderDateInput" 
                            className={`form-control ${formColorTheme} shadow-sm`} 
                            defaultValue={formDataRef.current?.reminderDate}
                            placeholder="..."
                        />          
                        <div className={`input-group-text ${formColorTheme} shadow-sm`}>
                            <i 
                                className="fa-regular fa-trash-can text-mainblack"
                                onClick={ClearDatePickerFormHandler}
                            ></i>
                        </div>
                    </div>
                </div>
                <div className="mt-3">
                    <p className="mb-1">
                        Location:
                    </p>
                    <div className="input-group">
                        <input 
                            name="latitudeInput" 
                            className={`form-control ${formColorTheme} shadow-sm`} 
                            type="number" 
                            placeholder="..." 
                            defaultValue={formDataRef.current?.latitude}
                            step="any" 
                            min={0}
                        />
                        <input 
                            name="longitudeInput" 
                            className={`form-control ${formColorTheme} shadow-sm`} 
                            type="number" 
                            placeholder="..." 
                            defaultValue={formDataRef.current?.longitude}
                            step="any" 
                            min={0}
                        />
                    </div>
                </div>
                <div className="mt-3 d-flex justify-content-evenly">
                    <button
                        type="button"
                        className='btn btn-sm my-2 text-secondary border-secondary shadow-sm'
                        onClick={ClearLocationFormData}
                    >
                        <i className="fa-regular fa-trash-can me-2"></i>
                        Clear location
                    </button>
                    <button 
                        type="button"
                        className={`btn btn-sm my-2 text-white ${submitBtnColorTheme} shadow-sm bg-gradient`}
                        onClick={GoToMapModalPage}
                    >
                        <i className="fa-solid fa-map-location-dot me-2"></i>
                        Mark location
                    </button>
                </div>
                <div className="mt-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <p className="mb-1">Enable :</p>
                        <div className="form-check form-switch">
                            <input type="checkbox"
                                name="isActiveInput" 
                                className={`form-check-input ${switchBtnColorTheme}`}
                                defaultChecked={formDataRef.current?.enableSwitch ?? true}
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-4 text-center">
                    <button 
                        type="submit"
                        className={`btn btn-sm w-100 my-2 text-white ${submitBtnColorTheme} shadow-sm bg-gradient`}
                    >
                        Add
                    </button>
                </div>
            </form>
        </div>
    </>

    return displayMapModal ? MapPage : AddListPage;
}