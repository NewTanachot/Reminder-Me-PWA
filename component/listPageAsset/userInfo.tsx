import { IUserInfoProps } from "@/model/props_model";

export default function UserInfo({ username, location }: IUserInfoProps) {

    const displayUsername = username.length < 5 ? username : `${username.substring(0,5)}.. `;

    return (
        <div className="card mb-3 shadow-sm rounded-4 bg-cornflowerblue text-white">
            <div className="card-body d-flex justify-content-between align-items-center">
                <p className="m-0">
                    <i className="bi bi-person-circle me-2 h5"></i>
                    {displayUsername} {location.latitude}, {location.longitude}
                </p>
                <div>
                    <button className="btn btn-sm btn-primary bg-gradient">
                        <i className="bi bi-pin-map-fill"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}