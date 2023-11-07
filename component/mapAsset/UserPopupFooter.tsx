import { IUserPopupFooterProps } from "@/model/propsModel";

export default function UserPopupFooter({ zoomUserMarkerHandler, markNewLocationAtUser }: IUserPopupFooterProps) {

    let MarkComponent = () => markNewLocationAtUser 
        ? <span 
            className='text-decoration-underline text-danger ms-3'
            onClick={markNewLocationAtUser}
        >
            mark
        </span> 
        : <></>

    return <div className='card-footer text-card-footer-size text-center py-0'>
        <div className='d-flex justify-content-around'>
            <span 
                className='text-decoration-underline text-cornflowerblue me-2'
                onClick={() => zoomUserMarkerHandler(true)}
            >
                zoom
            </span>
            <span 
                className='text-decoration-underline text-viridian-green ms-2'
                onClick={() => zoomUserMarkerHandler(false)}
            >
                focus
            </span>
            <></>
        </div>
    </div>
}