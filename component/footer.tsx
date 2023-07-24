import { PwaCurrentPage } from "@/model/enum_model";
import { IFooterProps } from "@/model/props_model";

export default function Footer({ changeCurrentPage, currentPage }: IFooterProps) {

    let listIconClass = "bi bi-folder";
    let mapIconClass = "bi bi-geo-alt";
    let addListIconClass = "bi bi-plus-circle";
    let registerIconClass = "bi bi-compass";
    let loginIconClass = "bi bi-people";
    
    switch (currentPage) {
        case PwaCurrentPage.ReminderList:
            listIconClass += "-fill";
            break;
        case PwaCurrentPage.MapView:
            mapIconClass += "-fill";
            break;
        case PwaCurrentPage.AddList:
            addListIconClass += "-fill";
            break;
        case PwaCurrentPage.Register:
            registerIconClass += "-fill";
            break;
        case PwaCurrentPage.Login:
            loginIconClass += "-fill";
            break;
    }

    return (
        <footer className='fixed-bottom bg-viridian-green px-2 pb-3 pt-0 shadow-top rounded-top-5'>
            <div className='d-flex justify-content-around align-items-start'>
                <button 
                    type="button" 
                    className={`btn btn-lg text-peach border-0 rounded-0`}
                    disabled={currentPage == PwaCurrentPage.ReminderList}
                    onClick={() => changeCurrentPage(PwaCurrentPage.ReminderList)}
                >
                    <i className={`${listIconClass} text-footer-size`}></i>
                </button>
                <button
                    type="button" 
                    className={`btn btn-lg text-peach border-0 rounded-0`}
                    disabled={currentPage == PwaCurrentPage.MapView}
                    onClick={() => changeCurrentPage(PwaCurrentPage.MapView)}
                >
                    <i className={`${mapIconClass} text-footer-size`}></i>
                </button>
                <button 
                    type="button" 
                    className={`btn btn-lg text-peach border-0 rounded-0`}
                    disabled={currentPage == PwaCurrentPage.AddList}
                    onClick={() => changeCurrentPage(PwaCurrentPage.AddList)}
                >
                    <i className={`${addListIconClass} text-footer-size`}></i>
                </button>
                <button 
                    type="button" 
                    className={`btn btn-lg text-peach border-0 rounded-0`}
                    disabled={currentPage == PwaCurrentPage.Register}
                    onClick={() => changeCurrentPage(PwaCurrentPage.Register)}
                >
                    <i className={`${registerIconClass} text-footer-size`}></i>
                </button>
                <button
                    type="button"
                    className={`btn btn-lg text-peach border-0 rounded-0`}
                    disabled={currentPage == PwaCurrentPage.Login}
                    onClick={() => changeCurrentPage(PwaCurrentPage.Login)}
                >
                    <i className={`${loginIconClass} text-footer-size`}></i>
                </button>
            </div>
        </footer>
    )
}