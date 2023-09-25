import { PwaCurrentPage } from "@/model/enumModel";
import { ISettingProps } from "@/model/propsModel";
import StaticSettingCard from "../settingPageAsset/staticSettingCard";
import ThemeSettingCard from "../settingPageAsset/themeSettingCard";

export default function Setting({ currentUserName, changeCurrentPage, changeThemeHandler, isDarkTheme }: ISettingProps) {

    let cardColorTheme = "";
    let signOutBtnColorTheme = "";

    if (isDarkTheme) {
        cardColorTheme = "bg-mainblack";
        signOutBtnColorTheme = "btn-outline-light";
    }
    else {
        cardColorTheme = "bg-peach-65";
        signOutBtnColorTheme = "btn-outline-secondary";
    }

    return (
        <div className={`card shadow-sm ${cardColorTheme}`}>
            <div className="card-body m-2">

                {/* user info */}
                <StaticSettingCard
                    cardIcon="bi bi-person-square"
                    cardTitle="UserName"
                    cardInfo={currentUserName}
                    isDarkTheme={isDarkTheme}
                ></StaticSettingCard>

                {/* theme */}
                <ThemeSettingCard
                    changeCurrentThemeHandler={changeThemeHandler}
                    isDarkTheme={isDarkTheme}
                ></ThemeSettingCard>

                <div className="mt-4 text-center">
                    <button
                        className={`btn btn-sm ${signOutBtnColorTheme} w-100 my-4 mt-2`}
                        onClick={() => changeCurrentPage(PwaCurrentPage.Login)}
                    >
                        Sign out
                    </button>
                </div>
            </div>
        </div>
    )
}