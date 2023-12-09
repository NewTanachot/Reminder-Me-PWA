import { IThemeSettingCardProps } from "@/model/propsModel";

export default function ThemeSettingCard({ isDarkTheme, changeCurrentThemeHandler }: IThemeSettingCardProps) {

    const UpdateThemeHandler = () => {
        changeCurrentThemeHandler(!isDarkTheme);
    };

    let cardColorTheme: string;
    let textColorTheme: string;
    let cardIconColorTheme: string;
    let subTextColorTheme: string;
    let switchThemeBtnColorTheme: string;

    if (isDarkTheme) {
        cardColorTheme = "bg-subblack";
        textColorTheme = "text-whitesmoke";
        cardIconColorTheme = "";
        subTextColorTheme = "text-milk-orange";
        switchThemeBtnColorTheme = "bg-steelblue";
    }
    else {
        cardColorTheme = "bg-peach";
        textColorTheme = "text-viridian-green";
        cardIconColorTheme = "text-dark-emphasis";
        subTextColorTheme = "text-secondary";
        switchThemeBtnColorTheme = "bg-viridian-green";
    }

    return (
    <>
        <div className={`card shadow-sm mb-3 ${cardColorTheme} ${textColorTheme} theme-transition-ease-out-25`}>
            <div className="card-body m-2 p-0">
                <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                        {
                            isDarkTheme
                                ? <i className={`fa-solid fa-moon text-setting-icon-size ms-2 me-1 ${cardIconColorTheme} theme-transition-ease-out-25`}></i>
                                : <i className={`fa-solid fa-sun text-setting-icon-size ms-1 ${cardIconColorTheme} theme-transition-ease-out-25`}></i>
                        }
                    </div>
                    <div className="flex-grow-1 ms-3">
                        <p className="m-0 lh-sm text-size-14">
                            Theme
                            <br />
                            <span className={`${subTextColorTheme} theme-transition-ease-out-25`}>
                                • {isDarkTheme ? "dark" : "light"}
                            </span>
                        </p>
                    </div>
                    <button
                        className={`btn btn-sm ${switchThemeBtnColorTheme} text-white btn-setting-icon-size theme-transition-ease-out-25`}
                        onClick={UpdateThemeHandler}
                    >
                        {
                            isDarkTheme
                                ? <i className="fa-solid fa-cloud-sun"></i>
                                : <i className="fa-solid fa-cloud-moon"></i>
                        }
                    </button>
                </div>
            </div>
        </div>
    </>
    )
}