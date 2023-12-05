import { ICardHeaderProps } from "@/model/propsModel";

export default function CardHeader({ backToPage, changeCurrentPage, isDarkTheme }: ICardHeaderProps) {

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
        <div className={`d-flex justify-content-between ${backBtnColorTheme}`}>
            <button 
                onClick={() => changeCurrentPage({ page: backToPage })}
                className={`btn btn-sm p-0 mb-1 bg-opacity-100`}
            >
                <i className="fa-solid fa-angles-left me-2"></i>
                Back
            </button>
            <p className="m-0">
                {backToPage}
            </p>
        </div>
        <hr className={`mt-0 ${underLineColorTheme}`} />
    </>
}
