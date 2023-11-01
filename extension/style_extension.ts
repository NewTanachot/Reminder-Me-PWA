import { IContainerClass } from "@/model/mapModel";

// set container class to not map class
export const SetPageContainerClass = (containerClassObject: IContainerClass, isMap: boolean) => {
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