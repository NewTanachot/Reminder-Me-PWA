import { IUserInfoProps } from "@/model/propsModel";
import Link from "next/link";

export default function UserInfo({ username, location, isDarkTheme }: IUserInfoProps) {

    let userInfoColorTheme = "";
    let selectFormColorTheme = "";
    let btnColorTheme = "";

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
        <div className={`card mb-3 rounded-4 text-white ${userInfoColorTheme} shadow-sm`}>
            <div className="card-body d-flex justify-content-center align-items-center text-white">
                <p className="m-0">
                    <i className="bi bi-person-circle h5 me-2"></i>
                    {username + ": "} {location.latitude}, {location.longitude}
                </p>
            </div>
            <div className="card-footer d-flex justify-content-evenly align-items-center">
                <select 
                    className={`form-select form-select-sm ${selectFormColorTheme} w-50`} 
                    aria-label=".form-select-sm example"
                >
                    <option value="3">Create date</option>
                    <option value="1">Distance</option>
                    <option value="2">Distance DESC</option>
                </select>
                <button className={`btn btn-sm ${btnColorTheme} w-25`}>
                    <i className="fa-solid fa-map-location-dot"></i>
                </button>
            </div>
        </div>
    )
}

// Static Info Component

// return (
//     <div className="shadow-sm" style={{ marginBottom: '28%' }}>
//         <div 
//             className={`card mb-3 rounded-4 text-white ${userInfoColorTheme} z-1 position-fixed start-50 translate-middle`} 
//             style={{ marginTop: '8%', width: '86%' }}
//         >
//             <div className="card-body d-flex justify-content-between align-items-center text-whiteSmoke">
//                 <p className="m-0">
//                     <i className="bi bi-person-circle me-2 h5"></i>
//                     {displayUsername} {location.latitude}, {location.longitude}
//                 </p>
//                 <div>
//                     {/* <button className="btn btn-sm btn-primary bg-gradient text-cream">
//                         <i className="bi bi-pin-map-fill"></i>
//                     </button> */}
//                     <Link href="/testpage" className="btn btn-sm btn-primary bg-gradient text-cream">
//                         <i className="bi bi-pin-map-fill"></i>
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     </div>
// )