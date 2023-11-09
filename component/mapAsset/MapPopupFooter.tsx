import { MapViewEnum } from "@/model/mapModel";
import { IMapPopupFooterProps } from "@/model/propsModel";

export default function MapPopupFooter({ name, setMapView }: IMapPopupFooterProps) {

    return <div className="d-flex justify-content-evenly mt-2">
        <i 
            className="fa-solid fa-magnifying-glass-location text-success h5"
            onClick={() => setMapView(MapViewEnum.Zoom, name)}
        ></i>
        <i 
            className="fa-solid fa-bullseye text-secondary h5"
            onClick={() => setMapView(MapViewEnum.Focus, name)}
        ></i>
    </div>
}