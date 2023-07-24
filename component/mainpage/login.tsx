import { PwaCurrentPage } from "@/model/enum_model";
import { ILoginProps } from "@/model/props_model";
import { ResponseModel } from "@/model/response_model";
import { UserExtensionModel } from "@/model/subentity_model";
import { User } from "@prisma/client";

// Initialize .ENV variable
const indexedDB_DBName: string = process.env.NEXT_PUBLIC_INDEXED_DB_NAME ?? "";
const indexedDB_DBVersion: number = +(process.env.NEXT_PUBLIC_INDEXED_DB_VERSION ?? "");
const indexedDB_UserStore: string = process.env.NEXT_PUBLIC_INDEXED_STORE_USER ?? "";
const indexedDB_UserKey: string = process.env.NEXT_PUBLIC_INDEXED_STORE_USER_KEY ?? "";
const baseUrlApi: string = process.env.NEXT_PUBLIC_BASEURL_API ?? "";

export default function Login({ setCurrentUser, changeCurrentPage }: ILoginProps) {

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
    
    const userLogin = async () => {
        
        // get data from input form
        const userNameInput = document.getElementById("usernameInput") as HTMLInputElement;
        const passWordInput = document.getElementById("passwordInput") as HTMLInputElement;

        const loginUser: UserExtensionModel = {
            name: userNameInput.value,
            password: passWordInput.value
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
            setCurrentUser({ userId: currentUser.id, userName: currentUser.name });

            // Reroute to home page
            changeCurrentPage(PwaCurrentPage.ReminderList);
            // router.replace("/");
        }
    }

    return (
        <div className="card shadow-sm bg-peach-65">
            <div className="card-header bg-warning-subtle text-viridian-green">
                <h2 className="m-0">Login to Reminder Me app</h2>
            </div>
            <div className="card-body m-2">
                <div className="mb-3">
                    <p className="mb-1">
                        Usename:
                    </p>
                    <input className="form-control w-100" id="usernameInput" type="text" min={1} max={20} required/>
                </div>
                <div className="mt-3">
                    <p className="mb-1">
                        Password:
                    </p>
                    <input className="form-control w-100" id="passwordInput" type="password" min={1} max={20} required/>
                </div>
                <div className="mt-4 text-center">
                    <button 
                        className="btn btn-sm w-100 my-2 bg-viridian-green text-white"
                        onClick={userLogin}
                    >
                        Log In
                    </button>
                    <button
                        className="btn btn-sm btn-outline-secondary w-100 my-4 mt-2"
                        onClick={() => changeCurrentPage(PwaCurrentPage.ReminderList)}
                    >
                        Sign Up
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
    );
}