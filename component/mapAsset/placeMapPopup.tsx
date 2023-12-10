import { Athiti } from 'next/font/google';
import { IsStringValid } from '@/extension/string_extension';
import { IPlaceMapPopupProps } from '@/model/propsModel';
import { Popup } from 'react-leaflet';
import MapPopupFooter from './MapPopupFooter';

const googleFont = Athiti({
    weight: '600',
    subsets: ['latin'],
    display: "swap"
});

export default function PlaceMapPopup({ name, message, date, setMapView, isDarkTheme }: IPlaceMapPopupProps) {

    let cardColorTheme: string;
    let textColorTheme: string;
    let labelColorTheme: string;
    let dateColorTheme: string;

    if (isDarkTheme) {
        cardColorTheme= "bg-mainblack";
        textColorTheme = "text-lightblue";
        labelColorTheme = "text-lightgray";
        dateColorTheme = "text-milk-orange";
    }
    else {
        cardColorTheme= "bg-ivory";
        textColorTheme = "text-viridian-green";
        labelColorTheme = "text-dark";
        dateColorTheme = "text-gold";
    }

    return <Popup autoPan={false}>
        <div className={`card p-1 rounded-3 shadow-lg ${googleFont.className} ${cardColorTheme}`}>
            <div className='card-body text-dark p-2 rounded-3'>
                <div>
                    <span className={labelColorTheme}>
                        name: &nbsp;
                    </span>
                    <span className={textColorTheme}>
                        {name}
                    </span>
                </div>
                <div>
                    <span className={labelColorTheme}>
                        message: &nbsp;
                    </span>
                    <span className={textColorTheme}>
                        {IsStringValid(message) ? message : "-"}
                    </span>
                </div>
                <div>
                    <span className={labelColorTheme}>
                        date: &nbsp;
                    </span>
                    {
                        IsStringValid(date) 
                            ? <span className={dateColorTheme}>{date}</span> 
                            : <span className={textColorTheme}>-</span>
                    }
                </div>
                <MapPopupFooter
                    name={name}
                    setMapView={setMapView}
                    isDarkTheme={isDarkTheme}
                ></MapPopupFooter>
            </div>
        </div>
    </Popup>
}