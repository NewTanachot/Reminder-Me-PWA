import {ILoadingPageProps} from "@/model/propsModel";

export default function LoadingComponent({ isDarkTheme }: ILoadingPageProps) {

    let loadingColorTheme: string;

    if (isDarkTheme) {
        loadingColorTheme = "text-white";
    }
    else {
        loadingColorTheme = "text-dark";
    }

    return (
        <div className="text-center m-5">
            <i className={`fa-solid fa-spinner fa-spin-pulse text-loading-component-size ${loadingColorTheme}`}></i>
        </div>
    )
}