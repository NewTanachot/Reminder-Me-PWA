import { IListPageProps } from "@/model/props_model";
import PlaceCard from "../listPageAsset/placeCard";
import Loading from "../modalAsset/loading";
import NotFound from "../modalAsset/notfound";
import UserInfo from "../listPageAsset/userInfo";

export default function List({ places, currentUser, deletePlaceHandler, changePlaceStatusHandler, updatePlaceCardHandler, isDarkTheme }: IListPageProps) {

    return (
        <>
            {(() => {
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
                                        deletePlaceHandler={deletePlaceHandler}
                                        changePlaceStatusHandler={changePlaceStatusHandler}
                                        updatePlaceCardHandler={updatePlaceCardHandler}
                                        isDarkTheme={isDarkTheme}
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