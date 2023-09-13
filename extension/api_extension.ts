export const GetLastVariableFromPath = (url: string) => {
    return url.slice(url.lastIndexOf("/") + 1);
}

// custom Geolocation option setting
export const CustomGeoLocationOption: PositionOptions = {
    enableHighAccuracy: true, // use hign accuraacy location
    timeout: 60000, // 60 sec or 1 min timeout
    maximumAge: 0, // no location cache
}
