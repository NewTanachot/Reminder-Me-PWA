import { Place, User } from "@prisma/client";
import { IsStringValid } from "./string_extension";

export const GetLastVariableFromPath = (url: string) => {
    return url.slice(url.lastIndexOf("/") + 1);
}

export const GetSecondLastVariableFromPath = (url: string) => {
    const splitvalue = url.split("/");
    return splitvalue[splitvalue.length - 2];
}

// custom Geolocation option setting
export const GetCustomGeoLocationOption = (timeOutSec?: number | undefined) => {
    
    return <PositionOptions> {
        enableHighAccuracy: true, // use hign accuraacy location
        maximumAge: 0, // no location cache
        timeout: timeOutSec ? timeOutSec * 1000 : 60000, // 60 sec or 1 min timeout
    }
}

// place object model validator
export const PlaceModelValidator = (place: Place) => {
    
    return !IsStringValid(place.userId) || !IsStringValid(place.name) ? false : true;
}

export const PlaceModelDecorator = (place: Place) => {

    // check if reminder is update to null
    if (!place.reminderDate) {
        place.reminderDate = null;
    }

    if (!place.latitude || !place.longitude) {
        place.latitude = null;
        place.longitude = null;
    }

    return place;
}

export const UserModelDecorator = (user: User) => {
    
    user.name = user.name.trim().toLowerCase();
    user.password = user.password.trim();

    return user;
}