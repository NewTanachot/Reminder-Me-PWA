'use client';

import { ResponseModel } from "@/model/responseModel";
import { IPlaceCardProps } from "@/model/propsModel";
import { useEffect, useState } from "react";
import { IUpdateCardStatusApiRequest } from "@/model/requestModel";

export default function PlaceCard({ 
    data, 
    deletePlaceHandler, 
    changePlaceStatusHandler, 
    updatePlaceCardHandler, 
    linkCardToMapPageHandler,
    isDarkTheme, 
    baseUrlApi 
}: IPlaceCardProps) {

    const cardId = `card_${data.id}`;
    const cardStatusSwitchId = `cardStatusSwitch_${data.id}`;
    const filterCSSClass = "filter-card";
    const removeFilterCSSClass = "filter-card-remove";
    let displayLocation = "-";
    let filterCardClass = "";

    // react hook initialize
    const [isFilter, setIsFilter] = useState<boolean>(data.isDisable);

    // check card status when change in updateCard page 
    // need to use useEffect cause of window loading and useState not set initial isFilter value
    useEffect(() => {

        const card = document.getElementById(cardId) as HTMLElement;
        
        if (data.isDisable) {
            card.classList.add(filterCSSClass);
            card.classList.remove(removeFilterCSSClass);
        }
        else {
            card.classList.add(removeFilterCSSClass);
            card.classList.remove(filterCSSClass);
        }

        const cardStatusSwitch = document.getElementById(cardStatusSwitchId) as HTMLInputElement;
        cardStatusSwitch.checked = !data.isDisable;

    }, [data.isDisable]);

    // change place active status handler
    const ChangePlaceStatus = async (event: React.ChangeEvent<HTMLInputElement>) => {
        
        const setIsDisable = !event.currentTarget.checked;

        // set State for refresh page
        setIsFilter(setIsDisable)

        // update places state (Cache data) in list page [Fix change page on footer bug]
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
        if (confirm(`Are you sure about deleting your "${placeName}" card ?`)) {

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

    // cal display location
    if (data.latitude && data.latitude != 0 && data.longitude && data.longitude != 0) {
        displayLocation = `${(+data.latitude).toFixed(4)}, ${(+data.longitude).toFixed(4)}`;
    }

    // check disable filter
    if (isFilter || data.isDisable) {
        filterCardClass = filterCSSClass;
    }

    // check theme
    let cardHeaderThemeColor: string;
    let cardBodyThemeColor: string;
    let cardLabelThemeColor: string;
    let cardDataThemeColor: string;
    let cardCreateDateThemeColor: string;
    let deleteCardBtnThemeColor: string;
    let switchBtnColorTheme: string;
    let cardBorderThemeColor: string;
    let linkToMapIconThemeColor: string;

    if (isDarkTheme) {

        cardHeaderThemeColor = "text-babyblue";
        cardBodyThemeColor = "bg-mainblack";
        cardLabelThemeColor = "text-lightgray";
        cardDataThemeColor = "text-ashgray";
        cardCreateDateThemeColor = "text-slategray";
        deleteCardBtnThemeColor = "text-milk-orange";
        switchBtnColorTheme = "custom-switch-dark";
        cardBorderThemeColor = "border-secondary rounded-4"; // rounded-5
        linkToMapIconThemeColor= "text-milk-orange"
    }
    else {
        cardHeaderThemeColor = "text-viridian-green";
        cardBodyThemeColor = "bg-ivory";
        cardLabelThemeColor = "text-dark";
        cardDataThemeColor = "text-secondary";
        cardCreateDateThemeColor = "";
        deleteCardBtnThemeColor = "text-danger";
        switchBtnColorTheme = "custom-switch-light";
        cardBorderThemeColor = "text-ashgray rounded-3"; // rounded-4
        linkToMapIconThemeColor= "text-danger"
    }

    return (
        <div 
            id={cardId}
            className={`card position-relative mb-3 border-0 shadow ${cardBorderThemeColor} ${filterCardClass}`}
        >  
            {/* delete btn */}
            <div 
                className="position-absolute top-0 start-100 translate-middle"
                onClick={() => DeletePlace(data.id, data.name)}
            >
                <i className={`fa-solid fa-circle-xmark text-delete-card-size ${deleteCardBtnThemeColor}`}></i>
            </div>  
            <div className={`card-body ${cardBodyThemeColor} text-size-14 px-3 pt-2 pb-0 rounded-3`}> {/* rounded-4 */}
                <div className={`d-flex justify-content-between align-items-center ${cardHeaderThemeColor} text-size-18 mb-2`}>
                    <div 
                        className="text-nowrap"
                        onClick={() => data.isDisable ? null : linkCardToMapPageHandler(data.id)}
                    >
                        {
                            data.name.trim().length < 29
                                ? <>
                                    {data.name.trim()}
                                    {
                                        data.latitude && data.longitude && !data.isDisable
                                            ? <i className={`fa-solid fa-location-arrow ms-2 ${linkToMapIconThemeColor} text-footer-size`}></i>
                                            : null
                                    }
                                </>
                                : <>{data.name.trim().slice(0, 29)}..</>
                        }
                    </div>
                    <div className="text-nowrap">
                        {data.locationDistance.toFixed(2)} km
                    </div>
                 </div>

                <div className="d-flex justify-content-between align-items-center">
                    <div className={`${cardLabelThemeColor} lh-sm`}>
                        Message: &nbsp;
                        <span className={cardDataThemeColor}>
                            {data.reminderMessage ? data.reminderMessage.trim() : "-"}
                        </span>
                    </div>
                 </div>
                 <div className="d-flex justify-content-between align-items-center">
                    <div className={`${cardLabelThemeColor} lh-sm`}>
                        Location: &nbsp;
                        <span className={cardDataThemeColor}>
                            {displayLocation}
                        </span>
                    </div>
                    <div className="form-check form-switch m-0">
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
                    <div className={`${cardLabelThemeColor} lh-sm`}>
                        Date: &nbsp;
                        {
                            data.reminderDate ? 
                            <span className={linkToMapIconThemeColor}>{data.reminderDate}</span>
                            :
                            <span className={cardDataThemeColor}>-</span>
                        }
                    </div>
                 </div>

                 <div 
                    className={`text-end my-1 h-25 ${cardCreateDateThemeColor} text-card-footer-size`}
                    onClick={() => updatePlaceCardHandler(data.id)}
                >
                    {data.displayCreateAt}
                    <i className="fa-solid fa-pen-to-square mx-2"></i>
                 </div>
            </div>
        </div>
    )
}