import { MapViewEnum } from "@/model/mapModel";
import { IUserPopupFooterProps } from "@/model/propsModel";

export default function UserPopupFooter({ setMapView, markNewLocationAtUser }: IUserPopupFooterProps) {

    return <div className='d-flex justify-content-around mt-2'>
        <button className="btn btn-sm btn-success py-0 px-1 me-1">
            zoom
        </button>
        <button className="btn btn-sm btn-secondary py-0 px-1 ms-1">
            focus
        </button>
        <button className="btn btn-sm btn-danger py-0 px-1 ms-2">
            mark
        </button>
    </div>

    // return <div className={`d-flex ${markNewLocationAtUser ? 'justify-content-around' : 'justify-content-evenly'} mt-2`}>
    //     <i 
    //         className="fa-solid fa-magnifying-glass-location text-success h5"
    //         onClick={() => setMapView(MapViewEnum.Zoom)}
    //     ></i>
    //     <i 
    //         className="fa-solid fa-bullseye text-secondary h5"
    //         onClick={() => setMapView(MapViewEnum.Focus)}
    //     ></i>
    //     {
    //         markNewLocationAtUser
    //             ? <i 
    //                 className="fa-solid fa-location-dot text-danger h5"
    //                 onClick={markNewLocationAtUser}
    //             ></i>
    //             : null
    //     }
    // </div>
}