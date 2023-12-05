import {IsStringValidEmpty} from "@/extension/string_extension";
import {PwaCurrentPageEnum} from "@/model/enumModel";
import {IRegisterProps} from "@/model/propsModel";
import {ResponseModel} from "@/model/responseModel";
import {UserExtensionModel} from "@/model/subentityModel";
import {FormEvent, useState} from "react";
import LoadingComponent from "../modalAsset/loading";
import CardHeader from "../layoutAsset/cardHeader";

export default function Register({ currentPage, changeCurrentPage, isDarkTheme, baseUrlApi }: IRegisterProps) {

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
                password: passwordValidateResult
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

                // hide loading component
                setDisplayLoadingComponent(false);
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

            // hide loading component and alert error
            alert(`Error message: Username and Password is shouldn't be empty text.`);
            setDisplayLoadingComponent(false);
        }
    }

    // Color theme handler
    let cardColorTheme: string;
    let cardtextColorTheme: string;
    let createBtnColorTheme: string;
    let formColorTheme: string;

    if (isDarkTheme) {
        cardColorTheme = "bg-mainblack border-bottom-0";
        cardtextColorTheme= "text-whitesmoke";
        createBtnColorTheme = "bg-steelblue";
        formColorTheme = "bg-whitesmoke";
    }
    else {
        cardColorTheme = "bg-peach-65";
        cardtextColorTheme= "text-whitesmoke";
        createBtnColorTheme = "bg-viridian-green";
        formColorTheme = "bg-white";
    }

    return (
        <div>
            <LoadingComponent 
                isDarkTheme={isDarkTheme}
                isDisplay={displayLoadingComponent}
            ></LoadingComponent>    
            <form 
                className={`card border-0 shadow ${cardColorTheme} bg-gradient`} 
                onSubmit={UserRegister}
            >
                <div className={`card-body m-2 ${cardtextColorTheme}`}>
                    <CardHeader
                        pageName={currentPage.pageName}
                        backToPage={PwaCurrentPageEnum.Login}
                        changeCurrentPage={changeCurrentPage}
                        isDarkTheme={isDarkTheme}
                    ></CardHeader>
                    <div className="my-4">
                        <p className="mb-1">
                            Username:
                        </p>
                        <input className={`form-control w-100 ${formColorTheme} shadow-sm`} name="usernameInputRegister" type="text" min={1} max={20} required/>

                    </div>
                    <div className="mt-4">
                        <p className="mb-1">
                            Password:
                        </p>
                        <input className={`form-control w-100 ${formColorTheme} shadow-sm`} name="passwordInputRegister" type="password" min={1} max={20} required/>
                    </div>
                    <button 
                        type="submit"
                        className={`btn btn-sm w-100 ${createBtnColorTheme} mt-5 mb-1 text-white shadow-sm`}
                    >
                        Create User
                    </button>
                </div>
            </form>
        </div>
    )
}