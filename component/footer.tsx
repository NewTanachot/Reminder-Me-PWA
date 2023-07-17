import { PwaCurrentPage } from "@/model/enum_model";
import { IFooterProps } from "@/model/props_model";

export default function Footer({ changeCurrentPage, currentPage }: IFooterProps) {

    let listIconClass = "bi bi-folder";
    let mapIconClass = "bi bi-geo-alt";
    let addListIconClass = "bi bi-plus-circle";
    let registerIconClass = "bi bi-compass";
    let loginIconClass = "bi bi-people";

    let listAddBorder = "";
    let mapAddBorder = "";
    let addListAddBorder = "";
    let registerAddBorder = "";
    let loginAddBorder = "";
    
    switch (currentPage) {
        case PwaCurrentPage.ReminderList:
            listIconClass += "-fill";
            listAddBorder = "border-top border-2";
            break;
        case PwaCurrentPage.MapView:
            mapIconClass += "-fill";
            mapAddBorder = "border-top border-2";
            break;
        case PwaCurrentPage.AddList:
            addListIconClass += "-fill";
            addListAddBorder = "border-top border-2";
            break;
        case PwaCurrentPage.Register:
            registerIconClass += "-fill";
            registerAddBorder = "border-top border-2";
            break;
        case PwaCurrentPage.Login:
            loginIconClass += "-fill";
            loginAddBorder = "border-top border-2";
            break;
    }

    return (
        <footer className='fixed-bottom bg-viridian-green px-2 pb-2 pt-0 shadow-top'>
            <div className='d-flex justify-content-around align-items-start'>
                <button 
                    type="button" 
                    className={`btn btn-lg text-white border-0 rounded-0 ${listAddBorder}`}
                    // disabled={true}
                    onClick={() => changeCurrentPage(PwaCurrentPage.ReminderList)}
                >
                    <i className={`${listIconClass} text-footer-size`}></i>
                </button>
                <button
                    type="button" 
                    className={`btn btn-lg text-white border-0 rounded-0 ${mapAddBorder}`}
                    onClick={() => changeCurrentPage(PwaCurrentPage.MapView)}
                >
                    <i className={`${mapIconClass} text-footer-size`}></i>
                </button>
                <button 
                    type="button" 
                    className={`btn btn-lg text-white border-0 rounded-0 ${addListAddBorder}`}
                    onClick={() => changeCurrentPage(PwaCurrentPage.AddList)}
                >
                    <i className={`${addListIconClass} text-footer-size`}></i>
                </button>
                <button 
                    type="button" 
                    className={`btn btn-lg text-white border-0 rounded-0 ${registerAddBorder}`}
                    onClick={() => changeCurrentPage(PwaCurrentPage.Register)}
                >
                    <i className={`${registerIconClass} text-footer-size`}></i>
                </button>
                <button
                    type="button"
                    className={`btn btn-lg text-white border-0 rounded-0 ${loginAddBorder}`}
                    onClick={() => changeCurrentPage(PwaCurrentPage.Login)}
                >
                    <i className={`${loginIconClass} text-footer-size`}></i>
                </button>
            </div>
        </footer>
    )
}