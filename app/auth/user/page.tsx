'use client';

import { ResponseModel } from "@/model/response_model";
import { User } from "@prisma/client";
import { useEffect, useState, MouseEvent } from "react";

export default function User() {

    // declare useState
    const [users, setUsers] = useState<User[]>([]);

    // fetch get user function
    const FetchData = async (): Promise<void> => {

        // fetch get api
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL_API}/user`);

        if (!response.ok) {

            const errorMessage: ResponseModel = await response.json();
            alert(`Error message: ${errorMessage.message}`)
        }
        else {

            // set user State
            const users: User[] = await response.json();
            setUsers(users);
        }
    }

    // fetch api at initialize
    useEffect(() => {
        FetchData();
    }, []);

    // delete button handler
    const deleteUser = async (event : MouseEvent<HTMLButtonElement>): Promise<void> => {

        // get userId 
        const userId = event.currentTarget.value;

        // set User state
        setUsers(users.filter(e => e.id != userId));

        // fetch delete api
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL_API}/user/${userId}`, { method: "DELETE" });

        if (!response.ok) {

            const errorMessage: ResponseModel = await response.json();
            alert(`Error message: ${errorMessage.message}`)
        }
    }

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>UserId</th>
                        <th>UserName</th>
                        <th>Password</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.length > 0 ?
                        users.map((user, index) => 
                            <tr key={index}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.password}</td>
                                <td>
                                    <button onClick={deleteUser} value={user.id}>Delete</button>
                                </td>
                            </tr>
                        )
                        : <tr><td>not user data...</td></tr>
                    }
                </tbody>
            </table>
        </>
    );
}