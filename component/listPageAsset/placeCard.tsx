// 'use client';

import { ResponseModel } from "@/model/responseModel";
import { IPlaceCardProps } from "@/model/propsModel";
import { useState } from "react";
import { IUpdateCardStatusApiRequest } from "@/model/requestModel";

export default function PlaceCard({ data, deletePlaceHandler, changePlaceStatusHandler, updatePlaceCardHandler, isDarkTheme, baseUrlApi }: IPlaceCardProps) {

    const cardStatusSwitchId = `cardStatusSwitch_${data.id}`;
    let displayLocation = "-";
    let filterCardClass = "";

    // react hook initialize
    const [isFilter, setIsFilter] = useState<boolean>(data.isDisable);

    // cal display location
    if (data.latitude && data.latitude != 0 && data.longitude && data.longitude != 0) {

        displayLocation = `${(+data.latitude).toFixed(4)}, ${(+data.longitude).toFixed(4)}`;
    }

    // change place active status handler
    const ChangePlaceStatus = async (event: React.ChangeEvent<HTMLInputElement>) => {
        
        const setIsDisable = !event.currentTarget.checked;

        // set State for refresh page
        setIsFilter(setIsDisable)

        // update places state (Cache data) in list page [Fix chabge page on footer bug]
        changePlaceStatusHandler(data.id, setIsDisable);

        // update place display status data with only
        const updatePlaceStatus: IUpdateCardStatusApiRequest = {
            isDisable: setIsDisable
        }

        // fetch update place status api
        const response = await fetch(`${baseUrlApi}/place/${data.id}`, {
            method: "PUT",
            body: JSON.stringify(updatePlaceStatus)
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
    if (isFilter || data.isDisable) {
        
        // check web page is loaded or not
        window.onload = function() {
            // fix switch is not switch off
            const cardStatusSwitch = document.getElementById(cardStatusSwitchId) as HTMLInputElement;
            cardStatusSwitch.checked = false;
        }

        filterCardClass = isDarkTheme ? "filter-card-dark" : "filter-card-light";
    }

    // check theme
    let cardHeaderThemeColor: string;
    let cardBodyThemeColor: string;
    let cardSubDataThemeColor: string;
    let deleteCardBtnThemeColor: string;
    let switchBtnColorTheme: string;
    let cardBorderThemeColor: string;

    if (isDarkTheme) {

        cardHeaderThemeColor = "bg-mainblack text-whiteSmoke";
        cardBodyThemeColor = "bg-whitesmoke";
        cardSubDataThemeColor = "text-lightblue";
        deleteCardBtnThemeColor = "text-warning";
        switchBtnColorTheme = "custom-switch-dark";
        cardBorderThemeColor = "border-secondary";
    }
    else {

        cardHeaderThemeColor = "bg-warning-subtle text-viridian-green";
        cardBodyThemeColor = "bg-peach-65";
        cardSubDataThemeColor = "text-secondary";
        deleteCardBtnThemeColor = "text-danger";
        switchBtnColorTheme = "custom-switch-light";
        cardBorderThemeColor = "";
    }

    //  #endregion

    return (
        <div className={`card mb-3 shadow-sm rounded-4 position-relative ${cardBorderThemeColor} ${filterCardClass}`}>    
            <div 
                className="position-absolute top-0 start-100 translate-middle"
                onClick={() => DeletePlace(data.id, data.name)}
            >
                <i className={`fa-solid fa-circle-xmark text-delete-card-size ${deleteCardBtnThemeColor}`}></i>
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
            <div className={`card-body ${cardBodyThemeColor}`}>
                <div className="d-flex justify-content-between align-items-center">
                    <p className="text-dark m-0 lh-1">
                        Message: &nbsp;
                        <span className={cardSubDataThemeColor}>
                            {data.reminderMessage ? data.reminderMessage : "-"}
                        </span>
                    </p>
                 </div>
                 <div className="d-flex justify-content-between align-items-center">
                    <div className="text-dark">
                        Location: &nbsp;
                        <span className={cardSubDataThemeColor}>
                            {displayLocation}
                        </span>
                    </div>
                    <div className="form-check form-switch">
                        <input 
                            id={cardStatusSwitchId}
                            type="checkbox" 
                            className={`form-check-input ${switchBtnColorTheme}`}
                            defaultChecked={!isFilter} 
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
            <div 
                className={`card-footer rounded-bottom-4 text-end py-0 h-25 text-secondary ${cardBodyThemeColor} text-card-footer-size`}
            >
                {data.displayCreateAt}
            </div>
        </div>
    )
}