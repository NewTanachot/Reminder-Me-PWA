import { PwaCurrentPage } from "@/model/enum_model";
import { IRegisterProps } from "@/model/props_model";
import { ResponseModel } from "@/model/response_model";
import { UserExtensionModel } from "@/model/subentity_model";
import { User } from "@prisma/client";

// Initialize .ENV variable
const baseUrlApi: string = process.env.NEXT_PUBLIC_BASEURL_API ?? "";

export default function Register({ changeCurrentPage }: IRegisterProps) {

    const UserRegister = async () => {

        // get data from input form
        const userNameInput = document.getElementById("usernameInputRegister") as HTMLInputElement;
        const passWordInput = document.getElementById("passwordInputRegister") as HTMLInputElement;

        const registerUser: UserExtensionModel = {
            name: userNameInput.value,
            password: passWordInput.value
        }

        const response = await fetch(`${baseUrlApi}/user`, {
            method: "POST",
            body: JSON.stringify(registerUser)
        });

        if (!response.ok) {
            
            // check login error
            const errorMessage: ResponseModel = await response.json();
            alert(`Error message: ${errorMessage.message}`);
        }
        else {

            // Reroute to home page
            changeCurrentPage(PwaCurrentPage.Login, true);
        }
    }

    return (
        <div className="card shadow-sm bg-peach-65">
            <div className="card-header bg-warning-subtle text-viridian-green">
                <h2 className="m-0">Register to Reminder Me</h2>
            </div>
            <div className="card-body m-2">
                <div className="mb-3">
                    <p className="mb-1">
                        Usename:
                    </p>
                    <input className="form-control w-100" id="usernameInputRegister" type="text" min={1} max={20} required/>
                </div>
                <div className="mt-3">
                    <p className="mb-1">
                        Password:
                    </p>
                    <input className="form-control w-100" id="passwordInputRegister" type="password" min={1} max={20} required/>
                </div>
                <div className="mt-4 text-center">
                    <button 
                        className="btn btn-sm w-100 my-2 bg-viridian-green text-white"
                        onClick={UserRegister}
                    >
                        Create User
                    </button>
                    <button
                        className="btn btn-sm btn-outline-secondary w-100 my-4 mt-2"
                        onClick={() => changeCurrentPage(PwaCurrentPage.Login)}
                    >
                        Back
                    </button>
                </div>
                {/* <div>
                    <button onClick={() => changeCurrentPage(PwaCurrentPage.ReminderList)}>back</button>
                    &nbsp; &nbsp; &nbsp;
                    <button onClick={userLogin}>login</button>
                    &nbsp; &nbsp; &nbsp;
                    <button onClick={() => changeCurrentPage(PwaCurrentPage.ReminderList)}>register</button>
                </div> */}
            </div>
        </div>
    )
}