import { MapViewEnum } from "@/model/mapModel";
import { IUserPopupFooterProps } from "@/model/propsModel";

export default function UserPopupFooter({ setMapView, markNewLocationAtUser, isDarkTheme }: IUserPopupFooterProps) {

    const btnColorTheme = isDarkTheme ? "bg-steelblue" : "bg-viridian-green";

    return <div className='d-flex justify-content-evenly mt-2'>
        <button 
            className="btn btn-sm btn-secondary py-0 px-1 me-1"
            onClick={() => setMapView(MapViewEnum.Zoom)}
        >
            zoom
            <i className="fa-solid fa-magnifying-glass-plus ms-1"></i>
        </button>
        <button 
            className={`btn btn-sm ${btnColorTheme} text-white py-0 px-1 ms-1`}
            onClick={() => setMapView(MapViewEnum.Focus)}
        >
            focus
            <i className="fa-solid fa-location-crosshairs ms-1"></i>
        </button>
        {
            markNewLocationAtUser
                ? <button 
                    className="btn btn-sm btn-danger py-0 px-1 ms-2"
                    onClick={markNewLocationAtUser}
                >
                    mark
                    <i className="fa-solid fa-location-dot ms-1"></i>
                </button>
                : null
        }
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