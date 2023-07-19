import { DisplayCurrentPageName } from "@/extension/string_extension";
import { PwaCurrentPage } from "@/model/enum_model";
import { INavbarProps } from "@/model/props_model";
import appIcon from '@/public/image/web-icon/favicon.ico';

export default function Navbar({ userName, currentPage, changeCurrentPage }: INavbarProps) {

    return (
        <nav className='fixed-top bg-viridian-green text-white px-2 py-2 shadow-bottom'>
            <div className='d-flex justify-content-between align-items-center'>
                <h5 className='m-0 text-peach ps-0'>
                    <img className="ms-1 me-2" src={appIcon.src} alt="appIcon" width={40} height={40} />
                    {DisplayCurrentPageName(currentPage)}
                </h5>
                {
                    currentPage !== PwaCurrentPage.Login ?
                    <button 
                        onClick={() => changeCurrentPage(PwaCurrentPage.Login)} 
                        className='m-0 btn btn-success rounded-3 bg-milk-yellow text-peach'
                    >
                        <i className="bi bi-person-circle me-2"></i>
                        {userName}
                    </button>
                    :
                    <></>
                }
            </div>
        </nav>
    )
}