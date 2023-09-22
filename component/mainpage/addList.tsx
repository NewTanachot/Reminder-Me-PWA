import { IsStringValid, IsStringValidEmpty } from "@/extension/string_extension";
import { PwaCurrentPage } from "@/model/enumModel";
import { IAddPlace } from "@/model/propsModel";
import { ResponseModel } from "@/model/responseModel";
import { PlaceExtensionModel } from "@/model/subentityModel";

// Initialize .ENV variable
const baseUrlApi: string = process.env.NEXT_PUBLIC_BASEURL_API ?? "";

export default function AddList({ userId, changeCurrentPage }: IAddPlace) {

    // add place handler
    const AddNewPlace = async (event: React.FormEvent<HTMLFormElement>) => {

        // check current user from global variable   
        if (IsStringValid(userId)) {
        
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
                isDisable: !IsStringValid(isActiveInput), // if isActiveInput is "on" it return flase
                userId: userId,
            }

            // fetch creaet place api
            const response = await fetch(`${baseUrlApi}/place`, {
                method: "POST",
                body: JSON.stringify(newPlace)
            });

            if (!response.ok) {
    
                const errorMessage: ResponseModel = await response.json();
                alert(`Error message: ${errorMessage.message}`)
            }
            else {

                changeCurrentPage(PwaCurrentPage.ReminderList, false, true);
            }
        }
        else {
            alert(`Error message: User not found.`)
        }
    }


    return (
        <div className="card shadow-sm bg-peach-65">
            <div className="card-header bg-warning-subtle text-viridian-green">
                <h4 className="m-0 text-center">Create new location</h4>
            </div>
            <form className="card-body m-2" onSubmit={AddNewPlace}>
                <div className="mb-3">
                    <p className="mb-1">
                        Name:<span className="text-danger">*</span>
                    </p>
                    <input name="placeNameInput" className="form-control w-100" type="text" placeholder="entry place name..." maxLength={20} required/>
                </div>
                <div className="mt-3">
                    <p className="mb-1">
                        Reminder Message:
                    </p>
                    <textarea name="reminderMessageInput" className="form-control w-100" placeholder="entry some message..." maxLength={50} rows={2}/>
                </div>
                <div className="mt-3">
                    <p className="mb-1">
                        Reminder Date:
                    </p>
                    <input name="reminderDateInput" className="form-control w-100" type="date"/>
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
                    <input name="latitudeInput" className="form-control w-100" type="number" placeholder="0.00" step="any" min={0}/>
                </div>
                <div className="mt-3">
                    <p className="mb-1">
                        Longitude:
                    </p>
                    <input name="longitudeInput" className="form-control w-100" type="number" placeholder="0.00" step="any" min={0}/>

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
                        className="btn btn-sm w-100 my-2 bg-viridian-green text-white"
                    >
                        Add
                    </button>
                </div>
            </form>
        </div>
    )
}