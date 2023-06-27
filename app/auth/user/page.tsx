'use client';

import { User } from "@prisma/client";
import { useEffect, useState } from "react";

export default function User() {

    // declare useState
    const [users, setUsers] = useState<User[]>([]);

    // fetch get user function
    const fetchData = async (): Promise<void> => {

        // fetch get api
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL_API}/user`);
        const users: User[] = await response.json();

        // set user State
        console.log(users);
        setUsers(users);
    }

    // fetch api at initialize
    useEffect(() => {
        fetchData();
    }, []);

    // delete button handler
    const deleteUser = async (event : React.MouseEvent<HTMLButtonElement>): Promise<void> => {

        // get id and name
        const [userId, userName] = event.currentTarget.value.split('_');

        // warning user
        alert("Warning: " + userName);
        
        // fetch delete api
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL_API}/user/${userId}`, { method: "DELETE" });
        const deleteUser: User = await response.json();

        // fetch get api
        console.log(deleteUser);
        fetchData();
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
                        users.map((user, index) => 
                            <tr key={index}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.password}</td>
                                <td>
                                    <button onClick={deleteUser} value={user.id + '_' + user.name}>Delete</button>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </>
    );
}