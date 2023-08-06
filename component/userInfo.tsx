import { IUserInfoProps } from "@/model/props_model";

export default function UserInfo({ username, location }: IUserInfoProps) {
    return (
        <div className="card mb-3 shadow-sm rounded-4 bg-cornflowerblue text-white">
            <div className="card-body d-flex justify-content-between align-items-center">
                <h5 className="m-0">
                    {username}: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </h5>
                <div>
                    <button className="btn btn-sm btn-primary bg-gradient">
                        <i className="bi bi-pin-map-fill"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}