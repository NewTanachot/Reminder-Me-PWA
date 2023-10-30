import { CalDistanceModel } from "@/model/calculationModel";
import { IDisplayPlace, IUpsertFormData } from "@/model/useStateModel";
import { Place } from "@prisma/client";
import { StringDateToDisplayDate } from "./string_extension";
import { IBaseLocation } from "@/model/subentityModel";
import { CardOrderByEnum } from "@/model/enumModel";
import { IMarker } from "@/model/mapModel";

export const CalculatePlaceForDisplay = (places: Place[] | IDisplayPlace[], currentLocation: IBaseLocation) => {

    return places.map((e) => {

        // get location distance for each place
        return <IDisplayPlace> {
            id: e.id,
            name: e.name,
            latitude: e.latitude,
            longitude: e.longitude,
            reminderMessage: e.reminderMessage,
            reminderDate: StringDateToDisplayDate(e.reminderDate),
            isDisable: e.isDisable,
            createdAt: e.createdAt,
            displayCreateAt: StringDateToDisplayDate(e.createdAt, true),
            userId: e.userId,
            locationDistance: GetDistanceBetweenPlace({
                latitude_1: currentLocation?.latitude,
                longitude_1: currentLocation?.longitude,
                latitude_2: e.latitude?.toString() == undefined ? undefined : +(e.latitude?.toString()),
                longitude_2: e.longitude?.toString() == undefined ? undefined : +(e.longitude?.toString()),
            })
        }
    });
}

const GetDistanceBetweenPlace = (calModel: CalDistanceModel) => {

    if (!calModel.latitude_1 || !calModel.latitude_2 || !calModel.longitude_1 || !calModel.longitude_2) {
        return 0;
    }

    var R = 6371; // Radius of the earth in km
    var dLat = Deg2rad(calModel.latitude_2 - calModel.latitude_1);  // deg2rad below
    var dLon = Deg2rad(calModel.longitude_2 - calModel.longitude_1); 

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(Deg2rad(calModel.latitude_1)) * Math.cos(Deg2rad(calModel.latitude_2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
       
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
}
  
const Deg2rad = (deg: number) => {
    return deg * (Math.PI/180)
}

export const OrderPlaceByDistance = (place: IDisplayPlace[], orderBy: CardOrderByEnum) => {

    let result: IDisplayPlace[];

    switch (orderBy) {

        case CardOrderByEnum.CreateDate:

            result = place.sort((a,b) => {

                const createDateA = new Date(a.createdAt);
                const createDateB = new Date(b.createdAt);

                return createDateA.getTime() - createDateB.getTime();
            });

            break;
        
        case CardOrderByEnum.CreateDateDESC:
            
            result = place.sort((a,b) => {

                const createDateA = new Date(a.createdAt);
                const createDateB = new Date(b.createdAt);

                return createDateB.getTime() - createDateA.getTime();
            });

            break;

        case CardOrderByEnum.Distance:
            result = place.sort((a,b) => a.locationDistance - b.locationDistance);
            break;

        case CardOrderByEnum.DistanceDESC:
            result = place.sort((a,b) => b.locationDistance - a.locationDistance);
            break;

        default: 
            result = place;
            break;
    }

    return result;
}

export const GetPlaceMarkers = (places?: IDisplayPlace[]) => {

    const result: IMarker[] | undefined = places?.filter(place => place.latitude && place.longitude && !place.isDisable)
    .map(place => ({
        markerName: place.name,
        markerMessage: place.reminderMessage ?? undefined,
        markerDate: place.reminderDate ?? undefined,
        markerLocation: {
            latitude: place.latitude as number,
            longitude: place.longitude as number
        }
    }));

    return result;
}

export const GetNewMarkerLocation = (data?: IUpsertFormData) => {

    let newMarkerLocationRequest: IBaseLocation | undefined;
    if (data?.latitude && data?.longitude) {
        newMarkerLocationRequest = {
            latitude: +data.latitude,
            longitude: +data.longitude
        }
    }

    return newMarkerLocationRequest;
}