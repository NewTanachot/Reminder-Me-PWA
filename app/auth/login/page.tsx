'use client';

import { UserExtensionModel } from "@/model/subentity_model";
import { ResponseModel } from "@/model/response_model";
import { User } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const userLocalStorage = process.env.NEXT_PUBLIC_LOCALSTORAGE_USE ?? "";

export default function Login() {

    // initialize router
    const router = useRouter();

    // reset user Credentials
    useEffect(() => {
        localStorage.removeItem(userLocalStorage);
    }, []);

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
            alert(`Error message: ${errorMessage.message}`)
        }
        else {

            // set userdata to local storage
            const userFromLogin: User = await response.json();
            localStorage.setItem(userLocalStorage, JSON.stringify(userFromLogin));

            router.replace("/");
        }

    };

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