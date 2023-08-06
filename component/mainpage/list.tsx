import { IListPageProps } from "@/model/props_model";
import PlaceCard from "../placeCard";
import Loading from "../loading";
import NotFound from "../notfound";
import UserInfo from "../userInfo";

export default function List({ places, currentUser, deletePlaceHandler, changePlaceStatusHandler }: IListPageProps) {

    return (
        <>
            {(() => {
                console.log(places)
                if (places == undefined || (places.length != 0 && places.at(0)?.userId != currentUser.userId)) {
                    return <Loading></Loading>
                }
                else if (places.length == 0) {
                    return (
                        <>
                            <UserInfo 
                                username={currentUser.userName}
                                location={currentUser.userLocation}
                            ></UserInfo>
                            <NotFound></NotFound>
                        </>
                    )
                }      
                else {
                    return (
                        <>
                            <UserInfo 
                                username={currentUser.userName}
                                location={currentUser.userLocation}
                            ></UserInfo>
                            {
                                places.map((element, index) => {
                                    return <PlaceCard 
                                        key={index} 
                                        data={element} 
                                        cardIndex={index} 
                                        deletePlaceHandler={deletePlaceHandler}
                                        changePlaceStatusHandler={changePlaceStatusHandler}
                                    ></PlaceCard>
                                }) 
                            }
                        </>
                    )
                }

            })()}
        </>
    )
}