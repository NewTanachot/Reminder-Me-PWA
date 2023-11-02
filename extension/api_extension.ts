import { Place, User } from "@prisma/client";
import { IsStringValid } from "./string_extension";
import { IModelValidatorResponse } from "@/model/responseModel";

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
export const PlaceModelCreateValidator = (place: Place, alluserPlace: Place[]) => {
    
    let response: IModelValidatorResponse = {
        isValid: true
    }

    if (!IsStringValid(place.userId) || !IsStringValid(place.name)) {

        response.isValid = false;
        return response;
    }

    if (alluserPlace.some(e => e.name == place.name)) {

        response.isValid = false;
        response.message = "duplicate place name";
        return response;
    }

    return response;
}

export const PlaceModelUpdateValidator = (place: Place, alluserPlace: Place[]) => {
    
    let response: IModelValidatorResponse = {
        isValid: true
    }

    if (!IsStringValid(place.userId) || !IsStringValid(place.name)) {

        response.isValid = false;
        return response;
    }

    const placeDuplicateName = alluserPlace.filter(e => e.name == place.name).length

    if (placeDuplicateName != 0) {

        response.isValid = false;
        response.message = "duplicate place name";
        return response;
    }

    return response;
}

export const UserModelCreateValidator = (user: User, allUsers: User[]) => {

    let response: IModelValidatorResponse = {
        isValid: true
    }

    if (IsStringValid(user.password)) {
        response.isValid = false;
        response.message = "invalid empty password"; 
    }

    if (allUsers.some(e => e.name == user.name)) {
        response.isValid = false;
        response.message = "duplicate username";
    }

    return response;
}

export const UserModelUpdateValidator = (user: User, allUsers: User[]) => {

    let response: IModelValidatorResponse = {
        isValid: true
    }

    if (IsStringValid(user.password)) {
        response.isValid = false;
        response.message = "invalid empty password"; 
    }

    const userDuplicateNameCount = allUsers.filter(e => e.name = user.name).length;
    console.log(userDuplicateNameCount)

    if (userDuplicateNameCount != 0) {
        response.isValid = false;
        response.message = "duplicate username";
    }

    return response;
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
