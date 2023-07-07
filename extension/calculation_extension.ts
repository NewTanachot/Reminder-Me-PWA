import { CalDistanceModel } from "@/model/calculation_model";
import { IDisplayPlace } from "@/model/subentity_model";

export const GetDistanceBetweenPlace = (calModel: CalDistanceModel) => {

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

export const OrderPlaceByDistance = (place: IDisplayPlace[]) => {
    return place.sort((a,b) => a.locationDistance - b.locationDistance); // b - a for reverse sort
}