import { IThemeSettingCardProps } from "@/model/propsModel";

export default function ThemeSettingCard({ isDarkTheme, changeCurrentThemeHandler }: IThemeSettingCardProps) {

    const UpdateThemeHandler = (event : React.ChangeEvent<HTMLSelectElement>) => {

        console.log(Number(event.target.value))

        Number(event.target.value)
            ? changeCurrentThemeHandler(false)
            : changeCurrentThemeHandler(true);
    };

    let cardColorTheme = "";
    let textColorTheme = "";
    let subTextColorTheme = "";

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
            <div className={`card shadow-sm mb-3 ${cardColorTheme} ${textColorTheme}`}>
                <div className="card-body m-2 p-0">
                    <div className="d-flex align-items-center">
                        <div className="flex-shrink-0 ms-2">
                            {/* <i style={{ fontSize: "2rem"}} className="bi bi-palette"></i> */}
                            {
                                isDarkTheme
                                ? <i className="bi bi-moon-fill" style={{ fontSize: "2rem"}}></i>
                                : <i className="bi bi-sun-fill" style={{ fontSize: "2rem"}}></i>
                            }   
                        </div>
                        <div className="flex-grow-1 ms-3">
                            <h6 className="m-0">
                                Theme:
                                <select 
                                    className="form-select form-select-sm bg-subBlack text-milk-orange w-50 mt-1" 
                                    aria-label=".form-select-sm example"
                                    onChange={UpdateThemeHandler}
                                >
                                    <option selected={!isDarkTheme} value={0}>Light</option>
                                    <option selected={isDarkTheme} value={1}>Dark</option>
                                </select>
                            </h6>
                        </div>
                    </div>
                </div>
            </div>
        </>
        )

    // return (
    // <>
    //     <div className={`card shadow-sm mb-3 ${cardColorTheme} ${textColorTheme}`}>
    //         <div className="card-body m-2 p-0">
    //             <div className="d-flex align-items-center">
    //                 <div className="flex-shrink-0 ms-2">
    //                     <i style={{ fontSize: "2rem"}} className="bi bi-palette"></i>
    //                 </div>
    //                 <div className="flex-grow-1 ms-3">
    //                     <h6 className="m-0">
    //                         Theme:
    //                         <br />
    //                         <span className={subTextColorTheme}>
    //                             <div className="form-check form-check-inline mb-0">
    //                                 <input 
    //                                     className="form-check-input" 
    //                                     name="flexRadioDefault" 
    //                                     type="radio" 
    //                                     defaultChecked={!isDarkTheme}
    //                                     onChange={() => {UpdateThemeHandler(false)}}
    //                                 />
    //                                 <label className="form-check-label">
    //                                     <i className="bi bi-sun-fill"></i>
    //                                 </label>
    //                             </div>
    //                             <div className="form-check form-check-inline mb-0">
    //                                 <input 
    //                                     className="form-check-input" 
    //                                     name="flexRadioDefault" 
    //                                     type="radio" 
    //                                     defaultChecked={isDarkTheme}
    //                                     onChange={() => {UpdateThemeHandler(true)}}
    //                                 />
    //                                 <label className="form-check-label">
    //                                     <i className="bi bi-moon-fill"></i>
    //                                 </label>
    //                             </div>
    //                         </span>
    //                     </h6>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // </>
    // )
}