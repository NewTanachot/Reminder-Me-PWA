import { PwaCurrentPageEnum } from "@/model/enumModel";
import { IFooterProps } from "@/model/propsModel";

export default function Footer({ isMapPage, changeCurrentPage, currentPageName, isDarkTheme }: IFooterProps) {

    const DisableFooterBtnCondition = () => {
        return currentPageName == PwaCurrentPageEnum.Login 
            || currentPageName == PwaCurrentPageEnum.Register
            || (isMapPage && currentPageName != PwaCurrentPageEnum.MapView);
    }

    // check if it need to disableAllFooter
    const disableAllFooter = DisableFooterBtnCondition();
    const defaultTextColor = "text-whitesmoke";
    const selectedTextColor = isDarkTheme ? "text-milk-orange" : "text-wheat";

    let listIconClass = `${defaultTextColor} bi bi-folder`;
    let mapIconClass = `${defaultTextColor} bi bi-geo-alt`;
    let CreateCardIconClass = `${defaultTextColor} bi bi-plus-circle`;
    let evBatteryIconClass = `${defaultTextColor} bi bi-ev-front`;
    let settingIconClass = `${defaultTextColor} bi bi-gear`;
    
    let listTextClass = defaultTextColor;
    let mapTextClass = defaultTextColor;
    let CreateCardTextClass = defaultTextColor;
    let evBatteryTextClass = defaultTextColor;
    let settingTextClass = defaultTextColor;

    switch (currentPageName) {
        case PwaCurrentPageEnum.ReminderList:
            listIconClass = listIconClass.replace(defaultTextColor, selectedTextColor);
            listTextClass = selectedTextColor;
            listIconClass += "-fill ";
            break;
        case PwaCurrentPageEnum.MapView:
            mapIconClass = mapIconClass.replace(defaultTextColor, selectedTextColor);
            mapTextClass = selectedTextColor;
            mapIconClass += "-fill";
            break;
        case PwaCurrentPageEnum.CreateCard:
            CreateCardIconClass = CreateCardIconClass.replace(defaultTextColor, selectedTextColor);
            CreateCardTextClass = selectedTextColor;
            CreateCardIconClass += "-fill";
            break;
        case PwaCurrentPageEnum.EvBattery:
            evBatteryIconClass = evBatteryIconClass.replace(defaultTextColor, selectedTextColor);
            evBatteryTextClass = selectedTextColor;
            evBatteryIconClass += "-fill";
            break;
        case PwaCurrentPageEnum.Setting:
            settingIconClass = settingIconClass.replace(defaultTextColor, selectedTextColor);
            settingTextClass = selectedTextColor;
            settingIconClass += "-fill";
            break;
    }

    // check theme color
    let footerColorTheme: string;

    if (isDarkTheme) {
        footerColorTheme = "bg-mainblack";
    }
    else {
        footerColorTheme = "bg-viridian-green";
    }

    return (
        // justify-content-around
        <footer className={`fixed-bottom px-2 pt-0 shadow-top rounded-top-5 ${footerColorTheme} bg-gradient spacing-footer-bottom theme-transition-ease-out-25`}>
            <div className='d-flex justify-content-evenly align-items-start'>
                <div>
                    <button 
                        type="button" 
                        className="btn btn-lg rounded-0 border-0 pb-1 pt-3 lh-1"
                        onClick={() => changeCurrentPage({ page: PwaCurrentPageEnum.ReminderList })}
                        disabled={disableAllFooter}
                    >
                        <i className={`${listIconClass} text-footer-icon-size transition-ease-out-40`}></i>
                    </button>
                    <p className={`m-0 text-center ${listTextClass} lh-1 text-footer-size transition-ease-out-40`}>Card</p>
                </div>
                <div>
                    <button 
                        type="button" 
                        className="btn btn-lg rounded-0 border-0 pb-1 pt-3 lh-1"
                        onClick={() => changeCurrentPage({ page: PwaCurrentPageEnum.CreateCard })}
                        disabled={disableAllFooter}
                    >
                        <i className={`${CreateCardIconClass} text-footer-icon-size transition-ease-out-40`}></i>
                    </button>
                    <p className={`m-0 text-center ${CreateCardTextClass} lh-1 text-footer-size transition-ease-out-40`}>Create</p>
                </div>
                <div>
                    <button
                        type="button"
                        className="btn btn-lg rounded-0 border-0 pb-1 pt-3 lh-1"
                        onClick={() => changeCurrentPage({ page: PwaCurrentPageEnum.MapView })}
                        disabled={disableAllFooter}
                    >
                        <i className={`${mapIconClass} text-footer-icon-size transition-ease-out-40`}></i>
                    </button>
                    <p className={`m-0 text-center ${mapTextClass} lh-1 text-footer-size transition-ease-out-40`}>Map</p>
                </div>
                {/* <div>
                    <button
                        type="button"
                        className="btn btn-lg rounded-0 border-0 pb-1 pt-3 lh-1"
                        onClick={() => changeCurrentPage({ page: PwaCurrentPageEnum.EvBattery })}
                        disabled={disableAllFooter}
                    >
                        <i className={`${evBatteryIconClass} text-footer-icon-size transition-ease-out-40`}></i>
                    </button>
                    <p className={`m-0 text-center ${evBatteryTextClass} lh-1 text-footer-size transition-ease-out-40`}>EV</p>
                </div> */}
                <div>
                    <button
                        type="button"
                        className="btn btn-lg rounded-0 border-0 pb-1 pt-3 lh-1"
                        onClick={() => changeCurrentPage({ page: PwaCurrentPageEnum.Setting })}
                        disabled={disableAllFooter}
                    >
                        <i className={`${settingIconClass} text-footer-icon-size transition-ease-out-40`}></i>
                    </button>
                    <p className={`m-0 text-center ${settingTextClass} lh-1 text-footer-size transition-ease-out-40`}>Setting</p>
                </div>
            </div>
        </footer>
    )
}