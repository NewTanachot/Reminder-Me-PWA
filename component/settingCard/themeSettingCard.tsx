export default function ThemeSettingCard() {

    return (
    <>
        <div className="card shadow-sm bg-peach text-viridian-green">
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
                                <div className="form-check form-check-inline">
                                    <input 
                                        className="form-check-input" 
                                        type="radio" 
                                        name="inlineRadioOptions" 
                                        id="inlineRadio1" 
                                        value="option1"
                                        defaultChecked={true}
                                    />
                                    <label className="form-check-label">
                                        <i className="bi bi-sun-fill"></i>
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input 
                                        className="form-check-input" 
                                        type="radio" 
                                        name="inlineRadioOptions" 
                                        id="inlineRadio2" 
                                        value="option2"
                                    />
                                    <label className="form-check-label">
                                        <i className="bi bi-moon-stars-fill"></i>
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