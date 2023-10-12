import {ILoadingComponentProps, ILoadingPageProps} from "@/model/propsModel";

export default function LoadingComponent({ isDarkTheme, isDisplay }: ILoadingComponentProps) {

    let loadingColorTheme: string;

    if (isDarkTheme) {
        loadingColorTheme = "text-white";
    }
    else {
        loadingColorTheme = "text-dark";
    }

    const loadingComponent: JSX.Element =        
        <div className="text-center m-4">
            <i className={`fa-solid fa-spinner fa-spin-pulse text-loading-component-size ${loadingColorTheme}`}></i>
        </div>

    return isDisplay ? loadingComponent : <></>
}