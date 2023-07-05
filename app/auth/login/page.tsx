'use client';

import { UserExtensionModel } from "@/model/subentity_model";
import { ResponseModel } from "@/model/response_model";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";

// Initialize .ENV variable
const indexedDB_DBName: string = process.env.NEXT_PUBLIC_INDEXED_DB_NAME ?? "";
const indexedDB_DBVersion_LoginPage: number = +(process.env.NEXT_PUBLIC_INDEXED_DB_VERSION ?? "") + 1;
const indexedDB_UserStore: string = process.env.NEXT_PUBLIC_INDEXED_STORE_USER ?? "";
const indexedDB_UserKey: string = process.env.NEXT_PUBLIC_INDEXED_STORE_USER_KEY ?? "";

export default function Login() {

    // initialize router
    const router = useRouter();

    const userLogin = async () => {
        
        // get data from input form
        const userNameInput = document.getElementById("usernameInput") as HTMLInputElement;
        const passWordInput = document.getElementById("passwordInput") as HTMLInputElement;

        const loginUser: UserExtensionModel = {
            name: userNameInput.value,
            password: passWordInput.value
        }

        // fetch add login api
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL_API}/user/login`, {
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

            // set login user to indexedDB -> open indexedDB
            const request = indexedDB.open(indexedDB_DBName, indexedDB_DBVersion_LoginPage);

            // open indexedDB error handler
            request.onerror = (event: Event) => {
                alert("Error open indexedDB: " + event);
            }

            // open with indexedDB Initialize handler
            request.onupgradeneeded = () => {

                // create "currentUser" store in indexedDB
                const dbContext = request.result;
                dbContext.createObjectStore(indexedDB_UserStore, { keyPath: indexedDB_UserKey });
            }

            // open indexedDB success handler
            request.onsuccess = () => {

                // set up indexedDB
                const dbContext = request.result;

                // check if store name not exist -> create store name
                if (!dbContext.objectStoreNames.contains(indexedDB_UserStore)) {
                    dbContext.createObjectStore(indexedDB_UserStore, { keyPath: indexedDB_UserKey });
                }

                const transaction = dbContext.transaction(indexedDB_UserStore, "readwrite")
                const store = transaction.objectStore(indexedDB_UserStore);

                // store currentUser to indexedDB
                store.put({ ...currentUser, CurrentUser: indexedDB_UserKey })
                // store.put(currentUser)

                // Reroute to home page
                router.replace("/");

            }
        }

    }

    return (
        <div>
            <div>
                <h2>Login to Reminder-Me app</h2>
                <p>Usename:</p>
                <input id="usernameInput" type="text" min={1} max={20} required/>
                <p>Password:</p>
                <input id="passwordInput" type="text" min={1} max={20} required/>
            </div>
            <div>
                <Link href="/">back</Link>
                &nbsp; &nbsp; &nbsp;
                <button onClick={userLogin}>login</button>
                &nbsp; &nbsp; &nbsp;
                <Link href="/auth/register">register</Link>
            </div>
        </div>
    );
}