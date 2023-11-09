import { MapViewEnum } from "@/model/mapModel";
import { IUserPopupFooterProps } from "@/model/propsModel";

export default function UserPopupFooter({ setMapView, markNewLocationAtUser }: IUserPopupFooterProps) {

    return <div className={`d-flex ${markNewLocationAtUser ? 'justify-content-around' : 'justify-content-evenly'} mt-2`}>
        <i 
            className="fa-solid fa-magnifying-glass-location text-success h5"
            onClick={() => setMapView(MapViewEnum.Zoom)}
        ></i>
        <i 
            className="fa-solid fa-bullseye text-secondary h5"
            onClick={() => setMapView(MapViewEnum.Focus)}
        ></i>
        {
            markNewLocationAtUser
                ? <i 
                    className="fa-solid fa-location-dot text-danger h5"
                    onClick={markNewLocationAtUser}
                ></i>
                : null
        }
    </div>
}