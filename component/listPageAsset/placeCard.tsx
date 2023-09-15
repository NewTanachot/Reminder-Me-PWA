'use client';

import { ResponseModel } from "@/model/response_model";
import { UpdatePlace } from "@/model/subentity_model";
import { IPlaceCardProps } from "@/model/props_model";
import { useEffect } from "react";
import { PwaCurrentPage } from "@/model/enum_model";

// Initialize .ENV variable
const baseUrlApi: string = process.env.NEXT_PUBLIC_BASEURL_API ?? "";

export default function PlaceCard({ data, cardIndex, deletePlaceHandler, changePlaceStatusHandler, updatePlaceCardHandler }: IPlaceCardProps) {
  
    // Const variable initialize
    const cardId = `placeCard_${cardIndex}`;

    // change place active status handler
    const ChangePlaceStatus = async (event: React.ChangeEvent<HTMLInputElement>) => {
        
        // update places state (Cache data) in list page
        const setIsDisable = !event.currentTarget.checked;
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
    useEffect(() => {

        const placeCard = document.getElementById(cardId);

        if (data.isDisable) {
            placeCard?.classList.add("filter-card");
        }
        else {
            placeCard?.classList.remove("filter-card");
        }

    });

    return (
        <div id={cardId} className="card mb-3 shadow-sm rounded-4 position-relative">    
            <div 
                className="position-absolute top-0 start-100 translate-middle"
                onClick={() => DeletePlace(data.id, data.name)}
            >
                <i className="bi bi-x-circle-fill text-danger text-delete-card-size"></i>
            </div>         
            <div className="card-header rounded-top-4 bg-warning-subtle text-viridian-green">
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
            <div className="card-body rounded-bottom-4 bg-peach-65">
                <div className="d-flex justify-content-between align-items-center">
                    <p className="text-dark m-0 lh-1">
                        Message: &nbsp;
                        <span className="text-secondary">
                            {data.reminderMessage ?? "-"}
                        </span>
                    </p>
                 </div>
                 <div className="d-flex justify-content-between align-items-center">
                    <div className="text-dark">
                        location: &nbsp;
                        <span className="text-secondary">
                            {(+data.latitude).toFixed(4)}, {(+data.longitude).toFixed(4)}
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
                            <span className="text-danger text-opacity-75">{data.reminderDate}</span>
                            :
                            <span className="text-secondary">-</span>
                        }
                    </div>
                 </div>
            </div>
        </div>
    )
}