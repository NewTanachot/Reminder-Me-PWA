'use client';

import { ResponseModel } from "@/model/responseModel";
import { UpdatePlace } from "@/model/subentityModel";
import { IPlaceCardProps } from "@/model/propsModel";
import { useState } from "react";

// Initialize .ENV variable
const baseUrlApi: string = process.env.NEXT_PUBLIC_BASEURL_API ?? "";

export default function PlaceCard({ data, deletePlaceHandler, changePlaceStatusHandler, updatePlaceCardHandler, isDarkTheme }: IPlaceCardProps) {
  
    // Const variable initialize
    let filterCardClass = "";
    let cardHeaderThemeColor = "";
    let cardBodyThemeColor = "";
    let cardSubDataThemeColor = "";
    let deleteCardBtnThemeColor = "";

    // react hook initialize
    const [isFilter, setIsFilter] = useState<boolean>(data.isDisable);

    // change place active status handler
    const ChangePlaceStatus = async (event: React.ChangeEvent<HTMLInputElement>) => {
        
        const setIsDisable = !event.currentTarget.checked;

        // set State for refresh page
        setIsFilter(setIsDisable)

        // update places state (Cache data) in list page [Fix chabge page on footer bug]
        changePlaceStatusHandler(data.id, setIsDisable);

        // update place display status data with only
        const updatePlace: UpdatePlace = {
            id: data.id,
            isDisable: setIsDisable
        }

        // fetch update place api
        const response = await fetch(`${baseUrlApi}/place`, {
            method: "PUT",
            body: JSON.stringify(updatePlace)
        });

        if (!response.ok) {

            const errorMessage: ResponseModel = await response.json();
            alert(`Error message: ${errorMessage.message}`)
        }
    }

    // delete place handler
    const DeletePlace = async (placeId: string, placeName: string) => {

        // confirm delete card
        if (confirm(`Are you sure about deleting your "${placeName}" card?`)) {

            // set User state
            deletePlaceHandler(placeId);

            // fetch delete api
            const response = await fetch(`${baseUrlApi}/place/${placeId}`, { method: "DELETE" });

            if (!response.ok) {

                const errorMessage: ResponseModel = await response.json();
                alert(`Error message: ${errorMessage.message}`)
            }
        }
    }

    // check disable filter
    if (isFilter) {

        filterCardClass = "filter-card";
    }

    // check theme
    if (isDarkTheme) {

        cardHeaderThemeColor = "bg-mainblack text-whiteSmoke";
        cardBodyThemeColor = "bg-whitesmoke";
        cardSubDataThemeColor = "text-lightblue";
        deleteCardBtnThemeColor = "text-warning"
    }
    else {

        cardHeaderThemeColor = "bg-warning-subtle text-viridian-green";
        cardBodyThemeColor = "bg-peach-65";
        cardSubDataThemeColor = "text-secondary";
        deleteCardBtnThemeColor = "text-danger"
    }

    return (
        <div className={`card mb-3 shadow-sm rounded-4 position-relative ${filterCardClass}`}>    
            <div 
                className="position-absolute top-0 start-100 translate-middle"
                onClick={() => DeletePlace(data.id, data.name)}
            >
                <i className={`bi bi-x-circle-fill text-delete-card-size ${deleteCardBtnThemeColor}`}></i>
            </div>         
            <div className={`card-header rounded-top-4 ${cardHeaderThemeColor}`}>
                <div className="d-flex justify-content-between align-items-center text-size-20">
                    <div 
                        onClick={() => updatePlaceCardHandler(data.id)}
                    >
                        {data.name}
                    </div>
                    <div className="text-nowrap">
                        {data.locationDistance.toFixed(2)} km
                    </div>
                 </div>
            </div>
            <div className={`card-body rounded-bottom-4 ${cardBodyThemeColor}`}>
                <div className="d-flex justify-content-between align-items-center">
                    <p className="text-dark m-0 lh-1">
                        Message: &nbsp;
                        <span className={cardSubDataThemeColor}>
                            {data.reminderMessage ?? "-"}
                        </span>
                    </p>
                 </div>
                 <div className="d-flex justify-content-between align-items-center">
                    <div className="text-dark">
                        location: &nbsp;
                        <span className={cardSubDataThemeColor}>
                            {(data.latitude != 0 && data.longitude != 0) ? `${(+data.latitude).toFixed(4)}, ${(+data.longitude).toFixed(4)}` : "-"}
                        </span>
                    </div>
                    <div className="form-check form-switch">
                        <input type="checkbox" 
                            className="form-check-input" 
                            defaultChecked={!data.isDisable} 
                            onChange={ChangePlaceStatus}
                        />
                    </div>
                 </div>
                 <div className="d-flex justify-content-between align-items-center">
                    <div className="text-dark">
                        Date: &nbsp;
                        {
                            data.reminderDate ? 
                            <span className={cardSubDataThemeColor}>{data.reminderDate}</span>
                            :
                            <span className={cardSubDataThemeColor}>-</span>
                        }
                    </div>
                 </div>
            </div>
        </div>
    )
}