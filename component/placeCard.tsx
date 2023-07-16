'use client';

import { ResponseModel } from "@/model/response_model";
import { UpdatePlace } from "@/model/subentity_model";
import { IPlaceCardProps } from "@/model/props_model";
import { useEffect, useState } from "react";

// Initialize .ENV variable
const baseUrlApi: string = process.env.NEXT_PUBLIC_BASEURL_API ?? "";

export default function PlaceCard({ data, cardIndex }: IPlaceCardProps) {
  
    // Const variable initialize
    const cardId = `placeCard_${cardIndex}`;

    // react hook initialize
    const [ placeDisplayStatus, setPlaceStatus ] = useState<boolean>(data.isDisable);

    // change place active status handler
    const ChangePlaceStatus = async () => {
        
        // update UI check box by useState
        setPlaceStatus(!placeDisplayStatus);

        // update place display status data with only
        const updatePlace: UpdatePlace = {
            id: data.id,
            isDisable: !placeDisplayStatus
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

    // check disable filter
    useEffect(() => {

        const placeCard = document.getElementById(cardId);

        if (placeDisplayStatus) {
            placeCard?.classList.add("filter-card");
        }
        else {
            placeCard?.classList.remove("filter-card");
        }

    }, [placeDisplayStatus]);

    return (
        <div id={cardId} className="card mb-3 shadow-sm rounded-4">
            <div className="card-header rounded-top-4 bg-milk-green">
                <div className="d-flex justify-content-between align-items-center text-white text-size-20">
                    <div>{data.name}</div>
                    <div className="text-nowrap">
                        {data.locationDistance.toFixed(2)} km
                    </div>
                 </div>
            </div>
            <div className="card-body rounded-bottom-4 bg-milk-yellow">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="text-dark">
                        Message: &nbsp;
                        <span className="text-secondary">
                            {data.reminderMessage ?? "-"}
                        </span>
                    </div>
                 </div>
                 <div className="d-flex justify-content-between align-items-center">
                    <div className="text-dark">
                        location: &nbsp;
                        <span className="text-secondary">
                            {data.latitude.toFixed(4)}, {data.longitude.toFixed(4)}
                        </span>
                    </div>
                    <div className="form-check form-switch">
                        {
                            <input type="checkbox" 
                                className="form-check-input" 
                                checked={!placeDisplayStatus} 
                                onChange={ChangePlaceStatus}
                            />
                        }
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