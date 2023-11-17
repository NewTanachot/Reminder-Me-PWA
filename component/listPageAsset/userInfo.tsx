import { CardOrderByEnum } from "@/model/enumModel";
import { IUserInfoProps } from "@/model/propsModel";
import Link from "next/link";

export default function UserInfo({ username, location, isDarkTheme, currentCardOrder, changeCardOrderByHandler }: IUserInfoProps) {

    // change orderby handler
    const ChangeCardOrderByHandler = (event : React.ChangeEvent<HTMLSelectElement>) => {
        changeCardOrderByHandler(+event.target.value);
    }

    let userInfoColorTheme: string;
    let selectFormColorTheme: string;
    let btnColorTheme: string;

    // check theme color
    if (isDarkTheme) {
        userInfoColorTheme = "bg-mainblue";
        selectFormColorTheme = "bg-cornflowerblue text-white";
        btnColorTheme = "bg-cornflowerblue text-white";
    }
    else {
        userInfoColorTheme = "bg-cornflowerblue";
        selectFormColorTheme = "bg-whitesmoke";
        btnColorTheme = "btn-light bg-whitesmoke";
    }

    return (
        <div className={`card mb-3 rounded-4 text-white ${userInfoColorTheme} bg-gradient shadow-sm`}>
            <div className="card-body d-flex justify-content-center align-items-center text-white">
                <p className="m-0">
                    <i className="fa-solid fa-street-view me-2"></i>
                    {username + ": "} {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
                </p>
            </div>
            <div className="card-footer d-flex justify-content-evenly align-items-center">
                <select 
                    className={`form-select form-select-sm ${selectFormColorTheme} w-50`} 
                    defaultValue={currentCardOrder}
                    onChange={ChangeCardOrderByHandler}
                >
                    <option value={CardOrderByEnum.CreateDateDESC}>New - Old</option>
                    <option value={CardOrderByEnum.CreateDate}>Old - New</option>
                    <option value={CardOrderByEnum.DistanceDESC}>Long - Short</option>
                    <option value={CardOrderByEnum.Distance}>Short - Long</option>
                </select>
                <Link 
                    className={`btn btn-sm ${btnColorTheme} w-25`}
                    href="/testpage"
                >
                    <i className="fa-solid fa-map-location-dot"></i>
                </Link>
            </div>
        </div>
    )
}