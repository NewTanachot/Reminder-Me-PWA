import { PwaCurrentPage } from "@/model/enum_model";
import { ISettingProps } from "@/model/props_model";

export default function Setting({ currentUserName, changeCurrentPage }: ISettingProps) {
    return (
        <div className="card shadow-sm bg-peach-65">
            <div className="card-header bg-warning-subtle text-viridian-green">
                <h2 className="m-0 text-center">Setting</h2>
            </div>
            <div className="card-body m-2">
                <div className="mb-3">
                    <p className="mb-1">
                        Usename: &nbsp;
                        <span className="text-secondary">{currentUserName}</span>
                    </p>
                </div>
                <div className="mt-3">
                    <p className="mb-1">
                        Password:
                    </p>
                    <input className="form-control w-100" id="passwordInput" type="password" min={1} max={20} required/>
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