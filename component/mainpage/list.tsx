import { IListPageProps } from "@/model/props_model";
import PlaceCard from "../placeCard";
import Loading from "../loading";
import NotFound from "../notfound";

export default function List({ places, currentUserId, deletePlaceHandler, changePlaceStatusHandler }: IListPageProps) {

    return (
        <>
            {(() => {
                if (places == undefined || (places.length != 0 && places.at(0)?.userId != currentUserId)) {
                    return <Loading></Loading>
                }
                else if (places.length == 0) {
                    return <NotFound></NotFound>
                }      
                else {
                    return places.map((element, index) => {
                        return <PlaceCard 
                            key={index} 
                            data={element} 
                            cardIndex={index} 
                            deletePlaceHandler={deletePlaceHandler}
                            changePlaceStatusHandler={changePlaceStatusHandler}
                        ></PlaceCard>
                    }) 
                }

            })()}
        </>
    )
}