import { IUserInfoProps } from "@/model/propsModel";

export default function UserInfo({ username, location, isDarkTheme }: IUserInfoProps) {

    const displayUsername = username.length < 5 ? username : `${username.substring(0,5)}.. `;

    let userInfoColorTheme = "";

    // check theme color
    if (isDarkTheme) {
        userInfoColorTheme = "bg-mainblue";
    }
    else {
        userInfoColorTheme = "bg-cornflowerblue";
    }

    return (
        <div className="shadow-sm" style={{ marginBottom: '28%' }}>
            <div 
                className={`card mb-3 rounded-4 text-white ${userInfoColorTheme} z-1 position-fixed start-50 translate-middle`} 
                style={{ marginTop: '8%', width: '86%' }}
            >
                <div className="card-body d-flex justify-content-between align-items-center text-whiteSmoke">
                    <p className="m-0">
                        <i className="bi bi-person-circle me-2 h5"></i>
                        {displayUsername} {location.latitude}, {location.longitude}
                    </p>
                    <div>
                        <button className="btn btn-sm btn-primary bg-gradient text-cream">
                            <i className="bi bi-pin-map-fill"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}