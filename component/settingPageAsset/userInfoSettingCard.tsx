import {IUserInfoSettingCardProps} from "@/model/propsModel"
import {PwaCurrentPageEnum} from "@/model/enumModel";

export default function UserInfoSettingCard({ userInfo, changeCurrentPage, isDarkTheme }: IUserInfoSettingCardProps) {

    const switchUserHandler = () => {
        changeCurrentPage({
            page: PwaCurrentPageEnum.Login,
            backBtn: true
        });
    }

    let cardColorTheme: string;
    let textColorTheme: string;
    let cardIconColorTheme: string;
    let subTextColorTheme: string;
    let switchUserBtnColorTheme: string;

    if (isDarkTheme) {
        cardColorTheme = "bg-subBlack";
        textColorTheme = "text-whiteSmoke";
        cardIconColorTheme = "";
        subTextColorTheme = "text-milk-orange";
        switchUserBtnColorTheme = "btn-secondary";
    }
    else {
        cardColorTheme = "bg-peach";
        textColorTheme = "text-viridian-green";
        cardIconColorTheme = "text-dark-emphasis";
        subTextColorTheme = "text-secondary";
        switchUserBtnColorTheme = "bg-viridian-green text-white";
    }

    return (
        <>
            <div className={`card shadow-sm mb-3 ${textColorTheme} ${cardColorTheme}`}>
                <div className="card-body m-2 p-0">
                    <div className="d-flex align-items-center">
                        <div className="flex-shrink-0 ms-2">
                            <i className={`fa-solid fa-user-tie text-setting-icon-size ${cardIconColorTheme}`}></i>
                        </div>
                        <div className="flex-grow-1 ms-3">
                            <p className="m-0 lh-sm text-size-14">
                                Username
                                <br />
                                <span className={subTextColorTheme}>
                                    • {userInfo}
                                </span>
                            </p>
                        </div>
                        <button
                                className={`btn btn-sm ${switchUserBtnColorTheme} btn-setting-icon-size bg-gradient`}
                                onClick={switchUserHandler}
                            >
                                <i className="fa-solid fa-people-arrows"></i>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}