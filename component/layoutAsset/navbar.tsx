import { DisplayCurrentPageName } from "@/extension/string_extension";
import { PwaCurrentPageEnum } from "@/model/enumModel";
import { INavbarProps } from "@/model/propsModel";
import appIcon from '@/public/image/web-icon/favicon.ico';

export default function Navbar({ currentPageName, orderByDistanceValue, changeOrderByDistanceHandler, isDarkTheme }: INavbarProps) {

    let navbarColorTheme: string;

    if (isDarkTheme) {
        navbarColorTheme = "bg-mainblack";
    }
    else {
        navbarColorTheme = "bg-viridian-green";
    }

    return (
        <nav className={`fixed-top text-cream px-2 py-2 shadow-bottom rounded-bottom-4 ${navbarColorTheme}`}>
            <div className='d-flex justify-content-between align-items-center'>
                <h5 className='m-0 ps-0'> 
                    <img className="ms-1 me-2" src={appIcon.src} alt="appIcon" width={40} height={40} />
                    {DisplayCurrentPageName(currentPageName)}
                </h5>
                {
                    currentPageName == PwaCurrentPageEnum.ReminderList ?
                        <button 
                            onClick={() => changeOrderByDistanceHandler(!orderByDistanceValue)} 
                            className='m-0 btn btn-dark bg-gradient rounded-3'
                        >
                            {
                                orderByDistanceValue
                                    ? <i className="bi bi-sort-down"></i>
                                    : <i className="bi bi-sort-up-alt"></i>
                            }
                        </button> 
                    :
                        <></>
                }
            </div>
        </nav>
    )
}