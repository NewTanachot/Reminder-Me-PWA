import { PwaCurrentPage } from "@/model/enum_model";
import { INavbarProps } from "@/model/props_model";

export default function Navbar({ userName, currentPage, changeCurrentPage }: INavbarProps) {

    return (
        // bg-milk-green text-white px-2 py-2 pt-5 pt-sm-2
        <nav className='bg-milk-green text-white px-2 py-2'>
            <div className='row'>
                <div className='col m-0 text-start'>
                    <button className='m-0 btn text-white'>
                        <img></img>
                        Remider Me App
                    </button>
                </div>
                <div className='col m-0 text-end'>
                    {
                        currentPage != PwaCurrentPage.login ?
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
                            "Register"
                        </button>
                    }
                </div>
            </div>
        </nav>
    )
}