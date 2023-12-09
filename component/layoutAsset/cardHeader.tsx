import { DisplayCurrentPageName } from "@/extension/string_extension";
import { PwaCurrentPageEnum } from "@/model/enumModel";
import { ICardHeaderProps } from "@/model/propsModel";

export default function CardHeader({ pageNameEnum, backToPage, changeCurrentPage, isDarkTheme }: ICardHeaderProps) {

    let textColorTheme: string;
    let underLineColorTheme: string;

    if (isDarkTheme) {
        textColorTheme = "text-lightgray";
        underLineColorTheme = "text-white";
    }
    else {
        textColorTheme = "text-secondary";
        underLineColorTheme = "text-dark";
    }

    return <>
        <div className={`d-flex justify-content-between me-2`}>
            {
                // because index 0 in enum is first enum object in collection
                backToPage || backToPage == 0
                ? <button 
                    onClick={() => changeCurrentPage({ page: backToPage })}
                    className={`btn btn-sm p-0 mb-1 ${textColorTheme} theme-transition-ease-out-25`}
                >
                    <i className="fa-solid fa-angles-left me-2"></i>
                    Back
                </button>
                : <div></div>
            }
            <button 
                className={`btn btn-sm border-0 p-0 mb-1 ${textColorTheme} theme-transition-ease-out-25`}
                type="button"
            >
                {DisplayCurrentPageName(pageNameEnum)}
            </button>
        </div>
        <hr className={`mt-0 ${underLineColorTheme} theme-transition-ease-out-25`} />
    </>
}
