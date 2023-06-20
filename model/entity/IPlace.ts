import { Decimal } from "@prisma/client/runtime"

export interface IPlace {
    id : string
    name : string,
    latitude : Decimal,
    longitude : Decimal,
    isDisable : boolean,
    createdAt : Date
};

export interface IPlaceCreate {
    name : string,
    latitude : Decimal,
    longitude : Decimal
};