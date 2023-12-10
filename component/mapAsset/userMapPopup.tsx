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

    let cardColorTheme: string;
    let textColorTheme: string;
    let nameColorTheme: string;

    if (isDarkTheme) {
        cardColorTheme = "bg-mainblack";
        textColorTheme = "text-lightblue";
        nameColorTheme = "text-milk-orange";
    }
    else {
        cardColorTheme = "bg-ivory";
        textColorTheme = "text-viridian-green";
        nameColorTheme = "text-danger";
    }

    return <Popup autoPan={false}>
        <div className={`card p-1 rounded-3 shadow-lg ${googleFont.className} ${cardColorTheme}`}>
            <div className={`card-body text-center ${textColorTheme} p-2 rounded-3`}>
                <span className={`text-decoration-underline ${nameColorTheme}`}>
                    {userName.toUpperCase()}
                </span> is here! 
                <UserPopupFooter
                    setMapView={setMapView}
                    markNewLocationAtUser={markNewLocationAtUser}
                    isDarkTheme={isDarkTheme}
                ></UserPopupFooter>
            </div>
        </div>
    </Popup>
}
