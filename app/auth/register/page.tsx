'use client';

import { UserExtensionModel } from "@/model/subentity_model";
import { ResponseModel } from "@/model/response_model";
import Link from "next/link";
import { GetApiUrlByBranchName } from "@/extension/api_extension";

// Initialize .ENV variable
const baseUrlApi: string = GetApiUrlByBranchName();

export default function Register() {

    // add button handler
    const addUser = async () => {

        // get data from input form
        const userNameInput = document.getElementById("usernameInput") as HTMLInputElement;
        const passWordInput = document.getElementById("passwordInput") as HTMLInputElement;

        const addUser: UserExtensionModel = {
            name: userNameInput.value,
            password: passWordInput.value
        }
    
        // fetch add user
        const response = await fetch(`${baseUrlApi}/user`, {
            method: "POST",
            body: JSON.stringify(addUser)
        });

        if (!response.ok) {
            
            const errorMessage: ResponseModel = await response.json();
            alert(`Error message: ${errorMessage.message}`)
        }
    }

    return (
        <div>
            <div>
                <h2>Register to Reminder-Me app</h2>
                <p>Usename:</p>
                <input id="usernameInput" type="text" min={1} max={20} required/>
                <p>Password:</p>
                <input id="passwordInput" type="text" min={1} max={20} required/>
            </div>
            <div>
                <Link href="/">back</Link>
                &nbsp; &nbsp; &nbsp;
                <Link href="/auth/user" onClick={addUser}>create user</Link>
                &nbsp; &nbsp; &nbsp;
                <Link href="/auth/user">manage user</Link>
            </div>
        </div>
    );
}