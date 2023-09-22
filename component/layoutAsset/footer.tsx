import { PwaCurrentPage } from "@/model/enum_model";
import { IFooterProps } from "@/model/props_model";
import { useRef } from "react";

export default function Footer({ changeCurrentPage, currentPageName, isDarkTheme }: IFooterProps) {

    let footerColorTheme = "";

    let listIconClass = "bi bi-folder";
    let mapIconClass = "bi bi-geo-alt";
    let addListIconClass = "bi bi-plus-circle";
    let evBatteryIconClass = "bi bi-lightning-charge";
    let settingIconClass = "bi bi-gear";

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

    // check if need to disableAllFooter
    const disableAllFooter = currentPageName == PwaCurrentPage.Login || currentPageName == PwaCurrentPage.Register ? true : false;

    // check theme color
    if (isDarkTheme) {
        footerColorTheme = "bg-mainblack";
    }
    else {
        footerColorTheme = "bg-viridian-green";
    }

    return (
        <footer className={`fixed-bottom px-2 pb-4 pt-0 shadow-top rounded-top-5 ${footerColorTheme}`}>
            <div className='d-flex justify-content-around align-items-start mt-1'>
                <button 
                    type="button" 
                    className={`btn btn-lg text-peach border-0 rounded-0`}
                    onClick={() => changeCurrentPage(PwaCurrentPage.ReminderList)}
                    disabled={disableAllFooter}
                >
                    <i className={`${listIconClass} text-footer-size`}></i>
                </button>
                <button
                    type="button" 
                    className={`btn btn-lg text-peach border-0 rounded-0`}
                    onClick={() => changeCurrentPage(PwaCurrentPage.MapView)}
                    disabled={disableAllFooter}
                >
                    <i className={`${mapIconClass} text-footer-size`}></i>
                </button>
                <button 
                    type="button" 
                    className={`btn btn-lg text-peach border-0 rounded-0`}
                    onClick={() => changeCurrentPage(PwaCurrentPage.AddList)}
                    disabled={disableAllFooter}
                >
                    <i className={`${addListIconClass} text-footer-size`}></i>
                </button>
                <button 
                    type="button" 
                    className={`btn btn-lg text-peach border-0 rounded-0`}
                    onClick={() => changeCurrentPage(PwaCurrentPage.EvBattery)}
                    disabled={disableAllFooter}
                >
                    <i className={`${evBatteryIconClass} text-footer-size`}></i>
                </button>
                <button
                    type="button"
                    className={`btn btn-lg text-peach border-0 rounded-0`}
                    onClick={() => changeCurrentPage(PwaCurrentPage.Setting)}
                    disabled={disableAllFooter}
                >
                    <i className={`${settingIconClass} text-footer-size`}></i>
                </button>
            </div>
        </footer>
    )
}