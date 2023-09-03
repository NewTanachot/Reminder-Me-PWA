import { PwaCurrentPage } from "@/model/enum_model";
import { ISettingProps } from "@/model/props_model";
import StaticSettingCard from "../staticSettingCard";

export default function Setting({ currentUserName, changeCurrentPage }: ISettingProps) {
    return (
        <div className="card shadow-sm bg-peach-65">
            <div className="card-body m-2">

                <StaticSettingCard
                    cardIcon="bi bi-person-square"
                    cardTitle="UserName"
                    cardInfo={currentUserName}
                ></StaticSettingCard>

                <div className="card shadow-sm bg-peach text-viridian-green">
                    <div className="card-body m-2 p-0">
                        <div className="d-flex align-items-center">
                            <div className="flex-shrink-0 ms-2">
                                <i style={{ fontSize: "2.5rem"}} className="bi bi-palette"></i>
                            </div>
                            <div className="flex-grow-1 ms-3">
                                <h5 className="m-0">
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
                                </h5>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 text-center">
                    <button
                        className="btn btn-sm btn-outline-secondary w-100 my-4 mt-2"
                        onClick={() => changeCurrentPage(PwaCurrentPage.Login)}
                    >
                        Switch User 
                    </button>
                </div>
            </div>
        </div>
    )
}