import { IMapPopupFooterProps } from "@/model/propsModel";

export default function MapPopupFooter({ name, zoomHandler }: IMapPopupFooterProps) {

    return <div className='card-footer text-card-footer-size text-center py-0'>
        <div className='d-flex justify-content-around'>
            <span 
                className='text-decoration-underline text-cornflowerblue me-2'
                onClick={() => zoomHandler(name, true)}
            >
                zoom
            </span>
            <span 
                className='text-decoration-underline text-viridian-green ms-2'
                onClick={() => zoomHandler(name, false)}
            >
                focus
            </span>
        </div>
    </div>
}