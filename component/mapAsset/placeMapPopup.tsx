import { Athiti } from 'next/font/google';
import { IsStringValid } from '@/extension/string_extension';
import { IPlaceMapPopupProps } from '@/model/propsModel';
import { Popup } from 'react-leaflet';
import MapPopupFooter from './MapPopupFooter';
import { isDataView } from 'util/types';

const googleFont = Athiti({
    weight: '600',
    subsets: ['latin'],
    display: "swap"
});

export default function PlaceMapPopup({ name, message, date, setMapView, isDarkTheme }: IPlaceMapPopupProps) {

    const textColorTheme = isDarkTheme ? "text-glaucous" : "text-viridian-green";

    return <Popup autoPan={false}>
        <div className={`card shadow-sm border border-2 ${googleFont.className}`}>
            <div className='card-body text-dark p-2 rounded-3'>
                <div>
                    name: <span className={textColorTheme}>{name}</span>
                </div>
                <div>
                    message: <span className={textColorTheme}>{IsStringValid(message) ? message : "-"}</span>
                </div>
                <div>
                    date: {
                        IsStringValid(date) 
                            ? <span className='text-gold'>{date}</span> 
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