export interface IPlace {
    id : string
    name : string,
    latitude : number,
    longitude : number,
    isDisable : boolean,
    createAt : Date
};

export interface IPlaceCreate {
    name : string,
    latitude : number,
    longitude : number
};