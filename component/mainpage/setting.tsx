import { ISettingProps } from "@/model/propsModel";
import StaticSettingCard from "../settingPageAsset/staticSettingCard";
import ThemeSettingCard from "../settingPageAsset/themeSettingCard";
import UserInfoSettingCard from "@/component/settingPageAsset/userInfoSettingCard";

export default function Setting({ currentUserName, changeCurrentPage, changeThemeHandler, userLogoutHandler, softwareVersion, isDarkTheme }: ISettingProps) {

    let cardColorTheme: string;
    let signOutBtnColorTheme: string;

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
                <UserInfoSettingCard
                    userInfo={currentUserName}
                    changeCurrentPage={changeCurrentPage}
                    isDarkTheme={isDarkTheme}
                ></UserInfoSettingCard>

                {/* theme */}
                <ThemeSettingCard
                    changeCurrentThemeHandler={changeThemeHandler}
                    isDarkTheme={isDarkTheme}
                ></ThemeSettingCard>

                {/* version */}
                <StaticSettingCard
                    cardIcon="fa-solid fa-code-branch"
                    cardTitle="Software Version"
                    cardInfo={`v${softwareVersion}`}
                    isDarkTheme={isDarkTheme}
                ></StaticSettingCard>

                <div className="mt-4 text-center">
                    <button
                        className={`btn btn-sm ${signOutBtnColorTheme} w-100 my-4 mt-2 shadow-sm`}
                        onClick={userLogoutHandler}
                    >
                        Sign out
                    </button>
                </div>
            </div>
        </div>
    )
}