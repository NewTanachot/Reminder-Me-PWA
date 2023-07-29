import { IsStringValid } from "@/extension/string_extension";
import { PwaCurrentPage } from "@/model/enum_model";
import { IRegisterProps } from "@/model/props_model";
import { ResponseModel } from "@/model/response_model";
import { UserExtensionModel } from "@/model/subentity_model";
import { IInputValidator } from "@/model/useState_model";
import { useState } from "react";

// Initialize .ENV variable
const baseUrlApi: string = process.env.NEXT_PUBLIC_BASEURL_API ?? "";

export default function Register({ changeCurrentPage }: IRegisterProps) {

    // react hook initialize
    const [ inputValidator, setInputValidator ] = useState<IInputValidator>({ userNameValidator: false, passwordValidator: false });

    const UserRegister = async () => {

        // get data from input form
        const userNameInput = document.getElementById("usernameInputRegister") as HTMLInputElement;
        const passWordInput = document.getElementById("passwordInputRegister") as HTMLInputElement;

        const userNameValidateResult = IsStringValid(userNameInput.value);
        const passwordValidateResult = IsStringValid(passWordInput.value);

        if (userNameValidateResult && passwordValidateResult) {

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
        else {

            // set validator state for warning danger text
            setInputValidator({
                userNameValidator: !userNameValidateResult,
                passwordValidator: !passwordValidateResult
            });
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
                    {
                        inputValidator.userNameValidator
                            ? <li className="text-danger text-opacity-75 ms-1">Username is required.</li>
                            : <></>
                    }
                </div>
                <div className="mt-3">
                    <p className="mb-1">
                        Password:
                    </p>
                    <input className="form-control w-100" id="passwordInputRegister" type="password" min={1} max={20} required/>
                    {
                        inputValidator.passwordValidator
                            ? <li className="text-danger text-opacity-75 ms-1">Password is required.</li>
                            : <></>
                    }
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
            </div>
        </div>
    )
}