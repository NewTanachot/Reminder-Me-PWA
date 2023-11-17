import { IStaticSettingCardProps } from "@/model/propsModel"

export default function StaticSettingCard({ cardIcon, cardTitle, cardInfo, isDarkTheme}: IStaticSettingCardProps) {

    let cardColorTheme: string;
    let textColorTheme: string;
    let subTextColorTheme: string;

    if (isDarkTheme) {
        cardColorTheme = "bg-subBlack";
        textColorTheme = "text-whiteSmoke";
        subTextColorTheme = "text-milk-orange";
    }
    else {
        cardColorTheme = "bg-peach";
        textColorTheme = "text-viridian-green";
        subTextColorTheme = "text-secondary";
    }

    return (
    <>
        <div className={`card shadow-sm mb-3 ${textColorTheme} ${cardColorTheme}`}>
            <div className="card-body m-2 p-0">
                <div className="d-flex align-items-center">
                    <div className="flex-shrink-0 ms-2">
                        <i className={`${cardIcon} text-setting-icon-size`}></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                        <h6 className="m-0 lh-sm text-size-14">
                            {cardTitle}:
                            <br />
                            <span className={subTextColorTheme}>
                                {cardInfo}
                            </span>
                        </h6>
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}