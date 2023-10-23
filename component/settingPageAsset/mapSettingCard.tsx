import { MapStyleTitleEnum } from "@/model/enumModel";
import { IMapSettingCardProps } from "@/model/propsModel";

export default function MapSettingCard({ currentMap, changeCurrentMapHandler, isDarkTheme }: IMapSettingCardProps) {

    const currentMapString = MapStyleTitleEnum[currentMap];

    const ChangeCurrentMapHandler = (event : React.ChangeEvent<HTMLSelectElement>) => {

        const castStringToEnum = +Object.values(MapStyleTitleEnum)[Object.keys(MapStyleTitleEnum).indexOf(event.target.value)];
        changeCurrentMapHandler(castStringToEnum);
    }

    let cardColorTheme: string;
    let textColorTheme: string;
    let subTextColorTheme: string;
    let switchThemeBtnColorTheme: string;

    if (isDarkTheme) {
        cardColorTheme = "bg-subBlack";
        textColorTheme = "text-whiteSmoke";
        subTextColorTheme = "text-milk-orange";
        switchThemeBtnColorTheme = "bg-secondary";
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
                        <i className="fa-solid fa-earth-americas text-setting-icon-size"></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                        <h6 className="m-0 lh-1">
                            Map Style:
                            <br />
                            <span className={subTextColorTheme}>
                                {currentMapString}
                            </span>
                        </h6>
                    </div>
                    <select 
                        className={`form-select form-select-sm w-38 ${switchThemeBtnColorTheme} text-white`}
                        defaultValue={currentMapString}
                        onChange={ChangeCurrentMapHandler}
                    >
                    {
                        Object.values(MapStyleTitleEnum).filter((mapTitle) => isNaN(Number(mapTitle))).map((mapTitle, index) =>
                            <option 
                                key={index}
                                value={mapTitle}
                            >
                                {mapTitle}             
                            </option>
                        )
                    }
                    </select>
                </div>
            </div>
        </div>
    </>
    )
}