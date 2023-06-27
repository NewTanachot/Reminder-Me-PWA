'use client';

import { createUser } from "@/model/entity_extension";
import { User } from "@prisma/client";
import Link from "next/link";

export default function Register() {

    // add button handler
    const addUser = async () => {

        // get data from input form
        const userNameInput = document.getElementById("usernameInput") as HTMLInputElement;
        const passWordInput = document.getElementById("passwordInput") as HTMLInputElement;

        const addUser: createUser = {
            name: userNameInput.value,
            password: passWordInput.value
        }
  
        // fetch add user
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL_API}/user`, {
            method: "POST",
            body: JSON.stringify(addUser)
        });
        const users: User = await response.json();

        // warning user
        alert("Success: create new user" + users.name);
    
        location.replace("/auth/user");
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
                <Link href="">back</Link>
                &nbsp;
                <Link href="" onClick={addUser}>register</Link>
                &nbsp; &nbsp; &nbsp;
                <Link href="/auth/user">manage user</Link>
            </div>
        </div>
    );
}