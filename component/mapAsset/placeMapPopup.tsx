import { Athiti } from 'next/font/google'
import { IsStringValid } from '@/extension/string_extension'
import { IPlaceMapPopupProps } from '@/model/propsModel'
import { Popup } from 'react-leaflet'

const googleFont = Athiti({
    weight: '600',
    subsets: ['latin'],
    display: "swap"
});

export default function PlaceMapPopup({ name, message, date }: IPlaceMapPopupProps) {

    return <Popup>
        <div className={`card shadow-sm border border-2 ${googleFont.className}`}>
            <div className='card-body text-secondary p-2 rounded-3'>
                <div>
                    name: <span className='text-cornflowerblue'>{name}</span>
                </div>
                <div>
                    message: <span className='text-cornflowerblue'>{IsStringValid(message) ? message : "-"}</span>
                </div>
                <div>
                    date: <span className='text-cornflowerblue'>{IsStringValid(date) ? date : "-"}</span>
                </div>
            </div>
            <div className='card-footer text-card-footer-size text-end p-0'>
                zoom in
            </div>
        </div>
    </Popup>
}