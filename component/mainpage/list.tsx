import { IListPageProps } from "@/model/propsModel";
import PlaceCard from "../listPageAsset/placeCard";
import Loading from "./loading";
import NotFound from "../modalAsset/notfound";
import UserInfo from "../listPageAsset/userInfo";

export default function List({ 
        places, 
        currentUser, 
        deletePlaceHandler, 
        changePlaceStatusHandler, 
        updatePlaceCardHandler, 
        isDarkTheme,
        currentCardOrder,
        changeCardOrderByHandler
    }: IListPageProps) {

    return (
        <>
            {(() => {
                if (places == undefined || (places.length != 0 && places.at(0)?.userId != currentUser.userId)) {
                    return <Loading
                        isDarkTheme={isDarkTheme}
                    ></Loading>
                }
                else if (places.length == 0) {
                    return (
                        <>
                            <UserInfo 
                                isDarkTheme={isDarkTheme}
                                username={currentUser.userName}
                                location={currentUser.userLocation}
                                currentCardOrder={currentCardOrder}
                                changeCardOrderByHandler={changeCardOrderByHandler}
                            ></UserInfo>
                            <NotFound></NotFound>
                        </>
                    )
                }      
                else {
                    return (
                        <>
                            <UserInfo
                                isDarkTheme={isDarkTheme} 
                                username={currentUser.userName}
                                location={currentUser.userLocation}
                                currentCardOrder={currentCardOrder}
                                changeCardOrderByHandler={changeCardOrderByHandler}
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