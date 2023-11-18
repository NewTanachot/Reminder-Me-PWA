import { ICacheClearSettingCardProps } from "@/model/propsModel";

export default function CacheClearSettingCard({ isDarkTheme }: ICacheClearSettingCardProps) {

    let cardColorTheme: string;
    let textColorTheme: string;
    let cardIconColorTheme: string;
    let btnColorTheme: string;

    if (isDarkTheme) {
        cardColorTheme = "bg-subBlack";
        textColorTheme = "text-whiteSmoke";
        cardIconColorTheme = "";
        btnColorTheme = "btn-secondary";
    }
    else {
        cardColorTheme = "bg-peach";
        textColorTheme = "text-viridian-green";
        cardIconColorTheme = "text-dark-emphasis";
        btnColorTheme = "bg-viridian-green text-white";
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
                            <h6 className="m-0 lh-sm text-size-14">
                                Username:
                            </h6>
                        </div>
                        <button
                                className={`btn btn-sm ${btnColorTheme} btn-setting-icon-size bg-gradient`}
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