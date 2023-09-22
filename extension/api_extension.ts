export const GetLastVariableFromPath = (url: string) => {
    return url.slice(url.lastIndexOf("/") + 1);
}

// custom Geolocation option setting
export const GetCustomGeoLocationOption = (timeOutSec?: number | undefined) => {
    
    return <PositionOptions> {
        enableHighAccuracy: true, // use hign accuraacy location
        maximumAge: 0, // no location cache
        timeout: timeOutSec ? timeOutSec * 1000 : 60000, // 60 sec or 1 min timeout
    }
}
