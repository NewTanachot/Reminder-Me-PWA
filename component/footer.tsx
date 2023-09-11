import { PwaCurrentPage } from "@/model/enum_model";
import { IFooterProps } from "@/model/props_model";

export default function Footer({ changeCurrentPage, currentPageName }: IFooterProps) {

    let listIconClass = "bi bi-folder";
    let mapIconClass = "bi bi-geo-alt";
    let addListIconClass = "bi bi-plus-circle";
    let evBatteryIconClass = "bi bi-lightning-charge";
    let settingIconClass = "bi bi-gear";
    
    console.log(currentPageName)

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
        case PwaCurrentPage.Setting:
            settingIconClass += "-fill";
            break;
    }

    return (
        <footer className='fixed-bottom bg-viridian-green px-2 pb-3 pt-0 shadow-top rounded-top-5'>
            <div className='d-flex justify-content-around align-items-start'>
                <button 
                    type="button" 
                    className={`btn btn-lg text-peach border-0 rounded-0`}
                    onClick={() => changeCurrentPage(PwaCurrentPage.ReminderList)}
                    disabled={currentPageName == PwaCurrentPage.Login}
                >
                    <i className={`${listIconClass} text-footer-size`}></i>
                </button>
                <button
                    type="button" 
                    className={`btn btn-lg text-peach border-0 rounded-0`}
                    onClick={() => changeCurrentPage(PwaCurrentPage.MapView)}
                    disabled={currentPageName == PwaCurrentPage.Login}
                >
                    <i className={`${mapIconClass} text-footer-size`}></i>
                </button>
                <button 
                    type="button" 
                    className={`btn btn-lg text-peach border-0 rounded-0`}
                    onClick={() => changeCurrentPage(PwaCurrentPage.AddList)}
                    disabled={currentPageName == PwaCurrentPage.Login}
                >
                    <i className={`${addListIconClass} text-footer-size`}></i>
                </button>
                <button 
                    type="button" 
                    className={`btn btn-lg text-peach border-0 rounded-0`}
                    onClick={() => changeCurrentPage(PwaCurrentPage.EvBattery)}
                    disabled={currentPageName == PwaCurrentPage.Login}
                >
                    <i className={`${evBatteryIconClass} text-footer-size`}></i>
                </button>
                <button
                    type="button"
                    className={`btn btn-lg text-peach border-0 rounded-0`}
                    onClick={() => changeCurrentPage(PwaCurrentPage.Setting)}
                    disabled={currentPageName == PwaCurrentPage.Login}
                >
                    <i className={`${settingIconClass} text-footer-size`}></i>
                </button>
            </div>
        </footer>
    )
}