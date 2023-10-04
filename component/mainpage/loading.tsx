import { ILoadingPageProps } from '@/model/propsModel';
// import loadingImage from '@/public/image/loading2.png';

export default function Loading({ isDarkTheme }: ILoadingPageProps) {

    let loadingColorTheme: string;

    if (isDarkTheme) {
        loadingColorTheme = "text-white";
    }
    else {
        loadingColorTheme = "text-dark";
    }

    return (
        <>
            <br /> <br /> <br /> <br />
            <div className="text-center m-5">
                {/* <img className="spin-rotate" src={loadingImage.src} alt="loadingImage" width={60} height={60} /> */}
                <i className={`fa-solid fa-spinner fa-spin-pulse text-loading-size ${loadingColorTheme}`}></i>
            </div>
        </>
    )
}