'use client';

import { ResponseModel } from "@/model/response_model";
import { IPlaceCardProps, UpdatePlace } from "@/model/subentity_model";
import { useState } from "react";

// Initialize .ENV variable
const baseUrlApi: string = process.env.NEXT_PUBLIC_BASEURL_API ?? "";

export default function PlaceCard({ data }: IPlaceCardProps) {
  
    const [ placeStatus, setPlaceStatus ] = useState<boolean>(data.isDisable);

    //change place active status handler
    const ChangePlaceStatus = async () => {
        
        // update UI check box by useState
        setPlaceStatus(!placeStatus);

        // update place display status data with only
        const updatePlace: UpdatePlace = {
            id: data.id,
            isDisable: !placeStatus
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


    return (
        <div className="card mb-3 shadow-sm rounded-4">
            <div className="card-header rounded-top-4" style={{ backgroundColor: "#fffaca" }}>
                <div className="row">
                    <div className="col-8 text-start text-success" style={{ fontSize: "20px" }}>
                        { data.name } 
                    </div>
                    <div className="col text-end text-success" style={{ fontSize: "20px" }}>
                        { data.locationDistance.toFixed(2) } km
                    </div>
                 </div>
            </div>
            <div className="card-body rounded-bottom-4 bg-white">
                <div className="row">
                    <div className="col text-start text-dark">
                        Message: &nbsp;
                        <span className="text-secondary">
                            { data.reminderMessage ?? "-" }
                        </span>
                    </div>
                 </div>
                 <div className="row">
                    <div className="col-9 text-start text-dark">
                        location: &nbsp;
                        <span className="text-secondary">
                            { data.latitude.toFixed(4) }, { data.longitude.toFixed(4) }
                        </span>
                    </div>
                    <div className="col d-flex justify-content-end">
                        <div className="form-check form-switch">
                            {
                                <input type="checkbox" 
                                    className="form-check-input" 
                                    checked={!placeStatus} 
                                    onChange={ChangePlaceStatus}
                                />
                            }
                        </div>
                    </div>
                 </div>
                 <div className="row">
                    <div className="col text-start text-dark">
                        Date: &nbsp;
                        <span className="text-danger text-opacity-75">
                            { data.reminderDate ?? "-" }
                        </span>
                    </div>
                 </div>
            </div>
        </div>
    )
}