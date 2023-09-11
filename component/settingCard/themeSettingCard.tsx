import { IThemeSettingCardProps } from "@/model/props_model";

export default function ThemeSettingCard({ isDarkTheme, changeCurrentThemeHandler }: IThemeSettingCardProps) {

    const UpdateThemeHandler = (isDarkThemeParam: boolean) => {
        console.log(isDarkThemeParam)
        changeCurrentThemeHandler(isDarkThemeParam);
    };

    console.log("is dark theme : " + isDarkTheme);

    return (
    <>
        <div className="card shadow-sm bg-peach text-viridian-green mb-3">
            <div className="card-body m-2 p-0">
                <div className="d-flex align-items-center">
                    <div className="flex-shrink-0 ms-2">
                        <i style={{ fontSize: "2rem"}} className="bi bi-palette"></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                        <h6 className="m-0">
                            Theme:
                            <br />
                            <span className="text-secondary">
                                <div className="form-check form-check-inline mb-0">
                                    <input 
                                        className="form-check-input" 
                                        name="flexRadioDefault" 
                                        type="radio" 
                                        defaultChecked={!isDarkTheme}
                                        onChange={() => {UpdateThemeHandler(false)}}
                                    />
                                    <label className="form-check-label">
                                        <i className="bi bi-sun-fill"></i>
                                    </label>
                                </div>
                                <div className="form-check form-check-inline mb-0">
                                    <input 
                                        className="form-check-input" 
                                        name="flexRadioDefault" 
                                        type="radio" 
                                        defaultChecked={isDarkTheme}
                                        onChange={() => {UpdateThemeHandler(true)}}
                                    />
                                    <label className="form-check-label">
                                        <i className="bi bi-moon-fill"></i>
                                    </label>
                                </div>
                            </span>
                        </h6>
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}