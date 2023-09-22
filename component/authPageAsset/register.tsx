import { IsStringValidEmpty } from "@/extension/string_extension";
import { PwaCurrentPage } from "@/model/enumModel";
import { IRegisterProps } from "@/model/propsModel";
import { ResponseModel } from "@/model/responseModel";
import { UserExtensionModel } from "@/model/subentityModel";
import { IRegisterValidator } from "@/model/useStateModel";
import { useState } from "react";

// Initialize .ENV variable
const baseUrlApi: string = process.env.NEXT_PUBLIC_BASEURL_API ?? "";

export default function Register({ changeCurrentPage }: IRegisterProps) {

    // default setState object
    let RegisterValidatorObject: IRegisterValidator = {
        inputEmptyString: false,
        duplicateUserName: false 
    };

    // react hook initialize
    const [ inputValidator, setInputValidator ] = useState<IRegisterValidator>(RegisterValidatorObject);

    const UserRegister = async (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();
        const formInput = new FormData(event.currentTarget);

        // get data from input form
        const userNameInput = formInput.get("usernameInputRegister")?.toString();
        const passWordInput = formInput.get("passwordInputRegister")?.toString();

        const userNameValidateResult = IsStringValidEmpty(userNameInput);
        const passwordValidateResult = IsStringValidEmpty(passWordInput);

        if (userNameValidateResult && passwordValidateResult) {

            const registerUser: UserExtensionModel = {
                name: userNameValidateResult,
                password: userNameValidateResult
            }
    
            const response = await fetch(`${baseUrlApi}/user`, {
                method: "POST",
                body: JSON.stringify(registerUser)
            });
    
            if (!response.ok) {
                
                // check login error
                const errorMessage: ResponseModel = await response.json();

                if (errorMessage.message.includes("Maybe duplicate name")) {

                    RegisterValidatorObject.duplicateUserName = true;
                    setInputValidator(RegisterValidatorObject);
                }
                else {
                    alert(`Error message: ${errorMessage.message}`);
                }
            }
            else {
    
                // Reroute to home page
                changeCurrentPage(PwaCurrentPage.Login, true);
            }
        }
        else {

            // set validator state for warning danger text
            RegisterValidatorObject.inputEmptyString = true;
            setInputValidator(RegisterValidatorObject);
        }
    }

    return (
        <form className="card shadow-sm bg-peach-65" onSubmit={UserRegister}>
            <div className="card-header bg-warning-subtle text-viridian-green">
                <h2 className="m-0 text-center">Register to Reminder Me</h2>
            </div>
            <div className="card-body m-2">
                <div className="mb-3">
                    <p className="mb-1">
                        Usename:
                    </p>
                    <input className="form-control w-100" name="usernameInputRegister" type="text" min={1} max={20} required/>
                </div>
                <div className="mt-3">
                    <p className="mb-1">
                        Password:
                    </p>
                    <input className="form-control w-100" name="passwordInputRegister" type="password" min={1} max={20} required/>
                </div>
                {
                    inputValidator.inputEmptyString
                        ? <li className="text-danger text-opacity-75 ms-1 mt-2">Username and Password is shouldn't be empty text (" ").</li>
                        : <></>
                }
                {
                    inputValidator.duplicateUserName
                        ? <li className="text-danger text-opacity-75 ms-1 mt-2">This Username is registered already.</li>
                        : <></>
                }
                <div className="mt-4 text-center">
                    <button 
                        type="submit"
                        className="btn btn-sm w-100 my-2 bg-viridian-green text-white"
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
        </form>
    )
}