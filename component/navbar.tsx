import { PwaCurrentPage } from "@/model/enum_model";
import { INavbarProps } from "@/model/props_model";
import appIcon from '@/public/image/web-icon/favicon.ico';

export default function Navbar({ userName, currentPage, changeCurrentPage }: INavbarProps) {

    return (
        <nav className='sticky-top bg-viridian-green text-white px-2 py-2 shadow-bottom'>
            <div className='d-flex justify-content-between align-items-center'>
                <h5 className='m-0 text-white ps-0'>
                    <img className="ms-1 me-2" src={appIcon.src} alt="appIcon" width={40} height={40} />
                    {PwaCurrentPage[currentPage]}
                </h5>
                {
                    currentPage !== PwaCurrentPage.Login ?
                    <button 
                        onClick={() => changeCurrentPage(PwaCurrentPage.Login)} 
                        className='m-0 btn btn-success rounded-3 bg-milk-yellow text-light'
                    >
                        Hello, {userName}
                    </button>
                    :
                    <button 
                        onClick={() => changeCurrentPage(PwaCurrentPage.Register)} 
                        className='m-0 btn btn-success rounded-3 bg-milk-yellow text-light'
                    >
                        Register
                    </button>
                }
            </div>
        </nav>
    )
}