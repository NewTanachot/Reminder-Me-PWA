import { MapViewEnum } from "@/model/mapModel";
import { IMapPopupFooterProps } from "@/model/propsModel";

export default function MapPopupFooter({ name, setMapView, isDarkTheme }: IMapPopupFooterProps) {

    let btnColorTheme = isDarkTheme ? "bg-steelblue" : "bg-viridian-green";

    return <div className='d-flex justify-content-evenly mt-2'>
        <button 
            className="btn btn-sm btn-secondary py-0 px-1 me-1"
            onClick={() => setMapView(MapViewEnum.Zoom, name)}
        >
            zoom
            <i className="fa-solid fa-magnifying-glass-plus ms-1"></i>
        </button>
        <button 
            className={`btn btn-sm ${btnColorTheme} text-white py-0 px-1 ms-1`}
            onClick={() => setMapView(MapViewEnum.Focus, name)}
        >
            focus
            <i className="fa-solid fa-location-crosshairs ms-1"></i>
        </button>
    </div>
}