import { StringDateToDisplayDate } from "@/extension/string_extension";
import { ICacheClearSettingCardProps } from "@/model/propsModel";

const confirmMessage = `Are you sure about cache clearing ? 
    • you need to login to application again.
`

export default function CacheClearSettingCard({ deleteIndexedDB, lastCacheClearing, isDarkTheme }: ICacheClearSettingCardProps) {

    const ClearCacheBtnHandler = () => {
        // confirm clear cache
        if (confirm(confirmMessage)) {
            deleteIndexedDB();
        }
    };

    let cardColorTheme: string;
    let textColorTheme: string;
    let cardIconColorTheme: string;
    let subTextColorTheme: string;
    let btnColorTheme: string;

    if (isDarkTheme) {
        cardColorTheme = "bg-subblack";
        textColorTheme = "text-whitesmoke";
        cardIconColorTheme = "";
        subTextColorTheme = "text-milk-orange";
        btnColorTheme = "bg-glaucous border-bottom-0";
    }
    else {
        cardColorTheme = "bg-peach";
        textColorTheme = "text-viridian-green";
        cardIconColorTheme = "text-dark-emphasis";
        subTextColorTheme = "text-secondary";
        btnColorTheme = "bg-viridian-green";
    }

    return (
        <>
            <div className={`card shadow-sm mb-3 ${textColorTheme} ${cardColorTheme}`}>
                <div className="card-body m-2 p-0">
                    <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                            <i className={`fa-solid fa-server ms-1 text-setting-icon-size ${cardIconColorTheme}`}></i>
                        </div>
                        <div className="flex-grow-1 ms-3">
                            <p className="m-0 lh-sm text-size-14">
                                Clear Cache
                                <br />
                                <span className={subTextColorTheme}>
                                    • {StringDateToDisplayDate(lastCacheClearing) as string}
                                </span>
                            </p>
                        </div>
                        <button
                                className={`btn btn-sm ${btnColorTheme} text-white btn-setting-icon-size bg-gradient`}
                                onClick={ClearCacheBtnHandler}
                            >
                                <i className="fa-solid fa-eraser"></i>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}