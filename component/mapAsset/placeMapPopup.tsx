import { Athiti } from 'next/font/google'
import { IsStringValid } from '@/extension/string_extension'
import { IPlaceMapPopupProps } from '@/model/propsModel'
import { Popup } from 'react-leaflet'
import MapPopupFooter from './MapPopupFooter';

const googleFont = Athiti({
    weight: '600',
    subsets: ['latin'],
    display: "swap"
});

export default function PlaceMapPopup({ name, message, date, setMapView }: IPlaceMapPopupProps) {

    return <Popup>
        <div className={`card shadow-sm border border-2 ${googleFont.className}`}>
            <div className='card-body text-secondary p-2 rounded-3'>
                <div>
                    name: <span className='text-lightblue'>{name}</span>
                </div>
                <div>
                    message: <span className='text-lightblue'>{IsStringValid(message) ? message : "-"}</span>
                </div>
                <div>
                    date: <span className='text-lightblue'>{IsStringValid(date) ? date : "-"}</span>
                </div>
                <MapPopupFooter
                    name={name}
                    setMapView={setMapView}
                ></MapPopupFooter>
            </div>
        </div>
    </Popup>
}