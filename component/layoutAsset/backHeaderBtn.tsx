import { PwaCurrentPageEnum } from "@/model/enumModel";
import { IBackHeaderBtnProps } from "@/model/propsModel";

export default function BackHeaderBtn({ changeCurrentPage, isDarkTheme }: IBackHeaderBtnProps) {

    let backBtnColorTheme: string;
    let underLineColorTheme: string;

    if (isDarkTheme) {
        backBtnColorTheme = "text-warning";
        underLineColorTheme = "text-white";
    }
    else {
        backBtnColorTheme = "text-danger";
        underLineColorTheme = "text-dark";
    }

    return <>
        <button 
            onClick={() => changeCurrentPage({ page: PwaCurrentPageEnum.ReminderList })}
            className={`btn btn-sm p-0 mb-1 bg-opacity-100 ${backBtnColorTheme}`}
        >
            <i className="fa-solid fa-angles-left me-2"></i>
            Back
        </button>
        <hr className={`mt-0 ${underLineColorTheme}`} />
    </>
}