import { PwaCurrentPageEnum } from "@/model/enumModel";
import { IFooterProps } from "@/model/propsModel";

export default function Footer({ changeCurrentPage, currentPageName, isDarkTheme }: IFooterProps) {

    // check if it need to disableAllFooter
    const disableAllFooter = currentPageName == PwaCurrentPageEnum.Login || currentPageName == PwaCurrentPageEnum.Register;

    const defaultTextColor = "text-whiteSmoke";

    let listIconClass = `${defaultTextColor} bi bi-folder`;
    let mapIconClass = `${defaultTextColor} bi bi-geo-alt`;
    let addListIconClass = `${defaultTextColor} bi bi-plus-circle`;
    let evBatteryIconClass = `${defaultTextColor} bi bi-ev-front`;
    let settingIconClass = `${defaultTextColor} bi bi-gear`;
    
    switch (currentPageName) {
        case PwaCurrentPageEnum.ReminderList:
            listIconClass = listIconClass.replace(defaultTextColor, "text-whiteSmoke");
            listIconClass += "-fill ";
            break;
        case PwaCurrentPageEnum.MapView:
            mapIconClass = mapIconClass.replace(defaultTextColor, "text-whiteSmoke");
            mapIconClass += "-fill";
            break;
        case PwaCurrentPageEnum.AddList:
            addListIconClass = addListIconClass.replace(defaultTextColor, "text-whiteSmoke");
            addListIconClass += "-fill";
            break;
        case PwaCurrentPageEnum.EvBattery:
            evBatteryIconClass = evBatteryIconClass.replace(defaultTextColor, "text-whiteSmoke");
            evBatteryIconClass += "-fill";
            break;
        case PwaCurrentPageEnum.Setting:
            settingIconClass = settingIconClass.replace(defaultTextColor, "text-whiteSmoke");
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
        <footer className={`fixed-bottom px-2 pt-0 shadow-top rounded-top-5 ${footerColorTheme} spacing-footer-bottom`}>
            <div className='d-flex justify-content-around align-items-start'>
                <div>
                    <button 
                        type="button" 
                        className="btn btn-lg rounded-0 border-0 pb-1 pt-3 lh-1"
                        onClick={() => changeCurrentPage({ page: PwaCurrentPageEnum.ReminderList })}
                        disabled={disableAllFooter}
                    >
                        <i className={`${listIconClass} text-footer-icon-size`}></i>
                    </button>
                    <p className="m-0 text-center text-whiteSmoke lh-1 text-footer-size">Card</p>
                </div>
                <div>
                    <button
                        type="button"
                        className="btn btn-lg rounded-0 border-0 pb-1 pt-3 lh-1"
                        onClick={() => changeCurrentPage({ page: PwaCurrentPageEnum.MapView })}
                        disabled={disableAllFooter}
                    >
                        <i className={`${mapIconClass} text-footer-icon-size`}></i>
                    </button>
                    <p className="m-0 text-center text-whiteSmoke lh-1 text-footer-size">Map</p>
                </div>
                <div>
                    <button 
                        type="button" 
                        className="btn btn-lg rounded-0 border-0 pb-1 pt-3 lh-1"
                        onClick={() => changeCurrentPage({ page: PwaCurrentPageEnum.AddList })}
                        disabled={disableAllFooter}
                    >
                        <i className={`${addListIconClass} text-footer-icon-size`}></i>
                    </button>
                    <p className="m-0 text-center text-whiteSmoke lh-1 text-footer-size">Add</p>
                </div>
                <div>
                    <button
                        type="button"
                        className="btn btn-lg rounded-0 border-0 pb-1 pt-3 lh-1"
                        onClick={() => changeCurrentPage({ page: PwaCurrentPageEnum.EvBattery })}
                        disabled={disableAllFooter}
                    >
                        <i className={`${evBatteryIconClass} text-footer-icon-size`}></i>
                    </button>
                    <p className="m-0 text-center text-whiteSmoke lh-1 text-footer-size">Ev</p>
                </div>
                <div>
                    <button
                        type="button"
                        className="btn btn-lg rounded-0 border-0 pb-1 pt-3 lh-1"
                        onClick={() => changeCurrentPage({ page: PwaCurrentPageEnum.Setting })}
                        disabled={disableAllFooter}
                    >
                        <i className={`${settingIconClass} text-footer-icon-size`}></i>
                    </button>
                    <p className="m-0 text-center text-whiteSmoke lh-1 text-footer-size">Setting</p>
                </div>
            </div>
        </footer>
    )
}