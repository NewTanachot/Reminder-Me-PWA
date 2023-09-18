import { IsStringValid, IsStringValidEmpty } from "@/extension/string_extension";
import { PwaCurrentPage } from "@/model/enum_model";
import { IUpdateListProps } from "@/model/props_model";
import { ResponseModel } from "@/model/response_model";
import { UpdatePlace } from "@/model/subentity_model";
// Initialize .ENV variable
const baseUrlApi: string = process.env.NEXT_PUBLIC_BASEURL_API ?? "";

export default function UpdateList({cardData, changeCurrentPage}: IUpdateListProps) {

    // add place handler
    const UpdatePlace = async (event: React.FormEvent<HTMLFormElement>) => {

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
            isDisable: !IsStringValid(isActiveInput), // if isActiveInput is "on" it return flase
            userId: cardData.userId,
        }

        // fetch creaet place api
        const response = await fetch(`${baseUrlApi}/place`, {
            method: "PUT",
            body: JSON.stringify(updatePlace)
        });

        if (!response.ok) {

            const errorMessage: ResponseModel = await response.json();
            alert(`Error message: ${errorMessage.message}`)
        }
        else {

            changeCurrentPage(PwaCurrentPage.ReminderList, false, true);
        }
    }

    const backButtonHandler = () => {
        changeCurrentPage(PwaCurrentPage.ReminderList);
    }

    return (
        <div className="card shadow-sm bg-peach-65">
            <div className="card-header d-flex justify-content-between align-items-center bg-warning-subtle text-viridian-green">
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
                    <input name="placeNameInputUpdate" className="form-control w-100" type="text" defaultValue={cardData.name} placeholder="entry place name..." maxLength={20} required/>
                </div>
                <div className="mt-3">
                    <p className="mb-1">
                        Reminder Message:
                    </p>
                    <textarea name="reminderMessageInputUpdate" className="form-control w-100" defaultValue={cardData.reminderMessage ?? ""} placeholder="entry some message..." maxLength={50} rows={2}/>
                </div>
                <div className="mt-3">
                    <p className="mb-1">
                        Reminder Date:
                    </p>
                    <input name="reminderDateInputUpdate" className="form-control w-100" defaultValue={cardData.reminderDate ?? ""} type="date"/>
                </div>
                <div className="mt-3 text-center">
                    <a className="btn btn-sm btn-outline-primary">
                        <i className="bi bi-geo-fill me-2"></i>
                        Mark location
                    </a>
                </div>
                <div className="mt-1">
                    <p className="mb-1">
                        Latitude:
                    </p>
                    <input name="latitudeInputUpdate" className="form-control w-100" type="number" defaultValue={cardData.latitude} placeholder="0.00" step="any" min={0}/>
                </div>
                <div className="mt-3">
                    <p className="mb-1">
                        Longitude:
                    </p>
                    <input name="longitudeInputUpdate" className="form-control w-100" type="number" defaultValue={cardData.longitude} placeholder="0.00" step="any" min={0}/>

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
                        className="btn btn-sm w-100 my-2 bg-viridian-green text-white"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    )
}