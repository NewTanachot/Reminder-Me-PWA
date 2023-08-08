import { PwaCurrentPage } from "@/model/enum_model";
import { ILoginProps } from "@/model/props_model";
import { ResponseModel } from "@/model/response_model";
import { UserExtensionModel } from "@/model/subentity_model";
import { User } from "@prisma/client";
import SuccessModal from "./modal/success";
import { useState } from "react";
import { IsStringValidEmpty } from "@/extension/string_extension";

// Initialize .ENV variable
const indexedDB_DBName: string = process.env.NEXT_PUBLIC_INDEXED_DB_NAME ?? "";
const indexedDB_DBVersion: number = +(process.env.NEXT_PUBLIC_INDEXED_DB_VERSION ?? "");
const indexedDB_UserStore: string = process.env.NEXT_PUBLIC_INDEXED_STORE_USER ?? "";
const indexedDB_UserKey: string = process.env.NEXT_PUBLIC_INDEXED_STORE_USER_KEY ?? "";
const baseUrlApi: string = process.env.NEXT_PUBLIC_BASEURL_API ?? "";

export default function Login({ setCurrentUser, changeCurrentPage, currentPage }: ILoginProps) {

    // react hook initialize
    const [ inputEmptyStringValidator, setInputEmptyStringValidator ] = useState<boolean>(false);

    // Define a function to set up indexedDB
    const SetupIndexedDB = () => {
        return new Promise<IDBObjectStore>((resolve, reject) => {
            // set login user to indexedDB -> open indexedDB
            const request = indexedDB.open(indexedDB_DBName, indexedDB_DBVersion);
        
            // open indexedDB error handler
            request.onerror = (event: Event) => {
                // reject the promise
                alert("Error open indexedDB: " + event);
                reject();
            };
        
            // open indexedDB success handler
            request.onsuccess = () => {
                // set up indexedDB
                const dbContext = request.result;
        
                // check if store name not exist -> create store name
                if (!dbContext.objectStoreNames.contains(indexedDB_UserStore)) {
                    dbContext.createObjectStore(indexedDB_UserStore, { keyPath: indexedDB_UserKey });
                }
        
                const transaction = dbContext.transaction(indexedDB_UserStore, "readwrite");
                const store = transaction.objectStore(indexedDB_UserStore);

                // resolve the store to promise 
                resolve(store);
            };
        });
    };
    
    const UserLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        
        event.preventDefault();
        const formInput = new FormData(event.currentTarget);

        // get data from input form
        const userNameInput = formInput.get("usernameInput")?.toString();
        const passWordInput = formInput.get("passwordInput")?.toString();

        const userNameValidateResult = IsStringValidEmpty(userNameInput);
        const passwordValidateResult = IsStringValidEmpty(passWordInput);

        if (userNameValidateResult != "" && passwordValidateResult != "") {

            const loginUser: UserExtensionModel = {
                name: userNameValidateResult,
                password: passwordValidateResult
            }

            // fetch add login api
            const response = await fetch(`${baseUrlApi}/user/login`, {
                method: "POST",
                body: JSON.stringify(loginUser)
            });

            if (!response.ok) {
                
                // check login error
                const errorMessage: ResponseModel = await response.json();
                alert(`Error message: ${errorMessage.message}`);
            }
            else {

                // get currentUser user
                const currentUser: User = await response.json();

                // setup indexedDb
                const indexedDbUserStore = await SetupIndexedDB();

                // store currentUser to indexedDB
                indexedDbUserStore.put({ CurrentUser: indexedDB_UserKey, ...currentUser });

                // set new user to useRef in list page
                setCurrentUser({ 
                    userId: currentUser.id, 
                    userName: currentUser.name,
                    userLocation: {
                        latitude: -1,
                        longitude: -1
                    }
                });

                // Reroute to home page
                changeCurrentPage(PwaCurrentPage.ReminderList);
                // router.replace("/");
            }
        }
        else {

            // set validator state for warning danger text
            setInputEmptyStringValidator(true);
        }
    }

    return (
        <div>
            {
                currentPage.successAlertBox 
                    ? <SuccessModal modalMessage="Create new user success."></SuccessModal>
                    : <></>
            }

            <form className="card shadow-sm bg-peach-65" onSubmit={UserLogin}>
                <div className="card-header bg-warning-subtle text-viridian-green">
                    <h2 className="m-0 text-center">Login to Reminder Me</h2>
                </div>
                <div className="card-body m-2">
                    <div className="mb-3">
                        <p className="mb-1">
                            Usename:
                        </p>
                        <input className="form-control w-100" name="usernameInput" type="text" min={1} max={20} required/>

                    </div>
                    <div className="mt-3">
                        <p className="mb-1">
                            Password:
                        </p>
                        <input className="form-control w-100" name="passwordInput" type="password" min={1} max={20} required/>
                    </div>
                    {
                        inputEmptyStringValidator
                            ? <li className="text-danger text-opacity-75 ms-1 mt-2">Username and Password is shouldn't be empty text (" ").</li>
                            : <></>
                    }
                    <div className="mt-4 text-center">
                        <button 
                            type="submit"
                            className="btn btn-sm w-100 my-2 bg-viridian-green text-white"
                        >
                            Log In
                        </button>
                        <button
                            className="btn btn-sm btn-outline-secondary w-100 my-4 mt-2"
                            onClick={() => changeCurrentPage(PwaCurrentPage.Register)}
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}