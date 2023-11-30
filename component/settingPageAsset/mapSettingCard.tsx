import { ConvertEnumToListOfString } from "@/extension/string_extension";
import { MapTitleEnum } from "@/model/enumModel";
import { IMapSettingCardProps } from "@/model/propsModel";

export default function MapSettingCard({ currentMap, changeCurrentMapHandler, isDarkTheme }: IMapSettingCardProps) {

    const currentMapString = MapTitleEnum[currentMap];

    const ChangeCurrentMapHandler = (event : React.ChangeEvent<HTMLSelectElement>) => {

        const castStringToEnum = +Object.values(MapTitleEnum)[Object.keys(MapTitleEnum).indexOf(event.target.value)];
        changeCurrentMapHandler(castStringToEnum);
    }

    let cardColorTheme: string;
    let textColorTheme: string;
    let cardIconColorTheme: string;
    let subTextColorTheme: string;
    let switchThemeBtnColorTheme: string;

    if (isDarkTheme) {
        cardColorTheme = "bg-subblack";
        textColorTheme = "text-whitesmoke";
        cardIconColorTheme = "";
        subTextColorTheme = "text-milk-orange";
        switchThemeBtnColorTheme = "bg-steelblue border-primary-subtle";
    }
    else {
        cardColorTheme = "bg-peach";
        textColorTheme = "text-viridian-green";
        cardIconColorTheme = "text-dark-emphasis";
        subTextColorTheme = "text-secondary";
        switchThemeBtnColorTheme = "bg-viridian-green border-success-subtle";
    }

    return (
    <>
        <div className={`card shadow-sm mb-3 ${cardColorTheme} ${textColorTheme}`}>
            <div className="card-body m-2 p-0">
                <div className="d-flex align-items-center">
                    <div className="flex-shrink-0 ms-1">
                        <i className={`fa-solid fa-earth-americas text-setting-icon-size ${cardIconColorTheme}`}></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                        <p className="m-0 lh-sm text-size-14">
                            Map Style
                            <br />
                            <span className={subTextColorTheme}>
                                • {currentMapString.toLowerCase()}
                            </span>
                        </p>
                    </div>
                    <select 
                        className={`rounded-1 shadow-sm text-size-15 ps-2 text-center ${switchThemeBtnColorTheme} text-whitesmoke`}
                        defaultValue={currentMapString}
                        onChange={ChangeCurrentMapHandler}
                    >
                    {
                        ConvertEnumToListOfString(MapTitleEnum).map((mapTitle, index) =>
                            <option 
                                key={index}
                                value={mapTitle}
                            >
                                {mapTitle.toString().toLowerCase()} 
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