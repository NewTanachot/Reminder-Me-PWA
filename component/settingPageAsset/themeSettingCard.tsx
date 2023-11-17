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
        cardColorTheme = "bg-subBlack";
        textColorTheme = "text-whiteSmoke";
        cardIconColorTheme = "";
        subTextColorTheme = "text-milk-orange";
        switchThemeBtnColorTheme = "btn-secondary";
    }
    else {
        cardColorTheme = "bg-peach";
        textColorTheme = "text-viridian-green";
        cardIconColorTheme = "text-dark-emphasis";
        subTextColorTheme = "text-secondary";
        switchThemeBtnColorTheme = "bg-viridian-green text-white";
    }

    return (
    <>
        <div className={`card shadow-sm mb-3 ${cardColorTheme} ${textColorTheme}`}>
            <div className="card-body m-2 p-0">
                <div className="d-flex align-items-center">
                    <div className="flex-shrink-0 ms-2">
                        {
                            isDarkTheme
                                ? <i className={`fa-solid fa-moon text-setting-icon-size ${cardIconColorTheme}`}></i>
                                : <i className={`fa-solid fa-sun text-setting-icon-size ${cardIconColorTheme}`}></i>
                        }
                    </div>
                    <div className="flex-grow-1 ms-3">
                        <h6 className="m-0 lh-sm text-size-14">
                            Theme:
                            <br />
                            <span className={subTextColorTheme}>
                                {isDarkTheme ? "dark" : "light"}
                            </span>
                        </h6>
                    </div>
                    <button
                        className={`btn btn-sm ${switchThemeBtnColorTheme} btn-setting-icon-size bg-gradient`}
                        onClick={UpdateThemeHandler}
                    >
                        <i className="fa-solid fa-rotate"></i>
                    </button>
                </div>
            </div>
        </div>
    </>
    )
}