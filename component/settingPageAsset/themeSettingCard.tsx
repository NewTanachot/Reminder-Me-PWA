import { IThemeSettingCardProps } from "@/model/propsModel";

export default function ThemeSettingCard({ isDarkTheme, changeCurrentThemeHandler }: IThemeSettingCardProps) {

    const UpdateThemeHandler = () => {
        changeCurrentThemeHandler(!isDarkTheme);
    };

    let cardColorTheme: string;
    let textColorTheme: string;
    let subTextColorTheme: string;
    let switchThemeBtnColorTheme: string;

    if (isDarkTheme) {
        cardColorTheme = "bg-subBlack";
        textColorTheme = "text-whiteSmoke";
        subTextColorTheme = "text-milk-orange";
        switchThemeBtnColorTheme = "btn-secondary";
    }
    else {
        cardColorTheme = "bg-peach";
        textColorTheme = "text-viridian-green";
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
                                ? <i style={{ fontSize: "2rem"}} className="fa-solid fa-moon"></i>
                                : <i style={{ fontSize: "2rem"}} className="fa-regular fa-sun"></i>
                        }
                    </div>
                    <div className="flex-grow-1 ms-3">
                        <h6 className="m-0 lh-1">
                            Theme:
                            <br />
                            <span className={subTextColorTheme}>
                                {isDarkTheme ? "Dark" : "Light"}
                            </span>
                        </h6>
                    </div>
                    <button
                        className={`btn btn-sm ${switchThemeBtnColorTheme}`}
                        style={{ width: "13%" }}
                        onClick={UpdateThemeHandler}
                    >
                        <i className="fa-solid fa-repeat"></i>
                    </button>
                </div>
            </div>
        </div>
    </>
    )
}