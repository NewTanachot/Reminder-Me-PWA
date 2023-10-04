import {IsStringValidEmpty} from "@/extension/string_extension";
import {PwaCurrentPageEnum} from "@/model/enumModel";
import {IRegisterProps} from "@/model/propsModel";
import {ResponseModel} from "@/model/responseModel";
import {UserExtensionModel} from "@/model/subentityModel";
import {IRegisterValidator} from "@/model/useStateModel";
import {FormEvent, useState} from "react";

// Initialize .ENV variable
const baseUrlApi: string = process.env.NEXT_PUBLIC_BASEURL_API ?? "";

export default function Register({ changeCurrentPage, isDarkTheme }: IRegisterProps) {

    // default setState object
    let RegisterValidatorObject: IRegisterValidator = {
        inputEmptyString: false,
        duplicateUserName: false 
    };

    // react hook initialize
    const [ inputValidator, setInputValidator ] = useState<IRegisterValidator>(RegisterValidatorObject);

    const UserRegister = async (event: FormEvent<HTMLFormElement>) => {

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
    
                // Reroute to login page with successBox
                changeCurrentPage({
                    page: PwaCurrentPageEnum.Login,
                    successBox: true
                });
            }
        }
        else {

            // set validator state for warning danger text
            RegisterValidatorObject.inputEmptyString = true;
            setInputValidator(RegisterValidatorObject);
        }
    }

    // Color theme handler
    let cardColorTheme: string;
    let cardHeaderColorTheme: string;
    let textHeaderColorTheme: string;
    let formColorTheme = "";
    let createBtnColorTheme: string;

    if (isDarkTheme) {
        cardColorTheme = "bg-mainGray";
        cardHeaderColorTheme = "bg-mainblack";
        textHeaderColorTheme = "text-whiteSmoke";
        createBtnColorTheme = "bg-mainblack";
        formColorTheme = "bg-whitesmoke";
    }
    else {
        cardColorTheme = "bg-peach-65";
        cardHeaderColorTheme = "bg-warning-subtle";
        textHeaderColorTheme = "text-viridian-green";
        createBtnColorTheme = "bg-viridian-green";
    }

    return (
        <form className={`card shadow-sm ${cardColorTheme}`} onSubmit={UserRegister}>
            <div className={`card-header ${cardHeaderColorTheme} ${textHeaderColorTheme}`}>
                <h2 className="m-0 text-center">Register to Reminder Me</h2>
            </div>
            <div className="card-body m-2">
                <div className="mb-3">
                    <p className="mb-1">
                        Username:
                    </p>
                    <input className={`form-control w-100 ${formColorTheme} shadow-sm`} name="usernameInputRegister" type="text" min={1} max={20} required/>
                </div>
                <div className="mt-3">
                    <p className="mb-1">
                        Password:
                    </p>
                    <input className={`form-control w-100 ${formColorTheme} shadow-sm`} name="passwordInputRegister" type="password" min={1} max={20} required/>
                </div>
                {
                    inputValidator.inputEmptyString
                        // eslint-disable-next-line react/no-unescaped-entities
                        ? <li className="text-danger text-opacity-75 ms-1 mt-2">Username and Password is shouldn't be empty text.</li>
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
                        className={`btn btn-sm w-100 my-2 ${createBtnColorTheme} text-white shadow-sm`}
                    >
                        Create User
                    </button>
                    <button
                        className="btn btn-sm btn-outline-secondary w-100 my-4 mt-2 shadow-sm"
                        onClick={() => changeCurrentPage({ page: PwaCurrentPageEnum.Login })}
                    >
                        Back
                    </button>
                </div>
            </div>
        </form>
    )
}