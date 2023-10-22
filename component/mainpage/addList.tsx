import {IsStringValid, IsStringValidEmpty} from "@/extension/string_extension";
import {PwaCurrentPageEnum} from "@/model/enumModel";
import {IAddPlace} from "@/model/propsModel";
import {ResponseModel} from "@/model/responseModel";
import {PlaceExtensionModel} from "@/model/subentityModel";
import {FormEvent, useState} from "react";
import LoadingComponent from "../modalAsset/loading";

export default function AddList({ userId, changeCurrentPage, isDarkTheme, baseUrlApi }: IAddPlace) {

    const [ displayLoadingComponent, setDisplayLoadingComponent ] = useState<boolean>(false);

    // add place handler
    const AddNewPlace = async (event: FormEvent<HTMLFormElement>) => {

        // check current user from global variable   
        if (IsStringValid(userId)) {

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
                userId: userId,
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

    return (
        <>
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
                                        name="isActiveInput" 
                                        className={`form-check-input ${switchBtnColorTheme}`}
                                        defaultChecked={true} 
                                    />
                                }
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
    )
}