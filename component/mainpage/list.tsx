import { IListPageProps } from "@/model/props_model";
import PlaceCard from "../placeCard";

export default function List({ places }: IListPageProps) {
    return (
        <>
            {
                places.length > 0 ?

                places.map((element, index) => {
                    return (
                        <PlaceCard key={index} data={element} cardIndex={index}></PlaceCard>
                    );
                })

                : <h1 className='text-center'>Loading...</h1> 
            }
        </>
    )
}