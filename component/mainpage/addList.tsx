import {IsStringValid, IsStringValidEmpty} from "@/extension/string_extension";
import {PwaCurrentPageEnum} from "@/model/enumModel";
import {IAddPlace} from "@/model/propsModel";
import {ResponseModel} from "@/model/responseModel";
import {PlaceExtensionModel} from "@/model/subentityModel";
import {FormEvent} from "react";

// Initialize .ENV variable
const baseUrlApi: string = process.env.NEXT_PUBLIC_BASEURL_API ?? "";

export default function AddList({ userId, changeCurrentPage, isDarkTheme }: IAddPlace) {

    // add place handler
    const AddNewPlace = async (event: FormEvent<HTMLFormElement>) => {

        // check current user from global variable   
        if (IsStringValid(userId)) {

            // change current page to loading page
            changeCurrentPage({ page: PwaCurrentPageEnum.Loading });

            event.preventDefault();
            const formInput = new FormData(event.currentTarget);
        
            // get data from input form
            const placeNameInput = formInput.get("placeNameInput")?.toString();
            const latitudeInput = formInput.get("latitudeInput")?.toString();
            const longitudeInput = formInput.get("longitudeInput")?.toString();
            const reminderMessageInput = formInput.get("reminderMessageInput")?.toString();
            const reminderDateInput = formInput.get("reminderDateInput")?.toString();
            const isActiveInput = formInput.get("isActiveInput")?.toString();

            const newPlace: PlaceExtensionModel = {
                name: IsStringValidEmpty(placeNameInput),
                latitude: +IsStringValidEmpty(latitudeInput), // cast string to number
                longitude: +IsStringValidEmpty(longitudeInput), // cast string to number
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
                alert(`Error message: ${errorMessage.message}`)
            }
            else {

                changeCurrentPage({
                    page: PwaCurrentPageEnum.ReminderList,
                    forceFetch: true
                });
            }
        }
        else {
            alert(`Error message: User not found.`)
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
        textHeaderColorTheme = "text-whiteSmoke"
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
            <div className={`card-header ${cardHeaderColorTheme} ${textHeaderColorTheme}`}>
                <h4 className="m-0 text-center">Create new location</h4>
            </div>
            <form className="card-body m-2" onSubmit={AddNewPlace}>
                <div className="mb-3">
                    <p className="mb-1">
                        Name:<span className="text-danger">*</span>
                    </p>
                    <input name="placeNameInput" className={`form-control w-100 ${formColorTheme} shadow-sm`} type="text" placeholder="entry place name..." maxLength={20} required/>
                </div>
                <div className="mt-3">
                    <p className="mb-1">
                        Reminder Message:
                    </p>
                    <textarea name="reminderMessageInput" className={`form-control w-100 ${formColorTheme} shadow-sm`} placeholder="entry some message..." maxLength={50} rows={2}/>
                </div>
                <div className="mt-3">
                    <p className="mb-1">
                        Reminder Date:
                    </p>
                    <input name="reminderDateInput" className={`form-control w-100 ${formColorTheme} shadow-sm`} type="date"/>
                </div>
                <div className="mt-3 text-center">
                    <a className="text-decoration-none">
                        <i className="bi bi-geo-fill me-2"></i>
                        Mark location
                    </a>
                </div>
                <div className="mt-1">
                    <p className="mb-1">
                        Latitude:
                    </p>
                    <input name="latitudeInput" className={`form-control w-100 ${formColorTheme} shadow-sm`} type="number" placeholder="0.00" step="any" min={0}/>
                </div>
                <div className="mt-3">
                    <p className="mb-1">
                        Longitude:
                    </p>
                    <input name="longitudeInput" className={`form-control w-100 ${formColorTheme} shadow-sm`} type="number" placeholder="0.00" step="any" min={0}/>

                </div>
                <div className="mt-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <p className="mb-1">Enable :</p>
                        <div className="form-check form-switch">
                            {
                                <input type="checkbox"
                                    name="isActiveInput" 
                                    className="form-check-input" 
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
    )
}