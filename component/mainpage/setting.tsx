import { ISettingProps } from "@/model/propsModel";
import StaticSettingCard from "../settingPageAsset/staticSettingCard";
import ThemeSettingCard from "../settingPageAsset/themeSettingCard";
import UserInfoSettingCard from "@/component/settingPageAsset/userInfoSettingCard";
import MapSettingCard from "../settingPageAsset/mapSettingCard";

export default function Setting({ 
    currentUserName, 
    changeCurrentPage, 
    changeThemeHandler, 
    userLogoutHandler, 
    softwareVersion, 
    isDarkTheme, 
    developedBy, 
    currentMap, 
    changeCurrentMapHandler 
}: ISettingProps) {

    let cardColorTheme: string;
    let signOutBtnColorTheme: string;

    if (isDarkTheme) {
        cardColorTheme = "bg-mainblack";
        signOutBtnColorTheme = "btn-secondary";
    }
    else {
        cardColorTheme = "bg-peach-65";
        signOutBtnColorTheme = "bg-viridian-green text-white";
    }

    return (
        <div className={`card shadow-sm ${cardColorTheme} bg-gradient`}>
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

                {/* Map Theme */}
                <MapSettingCard
                    currentMap={currentMap}
                    isDarkTheme={isDarkTheme}
                    changeCurrentMapHandler={changeCurrentMapHandler}
                ></MapSettingCard>

                {/* Develop by */}
                <StaticSettingCard
                    cardIcon="fa-solid fa-file-code"
                    cardTitle="Developed By"
                    cardInfo={developedBy}
                    isDarkTheme={isDarkTheme}
                ></StaticSettingCard>

                {/* version */}
                <StaticSettingCard
                    cardIcon="fa-solid fa-code-branch"
                    cardTitle="Software Version"
                    cardInfo={`v${softwareVersion}`}
                    isDarkTheme={isDarkTheme}
                ></StaticSettingCard>

                <div className="mt-4 text-center">
                    <button
                        className={`btn btn-sm ${signOutBtnColorTheme} w-100 my-4 mt-2 shadow-sm bg-gradient`}
                        onClick={userLogoutHandler}
                    >
                        Sign out
                    </button>
                </div>
            </div>
        </div>
    )
}