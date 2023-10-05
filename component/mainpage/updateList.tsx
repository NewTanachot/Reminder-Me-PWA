import {DisplayStringDateToUpdateForm, IsStringValid, IsStringValidEmpty} from "@/extension/string_extension";
import {PwaCurrentPageEnum} from "@/model/enumModel";
import {IUpdateListProps} from "@/model/propsModel";
import {ResponseModel} from "@/model/responseModel";
import {UpdatePlace} from "@/model/subentityModel";
import {FormEvent} from "react";

// Initialize .ENV variable
const baseUrlApi: string = process.env.NEXT_PUBLIC_BASEURL_API ?? "";

export default function UpdateList({cardData, changeCurrentPage, isDarkTheme}: IUpdateListProps) {

    // add place handler
    const UpdatePlace = async (event: FormEvent<HTMLFormElement>) => {

        // change current page to loading page
        changeCurrentPage({ page: PwaCurrentPageEnum.Loading });

        event.preventDefault();
        const formInput = new FormData(event.currentTarget);
    
        // get data from input form
        const placeNameInput = formInput.get("placeNameInputUpdate")?.toString();
        const latitudeInput = formInput.get("latitudeInputUpdate")?.toString();
        const longitudeInput = formInput.get("longitudeInputUpdate")?.toString();
        const reminderMessageInput = formInput.get("reminderMessageInputUpdate")?.toString();
        const reminderDateInput = formInput.get("reminderDateInputUpdate")?.toString();
        const isActiveInput = formInput.get("isActiveInputUpdate")?.toString();

        const updatePlace: UpdatePlace = {
            id: cardData.id,
            name: IsStringValidEmpty(placeNameInput),
            latitude: +IsStringValidEmpty(latitudeInput), // cast string to number
            longitude: +IsStringValidEmpty(longitudeInput), // cast string to number
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
            alert(`Error message: ${errorMessage.message}`);

            changeCurrentPage({ page: PwaCurrentPageEnum.UpdateList });
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

    let cardColorTheme: string;
    let cardHeaderColorTheme: string;
    let textHeaderColorTheme: string;
    let formColorTheme = "";
    let submitBtnColorTheme: string;

    if (isDarkTheme) {
        cardColorTheme = "bg-mainGray";
        cardHeaderColorTheme = "bg-mainblack";
        textHeaderColorTheme = "text-whiteSmoke";
        formColorTheme = "bg-whitesmoke";
        submitBtnColorTheme = "bg-mainblack";
    }
    else {
        cardColorTheme = "bg-peach-65";
        cardHeaderColorTheme = "bg-warning-subtle";
        textHeaderColorTheme = "text-viridian-green";
        submitBtnColorTheme = "bg-viridian-green";
    }

    return (
        <div className={`card shadow-sm ${cardColorTheme}`}>
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
                        className={`form-control w-100 ${formColorTheme} shadow-sm`} 
                        defaultValue={cardData.name} 
                        placeholder="entry place name..." 
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
                        className={`form-control w-100 ${formColorTheme} shadow-sm`} 
                        defaultValue={cardData.reminderMessage ?? ""} 
                        placeholder="entry some message..." 
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
                            defaultValue={DisplayStringDateToUpdateForm(cardData.reminderDate) ?? ""} 
                        />
                        <div className={`input-group-text ${formColorTheme} shadow-sm`}>
                            <i 
                                className="fa-solid fa-circle-xmark text-cobalt-blue"
                                onClick={ClearDatePickerFormHandler}
                            ></i>
                        </div>
                    </div>
                </div>
                <div className="mt-3 text-center">
                    <a className="text-decoration-none text-cobalt-blue">
                        <i className="bi bi-geo-fill me-2"></i>
                        Mark location
                    </a>
                </div>
                <div className="mt-1">
                    <p className="mb-1">
                        Latitude:
                    </p>
                    <input
                        type="number" 
                        name="latitudeInputUpdate" 
                        className={`form-control w-100 ${formColorTheme} shadow-sm`} 
                        defaultValue={cardData.latitude && cardData.latitude != 0 ? cardData.latitude : ""} 
                        placeholder="0.00" 
                        step="any" 
                        min={0}
                    />
                </div>
                <div className="mt-3">
                    <p className="mb-1">
                        Longitude:
                    </p>
                    <input 
                        type="number" 
                        name="longitudeInputUpdate" 
                        className={`form-control w-100 ${formColorTheme} shadow-sm`} 
                        defaultValue={cardData.longitude && cardData.longitude != 0 ? cardData.longitude : ""} 
                        placeholder="0.00" 
                        step="any" 
                        min={0}
                        />
                </div>
                <div className="mt-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <p className="mb-1">Enable :</p>
                        <div className="form-check form-switch">
                            {
                                <input type="checkbox"
                                    name="isActiveInputUpdate" 
                                    className="form-check-input" 
                                    defaultChecked={!cardData.isDisable} 
                                />
                            }
                        </div>
                    </div>
                </div>
                <div className="mt-4 text-center">
                    <button 
                        type="submit"
                        className={`btn btn-sm w-100 my-2 text-white ${submitBtnColorTheme}  shadow-sm`}
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    )
}