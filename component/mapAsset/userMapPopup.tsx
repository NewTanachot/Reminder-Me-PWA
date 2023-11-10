import { IUserMapPopupProps } from '@/model/propsModel'
import { Athiti } from 'next/font/google';
import { Popup } from 'react-leaflet'
import UserPopupFooter from './UserPopupFooter';
import 'leaflet/dist/leaflet.css'

const googleFont = Athiti({
    weight: '600',
    subsets: ['latin'],
    display: "swap"
});

export default function UserMapPopup({ userName, setMapView, markNewLocationAtUser, isDarkTheme }: IUserMapPopupProps) {

    return <Popup>
        <div className={`card shadow-sm border border-2 ${googleFont.className}`}>
            <div className='card-body text-center text-secondary p-2 rounded-3'>
                <span className='text-decoration-underline'>{userName}</span> is here! 
                <UserPopupFooter
                    setMapView={setMapView}
                    markNewLocationAtUser={markNewLocationAtUser}
                ></UserPopupFooter>
            </div>
        </div>
    </Popup>
}