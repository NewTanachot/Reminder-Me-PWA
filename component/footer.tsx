import { PwaCurrentPage } from "@/model/enum_model";
import { IFooterProps } from "@/model/props_model";

export default function Footer({ changeCurrentPage, currentPageName }: IFooterProps) {

    let listIconClass = "bi bi-folder";
    let mapIconClass = "bi bi-geo-alt";
    let addListIconClass = "bi bi-plus-circle";
    let evBatteryIconClass = "bi bi-ev-station";
    let loginIconClass = "bi bi-people";
    
    switch (currentPageName) {
        case PwaCurrentPage.ReminderList:
            listIconClass += "-fill";
            break;
        case PwaCurrentPage.MapView:
            mapIconClass += "-fill";
            break;
        case PwaCurrentPage.AddList:
            addListIconClass += "-fill";
            break;
        case PwaCurrentPage.EvBattery:
            evBatteryIconClass += "-fill";
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
                    disabled={currentPageName == PwaCurrentPage.ReminderList}
                    onClick={() => changeCurrentPage(PwaCurrentPage.ReminderList)}
                >
                    <i className={`${listIconClass} text-footer-size`}></i>
                </button>
                <button
                    type="button" 
                    className={`btn btn-lg text-peach border-0 rounded-0`}
                    disabled={currentPageName == PwaCurrentPage.MapView}
                    onClick={() => changeCurrentPage(PwaCurrentPage.MapView)}
                >
                    <i className={`${mapIconClass} text-footer-size`}></i>
                </button>
                <button 
                    type="button" 
                    className={`btn btn-lg text-peach border-0 rounded-0`}
                    disabled={currentPageName == PwaCurrentPage.AddList}
                    onClick={() => changeCurrentPage(PwaCurrentPage.AddList)}
                >
                    <i className={`${addListIconClass} text-footer-size`}></i>
                </button>
                <button 
                    type="button" 
                    className={`btn btn-lg text-peach border-0 rounded-0`}
                    disabled={currentPageName == PwaCurrentPage.EvBattery}
                    onClick={() => changeCurrentPage(PwaCurrentPage.EvBattery)}
                >
                    <i className={`${evBatteryIconClass} text-footer-size`}></i>
                </button>
                <button
                    type="button"
                    className={`btn btn-lg text-peach border-0 rounded-0`}
                    disabled={currentPageName == PwaCurrentPage.Login}
                    onClick={() => changeCurrentPage(PwaCurrentPage.Login)}
                >
                    <i className={`${loginIconClass} text-footer-size`}></i>
                </button>
            </div>
        </footer>
    )
}