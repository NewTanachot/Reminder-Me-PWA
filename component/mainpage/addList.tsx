import dynamic from "next/dynamic";
import {DisplayStringDateToUpdateForm, IsStringValid, IsStringValidEmpty} from "@/extension/string_extension";
import {PwaCurrentPageEnum} from "@/model/enumModel";
import {IAddPlace} from "@/model/propsModel";
import {ResponseModel} from "@/model/responseModel";
import {PlaceExtensionModel} from "@/model/subentityModel";
import {FormEvent, useRef, useState} from "react";
import LoadingComponent from "../modalAsset/loading";
import { GetPlaceMarkers } from "@/extension/calculation_extension";
import { IUpsertFormData } from "@/model/useStateModel";
const AddListMap = dynamic(() => import("@/component/mapAsset/addListMap"), { ssr: false });

export default function AddList({ user, places, changeCurrentPage, mapTheme, isDarkTheme, baseUrlApi }: IAddPlace) {

    const [displayLoadingComponent, setDisplayLoadingComponent] = useState<boolean>(false);
    const [displayMapModal, setDisplayMapModal] = useState<boolean>(false);
    const refData = useRef<IUpsertFormData>();

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

        if (reminderDateForm) {
            reminderDateForm.value = "";
        }
    }

    // mark location button handler
    const ToggleDisplayMapModal = () => {

        const placeNameInput = document.getElementsByName("placeNameInput")[0] as HTMLInputElement;
        const reminderMessageInput = document.getElementsByName("reminderMessageInput")[0] as HTMLInputElement;
        const reminderDateInput = document.getElementsByName("reminderDateInput")[0] as HTMLInputElement;
        const isActiveInput = document.getElementsByName("isActiveInput")[0] as HTMLInputElement;

        refData.current = {
            name: placeNameInput.value,
            message: reminderMessageInput.value,
            reminderDate: reminderDateInput.value,
            enableSwitch: isActiveInput.value == "on" ? true : false
        };

        setDisplayMapModal(true);
    }

    const Back = () => {
        setDisplayMapModal(false);
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

    const MapPage = <AddListMap
        placeMarkers={GetPlaceMarkers(places)}
        user={user}
        mapTheme={mapTheme}
        // changeCurrentPage={changeCurrentPage}
        backtoFormPage={Back}
        isDarkTheme={isDarkTheme}
    ></AddListMap>

    const AddListPage = <>
        <LoadingComponent 
            isDarkTheme={isDarkTheme}
            isDisplay={displayLoadingComponent}
        ></LoadingComponent>
        <div className={`card shadow-sm ${cardBorderThemeColor} ${cardColorTheme}`}>
            <div className={`card-header ${cardHeaderColorTheme} ${textHeaderColorTheme}`}>
                <h4 className="m-0 text-center">Create new location</h4>
            </div>
            <form className="card-body m-2" onSubmit={AddNewPlace}>
                <div className="mb-3">
                    <p className="mb-1">
                        Name:<span className="text-danger">*</span>
                    </p>
                    <input 
                        name="placeNameInput" 
                        className={`form-control w-100 ${formColorTheme}`} 
                        type="text" 
                        defaultValue={refData.current?.name}
                        placeholder="place name..." 
                        maxLength={20} 
                        required
                    />
                </div>
                <div className="mt-3">
                    <p className="mb-1">
                        Reminder Message:
                    </p>
                    <textarea 
                        name="reminderMessageInput" 
                        className={`form-control w-100 ${formColorTheme}`} 
                        defaultValue={refData.current?.message}
                        placeholder="some message..." 
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
                            className={`form-control ${formColorTheme}`} 
                            defaultValue={DisplayStringDateToUpdateForm(refData.current?.reminderDate) ?? ""}
                        />          
                        <div className={`input-group-text ${formColorTheme}`}>
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
                            className={`form-control ${formColorTheme}`} 
                            type="number" 
                            placeholder="Latitude..." 
                            step="any" 
                            min={0}
                        />
                        <input 
                            name="longitudeInput" 
                            className={`form-control ${formColorTheme}`} 
                            type="number" 
                            placeholder="Longitude..." 
                            step="any" 
                            min={0}
                        />
                    </div>
                </div>
                <div className="mt-3 text-center">
                    <button 
                        type="button"
                        className={`btn btn-sm w-50 my-2 text-white ${submitBtnColorTheme} shadow-sm`}
                        onClick={ToggleDisplayMapModal}
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
                                defaultChecked={refData.current?.enableSwitch ?? true}
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-4 text-center">
                    <button 
                        type="submit"
                        className={`btn btn-sm w-100 my-2 text-white ${submitBtnColorTheme} shadow-sm`}
                    >
                        Add
                    </button>
                </div>
            </form>
        </div>
    </>

    return displayMapModal ? MapPage : AddListPage;
}