import { DisplayStringDateToUpdateForm, IsStringValid, IsStringValidEmpty } from "@/extension/string_extension";
import { PwaCurrentPageEnum } from "@/model/enumModel";
import { IUpdateListProps } from "@/model/propsModel";
import { ResponseModel } from "@/model/responseModel";
import { IBaseLocation, UpdatePlace } from "@/model/subentityModel";
import { FormEvent, useRef, useState } from "react";
import LoadingComponent from "../modalAsset/loading";
import { IUpsertFormData } from "@/model/useStateModel";
import dynamic from "next/dynamic";
import { GetNewMarkerLocation, GetPlaceMarkers } from "@/extension/calculation_extension";
import { SetPageContainerClass } from "@/extension/style_extension";
const MapModal = dynamic(() => import("@/component/mapAsset/mapModal"), { ssr: false });

export default function UpdateList({
    user,
    places,
    cardData, 
    changeCurrentPage, 
    containerClassObject,
    setIsMapPage,
    mapAsset,
    userFocusObj,
    isDarkTheme, 
    baseUrlApi
}: IUpdateListProps) {

    const [displayLoadingComponent, setDisplayLoadingComponent] = useState<boolean>(false);
    const [displayMapModal, setDisplayMapModal] = useState<boolean>(false);
    const formDataRef = useRef<IUpsertFormData>({
        name: cardData.name,
        message: cardData.reminderMessage ?? undefined,
        reminderDate: DisplayStringDateToUpdateForm(cardData.reminderDate) ?? "",
        latitude: cardData.latitude?.toString(),
        longitude: cardData.longitude?.toString(),
        enableSwitch: !cardData.isDisable
    });

    // add place handler
    const UpdatePlace = async (event: FormEvent<HTMLFormElement>) => {

        // show loading component
        setDisplayLoadingComponent(true);

        event.preventDefault();
        const formInput = new FormData(event.currentTarget);
    
        // get data from input form
        const placeNameInput = formInput.get("placeNameInputUpdate")?.toString();
        const latitudeInput = formInput.get("latitudeInputUpdate")?.toString();
        const longitudeInput = formInput.get("longitudeInputUpdate")?.toString();
        const reminderMessageInput = formInput.get("reminderMessageInputUpdate")?.toString();
        const reminderDateInput = formInput.get("reminderDateInputUpdate")?.toString();
        const isActiveInput = formInput.get("isActiveInputUpdate")?.toString();

        const latitude = IsStringValidEmpty(latitudeInput);
        const longitude = IsStringValidEmpty(longitudeInput);

        const updatePlace: UpdatePlace = {
            id: cardData.id,
            name: IsStringValidEmpty(placeNameInput),
            latitude: latitude != "" ? +latitude : undefined, // cast string to number
            longitude: longitude != "" ? +longitude : undefined, // cast string to number
            reminderMessage: reminderMessageInput,
            reminderDate: IsStringValid(reminderDateInput) ? new Date(reminderDateInput ?? "") : undefined,
            isDisable: !IsStringValid(isActiveInput), // if isActiveInput is "on" it return false
            userId: cardData.userId,
        }

        // fetch create place api
        const response = await fetch(`${baseUrlApi}/place`, {
            method: "PUT",
            body: JSON.stringify(updatePlace)
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

    // back button handler
    const backButtonHandler = () => {
        changeCurrentPage({ page: PwaCurrentPageEnum.ReminderList });
    }

    // clear date in datepicker handler
    const ClearDatePickerFormHandler = () => {

        const reminderDateForm = document.getElementsByName("reminderDateInputUpdate")[0] as HTMLInputElement;

        if (reminderDateForm) {
            reminderDateForm.value = "";
        }
    }

    // mark location button handler
    const GoToMapModalPage = () => {

        const placeNameInput = document.getElementsByName("placeNameInputUpdate")[0] as HTMLInputElement;
        const reminderMessageInput = document.getElementsByName("reminderMessageInputUpdate")[0] as HTMLInputElement;
        const reminderDateInput = document.getElementsByName("reminderDateInputUpdate")[0] as HTMLInputElement;
        const isActiveInput = document.getElementsByName("isActiveInputUpdate")[0] as HTMLInputElement;
        const latitudeInput = document.getElementsByName("latitudeInputUpdate")[0] as HTMLInputElement;
        const longitudeInput = document.getElementsByName("longitudeInputUpdate")[0] as HTMLInputElement;

        formDataRef.current = {
            name: placeNameInput.value,
            message: reminderMessageInput.value,
            reminderDate: reminderDateInput.value,
            latitude: latitudeInput.value,
            longitude: longitudeInput.value,
            enableSwitch: isActiveInput.checked
        };

        // change container class to map page
        SetPageContainerClass(containerClassObject, true);

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

        // change container class to map page
        SetPageContainerClass(containerClassObject, false);

        // back to form page
        setDisplayMapModal(false);
        setIsMapPage(false);
    }

    // clear location data
    const ClearLocationFormData = () => {
        
        const latitudeInput = document.getElementsByName("latitudeInputUpdate")[0] as HTMLInputElement;
        const longitudeInput = document.getElementsByName("longitudeInputUpdate")[0] as HTMLInputElement;

        latitudeInput.value = "";
        longitudeInput.value = "";
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
        textHeaderColorTheme = "text-whiteSmoke";
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
        placeMarkers={GetPlaceMarkers(places?.filter(e => e.id != cardData.id))}
        user={user}
        mapAsset={mapAsset}
        newMarkerInitLocation={GetNewMarkerLocation(formDataRef.current)}
        backtoFormPage={BackToFormPage}
        addLocationDataToRef={AddLocationDataToRef}
        userFocusObj={userFocusObj}
        isDarkTheme={isDarkTheme}
    ></MapModal>

    const UpdateListPage = <>
        <LoadingComponent 
            isDarkTheme={isDarkTheme}
            isDisplay={displayLoadingComponent}
        ></LoadingComponent>
        <div className={`card shadow-sm ${cardBorderThemeColor} ${cardColorTheme}`}>
            <div className={`card-header d-flex justify-content-between align-items-center ${cardHeaderColorTheme} ${textHeaderColorTheme} bg-gradient`}>
                <div onClick={backButtonHandler}>
                    <i className="bi bi-caret-left-fill"></i>
                </div>
                <h4 className="m-0 text-center">Update location</h4>
                <div></div>
            </div>
            <form className="card-body m-2" onSubmit={UpdatePlace}>
                <div className="mb-3">
                    <p className="mb-1">
                        Name:<span className="text-danger">*</span>
                    </p>
                    <input
                        type="text" 
                        name="placeNameInputUpdate" 
                        className={`form-control w-100 ${formColorTheme} shadow-sm`} 
                        defaultValue={formDataRef.current.name} 
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
                        name="reminderMessageInputUpdate" 
                        className={`form-control w-100 ${formColorTheme} shadow-sm`} 
                        defaultValue={formDataRef.current.message} 
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
                            name="reminderDateInputUpdate" 
                            className={`form-control ${formColorTheme} shadow-sm`} 
                            defaultValue={formDataRef.current.reminderDate} 
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
                            type="number" 
                            name="latitudeInputUpdate" 
                            className={`form-control ${formColorTheme} shadow-sm`} 
                            defaultValue={formDataRef.current.latitude} 
                            placeholder="..." 
                            step="any" 
                            min={0}
                        />
                        <input 
                            type="number" 
                            name="longitudeInputUpdate" 
                            className={`form-control ${formColorTheme} shadow-sm`} 
                            defaultValue={formDataRef.current.longitude} 
                            placeholder="..." 
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
                            {
                                <input type="checkbox"
                                    name="isActiveInputUpdate" 
                                    className={`form-check-input ${switchBtnColorTheme}`}
                                    defaultChecked={formDataRef.current.enableSwitch} 
                                />
                            }
                        </div>
                    </div>
                </div>
                <div className="mt-4 text-center">
                    <button 
                        type="submit"
                        className={`btn btn-sm w-100 my-2 text-white ${submitBtnColorTheme} shadow-sm bg-gradient`}
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    </>

    return displayMapModal ? MapPage : UpdateListPage; 
}