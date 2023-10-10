import {IsStringValidEmpty} from "@/extension/string_extension";
import {PwaCurrentPageEnum} from "@/model/enumModel";
import {IRegisterProps} from "@/model/propsModel";
import {ResponseModel} from "@/model/responseModel";
import {UserExtensionModel} from "@/model/subentityModel";
import {FormEvent, useState} from "react";
import LoadingComponent from "../modalAsset/loading";

// Initialize .ENV variable
const baseUrlApi: string = process.env.NEXT_PUBLIC_BASEURL_API ?? "";

export default function Register({ changeCurrentPage, isDarkTheme }: IRegisterProps) {

    const [ displayLoadingComponent, setDisplayLoadingComponent ] = useState<boolean>(false);

    const UserRegister = async (event: FormEvent<HTMLFormElement>) => {

        // show loading component
        setDisplayLoadingComponent(true);

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

                    alert(`Error message: UserName ${userNameInput} is duplicate.`);
                }
                else {
                    alert(`Error message: ${errorMessage.message}`);
                }

                // hide loading component and re render the page 
                setDisplayLoadingComponent(false);
                changeCurrentPage({ page: PwaCurrentPageEnum.Register });
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

            alert(`Error message: Username and Password is shouldn't be empty text.`);

            // hide loading component and re render the page 
            setDisplayLoadingComponent(false);
            changeCurrentPage({ page: PwaCurrentPageEnum.Register });
        }
    }

    // Color theme handler
    let cardColorTheme: string;
    let cardHeaderColorTheme: string;
    let textHeaderColorTheme: string;
    let createBtnColorTheme: string;
    let formColorTheme: string;
    let cardBorderThemeColor: string;

    if (isDarkTheme) {
        cardColorTheme = "bg-mainGray";
        cardHeaderColorTheme = "bg-mainblack";
        textHeaderColorTheme = "text-whiteSmoke";
        createBtnColorTheme = "bg-mainblack";
        formColorTheme = "bg-whitesmoke";
        cardBorderThemeColor = "border-secondary";
    }
    else {
        cardColorTheme = "bg-peach-65";
        cardHeaderColorTheme = "bg-warning-subtle";
        textHeaderColorTheme = "text-viridian-green";
        createBtnColorTheme = "bg-viridian-green";
        formColorTheme = "";
        cardBorderThemeColor = "";
    }

    return (
        <div>
            {
                displayLoadingComponent
                    ? <LoadingComponent isDarkTheme={isDarkTheme}></LoadingComponent>
                    : <></>
            }

            <form 
                className={`card shadow-sm ${cardColorTheme} ${cardBorderThemeColor}`} 
                onSubmit={UserRegister}
            >
                <div className={`card-header ${cardHeaderColorTheme} ${textHeaderColorTheme}`}>
                    <h2 className="m-0 text-center">Register</h2>
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
        </div>
    )
}