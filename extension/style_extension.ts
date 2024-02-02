import { AppBgColorEnum, MapTitleEnum } from "@/model/enumModel";
import { IContainerClass, MapMetaData } from "@/model/mapModel";

const containerClassObject: IContainerClass = {
    notMapClass: ["mb-5", "mt-4", "mx-3-half"],
    mapClass: []
}

export const GetStringContainerClassObject = (isMap: boolean) => {
    return isMap ? containerClassObject.mapClass.join(' ') : containerClassObject.notMapClass.join(' ');
}

// set container class to not map class
export const SetPageContainerClass = (isMap: boolean) => {
    const containerElement = document.getElementById("containerId") as HTMLElement;

    if (isMap) {
        // add map container class
        containerClassObject.mapClass.forEach(e => {
            containerElement.classList.add(e);
        });

        // remove notmap container class
        containerClassObject.notMapClass.forEach(e => {
            containerElement.classList.remove(e);
        });
    }
    else {

        // remove map container class
        containerClassObject.mapClass.forEach(e => {
            containerElement.classList.remove(e);
        });

        // add notmap container class
        containerClassObject.notMapClass.forEach(e => {
            containerElement.classList.add(e);
        });
    }
}

export const SetAppBackgroundColorHandler = (isDarkTheme: boolean, isMapPage: boolean, mapStyle: MapTitleEnum, isTransition?: boolean) => {

    if (typeof document !== 'undefined') {
        
        const htmlElement: HTMLElement = document.getElementsByTagName("html")[0];
        const bodyElement: HTMLElement = document.getElementsByTagName("body")[0];

        if (isTransition) {
            htmlElement.classList.add("theme-transition-ease-out-25");
            bodyElement.classList.add("theme-transition-ease-out-25");
        }
        else {
            htmlElement.classList.remove("theme-transition-ease-out-25");
            bodyElement.classList.remove("theme-transition-ease-out-25");
        }
    
        const colorHexCode = GetAppBackgroundColor(isDarkTheme 
            ? AppBgColorEnum.MainDark 
            : AppBgColorEnum.MainLight);

        htmlElement.style.backgroundColor = colorHexCode;
        bodyElement.style.backgroundColor = colorHexCode;
    }
};

const GetAppBackgroundColor = (bgStatus: AppBgColorEnum) => {
    switch (bgStatus) {
        case AppBgColorEnum.MainLight:
            return "#f5f5f5";
        case AppBgColorEnum.MainDark:
            return "#36393e";
    }
}