import {DisplayStringDateToUpdateForm, IsStringValid, IsStringValidEmpty} from "@/extension/string_extension";
import {PwaCurrentPageEnum} from "@/model/enumModel";
import {IUpdateListProps} from "@/model/propsModel";
import {ResponseModel} from "@/model/responseModel";
import {UpdatePlace} from "@/model/subentityModel";
import {FormEvent, useState} from "react";
import LoadingComponent from "../modalAsset/loading";

export default function UpdateList({cardData, changeCurrentPage, isDarkTheme, baseUrlApi}: IUpdateListProps) {

    const [ displayLoadingComponent, setDisplayLoadingComponent ] = useState<boolean>(false);

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

    return (
        <>
            <LoadingComponent 
                isDarkTheme={isDarkTheme}
                isDisplay={displayLoadingComponent}
            ></LoadingComponent>
            <div className={`card shadow-sm ${cardBorderThemeColor} ${cardColorTheme}`}>
                <div className={`card-header d-flex justify-content-between align-items-center ${cardHeaderColorTheme} ${textHeaderColorTheme}`}>
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
                            className={`form-control w-100 ${formColorTheme}`} 
                            defaultValue={cardData.name} 
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
                            name="reminderMessageInputUpdate" 
                            className={`form-control w-100 ${formColorTheme}`} 
                            defaultValue={cardData.reminderMessage ?? ""} 
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
                                name="reminderDateInputUpdate" 
                                className={`form-control ${formColorTheme}`} 
                                defaultValue={DisplayStringDateToUpdateForm(cardData.reminderDate) ?? ""} 
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
                                type="number" 
                                name="latitudeInputUpdate" 
                                className={`form-control ${formColorTheme}`} 
                                defaultValue={cardData.latitude && cardData.latitude != 0 ? cardData.latitude : ""} 
                                placeholder="Latitude..." 
                                step="any" 
                                min={0}
                            />
                            <input 
                                type="number" 
                                name="longitudeInputUpdate" 
                                className={`form-control ${formColorTheme}`} 
                                defaultValue={cardData.longitude && cardData.longitude != 0 ? cardData.longitude : ""} 
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
                                        name="isActiveInputUpdate" 
                                        className={`form-check-input ${switchBtnColorTheme}`}
                                        defaultChecked={!cardData.isDisable} 
                                    />
                                }
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 text-center">
                        <button 
                            type="submit"
                            className={`btn btn-sm w-100 my-2 text-white ${submitBtnColorTheme}`}
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}