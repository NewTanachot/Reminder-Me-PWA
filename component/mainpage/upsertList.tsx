import dynamic from "next/dynamic";
import { DisplayStringDateToUpdateForm, IsStringValid, IsStringValidEmpty } from "@/extension/string_extension";
import { PwaCurrentPageEnum } from "@/model/enumModel";
import { IUpsertListProps } from "@/model/propsModel";
import { ResponseModel } from "@/model/responseModel";
import { IBaseLocation, PlaceExtensionModel } from "@/model/subentityModel";
import { FormEvent, useRef, useState } from "react";
import LoadingComponent from "../modalAsset/loading";
import { GetNewMarkerLocation, GetPlaceMarkers } from "@/extension/calculation_extension";
import { IUpsertFormData } from "@/model/useStateModel";
import { SetPageContainerClass } from "@/extension/style_extension";
import CardHeader from "../layoutAsset/cardHeader";
const MapModal = dynamic(() => import("@/component/mapAsset/mapModal"), { ssr: false });

export default function UpsertList({ 
    user, 
    places, 
    cardData,
    changeCurrentPage, 
    mapAsset, 
    isDarkTheme, 
    baseUrlApi, 
    containerClassObject,
    setIsMapPage,
    userFocusObj
}: IUpsertListProps) {

    const isUpdatePage = cardData ? true : false;

    const [displayLoadingComponent, setDisplayLoadingComponent] = useState<boolean>(false);
    const [displayMapModal, setDisplayMapModal] = useState<boolean>(false);
    const formDataRef = useRef<IUpsertFormData>({
        name: cardData?.name,
        message: cardData?.reminderMessage ?? undefined,
        reminderDate: DisplayStringDateToUpdateForm(cardData?.reminderDate) ?? undefined,
        latitude: cardData?.latitude?.toString(),
        longitude: cardData?.longitude?.toString(),
        enableSwitch: !cardData?.isDisable
    });

    // add place handler
    const UpsertPlace = async (event: FormEvent<HTMLFormElement>) => {

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
        const latitudeInput = document.getElementsByName("latitudeInput")[0] as HTMLInputElement;
        const longitudeInput = document.getElementsByName("longitudeInput")[0] as HTMLInputElement;
        const isActiveInput = document.getElementsByName("isActiveInput")[0] as HTMLInputElement;
        
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

        // set user focus to flase
        userFocusObj.setUserFocus(false);

        // set go to page map
        setDisplayMapModal(true);
        setIsMapPage(true);
    }

    // cancle btn handler 
    const BackToFormPage = () => {
        
        // change container class to not map page
        SetPageContainerClass(containerClassObject, false);

        // back to form page
        setDisplayMapModal(false);
        setIsMapPage(false);
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
        setIsMapPage(false);
    }

    let formColorTheme: string;
    let formLabelColorTheme: string;
    let formLabelRequireColorTheme: string;
    let underLineColorTheme: string;
    let cardColorTheme: string;
    let submitBtnColorTheme: string;
    let clearBtnColorTheme: string;
    let switchBtnColorTheme: string;

    if (isDarkTheme) {
        formColorTheme = "bg-whitesmoke";
        formLabelColorTheme = "text-white";
        formLabelRequireColorTheme = "text-warning";
        underLineColorTheme = "text-white";
        cardColorTheme = "bg-mainblack border-bottom-0";
        submitBtnColorTheme = "bg-steelblue";
        clearBtnColorTheme = "text-lightgray";
        switchBtnColorTheme = "custom-switch-dark";
    }
    else {
        formColorTheme = "bg-white";
        formLabelColorTheme = "text-dark";
        formLabelRequireColorTheme = "text-danger";
        underLineColorTheme = "text-dark";
        cardColorTheme = "bg-peach-65";
        submitBtnColorTheme = "bg-viridian-green";
        clearBtnColorTheme = "text-secondary";
        switchBtnColorTheme = "custom-switch-light";
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

        <div className={`card border-0 shadow ${cardColorTheme} bg-gradient`}>
            <form 
                className="card-body m-2" 
                onSubmit={UpsertPlace}
            >
                {
                    isUpdatePage
                        ? <CardHeader
                            backToPage={PwaCurrentPageEnum.ReminderList}
                            changeCurrentPage={changeCurrentPage}
                            isDarkTheme={isDarkTheme}
                        ></CardHeader>
                        : null
                }
                <div>
                    <p className={`mb-1 ${formLabelColorTheme}`}>
                        Place Name:
                        <span className={formLabelRequireColorTheme}> *</span>
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
                    <hr className={underLineColorTheme} />
                </div>
                <div>
                    <p className={`mb-1 ${formLabelColorTheme}`}>
                        Reminder Message:
                    </p>
                    <textarea 
                        name="reminderMessageInput" 
                        className={`form-control w-100 shadow-sm ${formColorTheme}`} 
                        defaultValue={formDataRef.current?.message}
                        placeholder="..."
                        maxLength={65} 
                        rows={2}
                    />
                    <hr className={underLineColorTheme} />
                </div>
                <div>
                    <p className={`mb-1 ${formLabelColorTheme}`}>
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
                    <hr className={underLineColorTheme} />
                </div>
                <div>
                    <p className={`mb-1 ${formLabelColorTheme}`}>
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
                        className={`btn btn-sm ${clearBtnColorTheme} border-secondary shadow-sm`}
                        onClick={ClearLocationFormData}
                    >
                        <i className="fa-regular fa-trash-can me-2"></i>
                        Clear location
                    </button>
                    <button 
                        type="button"
                        className={`btn btn-sm text-white ${submitBtnColorTheme} shadow-sm`}
                        onClick={GoToMapModalPage}
                    >
                        <i className="fa-solid fa-map-location-dot me-2"></i>
                        Mark location
                    </button>
                </div>
                <hr className={underLineColorTheme} />
                <div>
                    <div className="d-flex justify-content-between align-items-center">
                        <p className={`m-0 ${formLabelColorTheme}`}>
                            Enable:
                        </p>
                        <div className="form-check form-switch">
                            <input type="checkbox"
                                name="isActiveInput" 
                                className={`form-check-input ${switchBtnColorTheme} shadow-sm`}
                                defaultChecked={formDataRef.current?.enableSwitch ?? true}
                            />
                        </div>
                    </div>
                    <hr className={underLineColorTheme} />
                </div>
                <div className="text-center">
                    <button 
                        type="submit"
                        className={`btn btn-sm w-100 my-0 pe-2 text-white ${submitBtnColorTheme} shadow-sm`}
                    >
                        <i className="fa-solid fa-floppy-disk me-2"></i>
                        Save
                    </button>
                </div>
            </form>
        </div>
    </>

    return displayMapModal ? MapPage : AddListPage;
}