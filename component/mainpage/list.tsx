import { IListPageProps } from "@/model/props_model";
import PlaceCard from "../placeCard";
import loadingImage from '@/public/image/loading.png';

export default function List({ places, currentUserId, deletePlaceHandler }: IListPageProps) {
    return (
        <>
            {
                places.length > 0 && places.at(0)?.userId == currentUserId ?

                places.map((element, index) => {
                    return (
                        <PlaceCard key={index} data={element} cardIndex={index} deletePlaceHandler={deletePlaceHandler}></PlaceCard>
                    );
                })
                : 
                <div className="text-center m-5">
                    <img className="spin-rotate" src={loadingImage.src} alt="loadingImage" width={60} height={60} />
                </div>
            }
        </>
    )
}