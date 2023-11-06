import { IUserMapPopupProps } from '@/model/propsModel'
import { Popup } from 'react-leaflet'

export default function UserMapPopup({ userName }: IUserMapPopupProps) {
    return <Popup>
        <div className='text-cornflowerblue text-cursive'>
            {userName} is here! 
        </div>
    </Popup>
}