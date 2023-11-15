import { IUserMapPopupProps } from '@/model/propsModel';
import { Athiti } from 'next/font/google';
import { Popup } from 'react-leaflet';
import UserPopupFooter from './UserPopupFooter';

const googleFont = Athiti({
    weight: '600',
    subsets: ['latin'],
    display: "swap"
});

export default function UserMapPopup({ userName, setMapView, markNewLocationAtUser, isDarkTheme }: IUserMapPopupProps) {

    const textColorTheme = isDarkTheme ? "text-cobalt-blue" : "text-viridian-green";

    return <Popup autoPan={false}>
        <div className={`card shadow-sm border border-2 ${googleFont.className}`}>
            <div className={`card-body text-center ${textColorTheme} p-2 rounded-3`}>
                <span className='text-decoration-underline'>{userName}</span> is here! 
                <UserPopupFooter
                    setMapView={setMapView}
                    markNewLocationAtUser={markNewLocationAtUser}
                    isDarkTheme={isDarkTheme}
                ></UserPopupFooter>
            </div>
        </div>
    </Popup>
}
