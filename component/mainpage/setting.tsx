import { ISettingProps } from "@/model/propsModel";
import StaticSettingCard from "../settingPageAsset/staticSettingCard";
import ThemeSettingCard from "../settingPageAsset/themeSettingCard";
import UserInfoSettingCard from "@/component/settingPageAsset/userInfoSettingCard";
import MapSettingCard from "../settingPageAsset/mapSettingCard";
import CacheClearSettingCard from "../settingPageAsset/cacheClearSettingCard";
import CardHeader from "../layoutAsset/cardHeader";
import { PwaCurrentPageEnum } from "@/model/enumModel";

export default function Setting({ 
    currentUserName, 
    changeCurrentPage, 
    changeThemeHandler, 
    userLogoutHandler, 
    softwareVersion, 
    isDarkTheme, 
    developedBy, 
    currentMap, 
    changeCurrentMapHandler,
    lastCacheClearing,
    deleteIndexedDB
}: ISettingProps) {

    let cardColorTheme: string;
    let signOutBtnColorTheme: string;

    if (isDarkTheme) {
        cardColorTheme = "bg-mainblack border-bottom-0";
        signOutBtnColorTheme = "bg-steelblue text-white";
    }
    else {
        cardColorTheme = "bg-peach-65";
        signOutBtnColorTheme = "bg-viridian-green text-white";
    }

    return (
        <div className={`card border-0 shadow ${cardColorTheme} bg-gradient theme-transition-ease-out-25`}>
            <div className="card-body m-2">
                <CardHeader
                    pageNameEnum={PwaCurrentPageEnum.Setting}
                    changeCurrentPage={changeCurrentPage}
                    isDarkTheme={isDarkTheme}
                ></CardHeader>

                {/* user info */}
                <UserInfoSettingCard
                    userInfo={currentUserName}
                    changeCurrentPage={changeCurrentPage}
                    isDarkTheme={isDarkTheme}
                ></UserInfoSettingCard>

                {/* Clear cache */}
                <CacheClearSettingCard
                    lastCacheClearing={lastCacheClearing}
                    deleteIndexedDB={deleteIndexedDB}
                    isDarkTheme={isDarkTheme}
                ></CacheClearSettingCard>

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
                    cardIcon="fa-brands fa-dev mx-1"
                    cardTitle="Developed By"
                    cardInfo={developedBy}
                    isDarkTheme={isDarkTheme}
                ></StaticSettingCard>

                {/* version */}
                <StaticSettingCard
                    cardIcon="fa-solid fa-code-branch mx-1"
                    cardTitle="Software Version"
                    cardInfo={`v${softwareVersion}`}
                    isDarkTheme={isDarkTheme}
                ></StaticSettingCard>

                <div className="mt-4 text-center">
                    <button
                        className={`btn btn-sm ${signOutBtnColorTheme} w-100 my-4 mt-2 shadow-sm theme-transition-ease-out-25`}
                        onClick={userLogoutHandler}
                    >
                        Sign out
                        <i className="fa-solid fa-arrow-right-from-bracket ms-2"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}