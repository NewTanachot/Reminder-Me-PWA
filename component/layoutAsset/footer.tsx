import { PwaCurrentPage } from "@/model/enumModel";
import { IFooterProps } from "@/model/propsModel";

export default function Footer({ changeCurrentPage, currentPageName, isDarkTheme }: IFooterProps) {

    // check if need to disableAllFooter
    const disableAllFooter = currentPageName == PwaCurrentPage.Login || currentPageName == PwaCurrentPage.Register ? true : false;

    // footer theme handler
    const TextLightColorTheme = "text-cream";
    const TextDarkColorTheme = "text-mainGray";

    const defaultTextColorTheme = isDarkTheme ? TextDarkColorTheme : TextLightColorTheme;

    let listIconClass = `${defaultTextColorTheme} bi bi-folder`;
    let mapIconClass = `${defaultTextColorTheme} bi bi-geo-alt`;
    let addListIconClass = `${defaultTextColorTheme} bi bi-plus-circle`;
    let evBatteryIconClass = `${defaultTextColorTheme} bi bi-lightning-charge`;
    let settingIconClass = `${defaultTextColorTheme} bi bi-gear`;
    
    switch (currentPageName) {
        case PwaCurrentPage.ReminderList:
            listIconClass = listIconClass.replace(defaultTextColorTheme, "text-whiteSmoke");
            listIconClass += "-fill";
            break;
        case PwaCurrentPage.MapView:
            mapIconClass = mapIconClass.replace(defaultTextColorTheme, "text-whiteSmoke");
            mapIconClass += "-fill";
            break;
        case PwaCurrentPage.AddList:
            addListIconClass = addListIconClass.replace(defaultTextColorTheme, "text-whiteSmoke");
            addListIconClass += "-fill";
            break;
        case PwaCurrentPage.EvBattery:
            evBatteryIconClass = evBatteryIconClass.replace(defaultTextColorTheme, "text-whiteSmoke");
            evBatteryIconClass += "-fill";
            break;
        case PwaCurrentPage.Setting:
            settingIconClass = settingIconClass.replace(defaultTextColorTheme, "text-whiteSmoke");
            settingIconClass += "-fill";
            break;
    }

    // check theme color
    let footerColorTheme = "";

    if (isDarkTheme) {
        footerColorTheme = "bg-mainblack";
    }
    else {
        footerColorTheme = "bg-viridian-green";
    }

    return (
        <footer className={`fixed-bottom px-2 pb-4 pt-0 shadow-top rounded-top-5 ${footerColorTheme}`}>
            <div className='d-flex justify-content-around align-items-start mt-1 text-'>
                <button 
                    type="button" 
                    className={`btn btn-lg border-0 rounded-0`}
                    onClick={() => changeCurrentPage(PwaCurrentPage.ReminderList)}
                    disabled={disableAllFooter}
                >
                    <i className={`${listIconClass} text-footer-size`}></i>
                </button>
                <button
                    type="button" 
                    className={`btn btn-lg border-0 rounded-0`}
                    onClick={() => changeCurrentPage(PwaCurrentPage.MapView)}
                    disabled={disableAllFooter}
                >
                    <i className={`${mapIconClass} text-footer-size`}></i>
                </button>
                <button 
                    type="button" 
                    className={`btn btn-lg border-0 rounded-0`}
                    onClick={() => changeCurrentPage(PwaCurrentPage.AddList)}
                    disabled={disableAllFooter}
                >
                    <i className={`${addListIconClass} text-footer-size`}></i>
                </button>
                <button 
                    type="button" 
                    className={`btn btn-lg border-0 rounded-0`}
                    onClick={() => changeCurrentPage(PwaCurrentPage.EvBattery)}
                    disabled={disableAllFooter}
                >
                    <i className={`${evBatteryIconClass} text-footer-size`}></i>
                </button>
                <button
                    type="button"
                    className={`btn btn-lg border-0 rounded-0`}
                    onClick={() => changeCurrentPage(PwaCurrentPage.Setting)}
                    disabled={disableAllFooter}
                >
                    <i className={`${settingIconClass} text-footer-size`}></i>
                </button>
            </div>
        </footer>
    )
}