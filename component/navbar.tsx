import { PwaCurrentPage } from "@/model/enum_model";
import { INavbarProps } from "@/model/props_model";
import appIcon from '@/public/image/web-icon/favicon.ico';

export default function Navbar({ userName, currentPage, changeCurrentPage }: INavbarProps) {

    return (
        <nav className='bg-milk-green text-white px-2 py-2'>
            <div className='d-flex justify-content-between align-items-center'>
                <button className='m-0 btn text-white ps-0'>
                    <img className="me-2" src={appIcon.src} alt="appIcon" width={30} height={30} />
                    Remider Me - [{PwaCurrentPage[currentPage]}]
                </button>
                {
                    currentPage !== PwaCurrentPage.login ?
                    <button 
                        onClick={() => changeCurrentPage(PwaCurrentPage.login)} 
                        className='m-0 btn btn-success rounded-3 text-white'
                    >
                        Hello, {userName}
                    </button>
                    :
                    <button 
                        onClick={() => changeCurrentPage(PwaCurrentPage.register)} 
                        className='m-0 btn btn-success rounded-3 text-white'
                    >
                        Register
                    </button>
                }
            </div>
        </nav>
    )
}