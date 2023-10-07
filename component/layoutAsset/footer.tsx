import { PwaCurrentPageEnum } from "@/model/enumModel";
import { IFooterProps } from "@/model/propsModel";

export default function Footer({ changeCurrentPage, currentPageName, isDarkTheme }: IFooterProps) {

    // check if it need to disableAllFooter
    const disableAllFooter = currentPageName == PwaCurrentPageEnum.Login || currentPageName == PwaCurrentPageEnum.Register;

    const defaultTextColor = "text-whiteSmoke";

    let listIconClass = `${defaultTextColor} bi bi-folder`;
    let mapIconClass = `${defaultTextColor} bi bi-geo-alt`;
    let addListIconClass = `${defaultTextColor} bi bi-plus-circle`;
    let evBatteryIconClass = `${defaultTextColor} bi bi-lightning-charge`;
    let settingIconClass = `${defaultTextColor} bi bi-gear`;

    // need to delete this if not use
    let listTopIconBorder = "";
    let mapTopIconBorder = "";
    let addListTopIconBorder = "";
    let evBatteryIconBorder = "";
    let settingIconBorder = "";
    
    switch (currentPageName) {
        case PwaCurrentPageEnum.ReminderList:
            listIconClass = listIconClass.replace(defaultTextColor, "text-whiteSmoke");
            listIconClass += "-fill ";
            // listTopIconBorder += " border-top border-2 rounded-start-1";
            break;
        case PwaCurrentPageEnum.MapView:
            mapIconClass = mapIconClass.replace(defaultTextColor, "text-whiteSmoke");
            mapIconClass += "-fill";
            // mapTopIconBorder += " border-top border-2";
            break;
        case PwaCurrentPageEnum.AddList:
            addListIconClass = addListIconClass.replace(defaultTextColor, "text-whiteSmoke");
            addListIconClass += "-fill";
            // addListTopIconBorder += " border-top border-2";
            break;
        case PwaCurrentPageEnum.EvBattery:
            evBatteryIconClass = evBatteryIconClass.replace(defaultTextColor, "text-whiteSmoke");
            evBatteryIconClass += "-fill";
            // evBatteryIconBorder += " border-top border-2";
            break;
        case PwaCurrentPageEnum.Setting:
            settingIconClass = settingIconClass.replace(defaultTextColor, "text-whiteSmoke");
            settingIconClass += "-fill";
            // settingIconBorder += " border-top border-2 rounded-end-1";
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
        <footer className={`fixed-bottom px-2 pb-4 pt-0 shadow-top rounded-top-5 ${footerColorTheme}`}>
            <div className='d-flex justify-content-around align-items-start'>
                <div>
                    <button 
                        type="button" 
                        className={`btn btn-lg rounded-0 border-0 pb-1 pt-3 lh-1 ${listTopIconBorder}`}
                        onClick={() => changeCurrentPage({ page: PwaCurrentPageEnum.ReminderList })}
                        disabled={disableAllFooter}
                    >
                        <i className={`${listIconClass} text-footer-size`}></i>
                    </button>
                    <p className="m-0 text-center text-whiteSmoke lh-1 fw-light">Card</p>
                </div>
                <div>
                    <button
                        type="button"
                        className={`btn btn-lg rounded-0 border-0 pb-1 pt-3 lh-1 ${mapTopIconBorder}`}
                        onClick={() => changeCurrentPage({ page: PwaCurrentPageEnum.MapView })}
                        disabled={disableAllFooter}
                    >
                        <i className={`${mapIconClass} text-footer-size`}></i>
                    </button>
                    <p className="m-0 text-center text-whiteSmoke lh-1 fw-light">Map</p>
                </div>
                <div>
                    <button 
                        type="button" 
                        className={`btn btn-lg rounded-0 border-0 pb-1 pt-3 lh-1 ${addListTopIconBorder}`}
                        onClick={() => changeCurrentPage({ page: PwaCurrentPageEnum.AddList })}
                        disabled={disableAllFooter}
                    >
                        <i className={`${addListIconClass} text-footer-size`}></i>
                    </button>
                    <p className="m-0 text-center text-whiteSmoke lh-1 fw-light">Add</p>
                </div>
                <div>
                    <button
                        type="button"
                        className={`btn btn-lg rounded-0 border-0 pb-1 pt-3 lh-1 ${evBatteryIconBorder}`}
                        onClick={() => changeCurrentPage({ page: PwaCurrentPageEnum.EvBattery })}
                        disabled={disableAllFooter}
                    >
                        <i className={`${evBatteryIconClass} text-footer-size`}></i>
                    </button>
                    <p className="m-0 text-center text-whiteSmoke lh-1 fw-light">Ev</p>
                </div>
                <div>
                    <button
                        type="button"
                        className={`btn btn-lg rounded-0 border-0 pb-1 pt-3 lh-1 ${settingIconBorder}`}
                        onClick={() => changeCurrentPage({ page: PwaCurrentPageEnum.Setting })}
                        disabled={disableAllFooter}
                    >
                        <i className={`${settingIconClass} text-footer-size`}></i>
                    </button>
                    <p className="m-0 text-center text-whiteSmoke lh-1 fw-light">Setting</p>
                </div>
            </div>
        </footer>
    )
}