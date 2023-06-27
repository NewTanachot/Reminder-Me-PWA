'use client';

import { User } from "@prisma/client";
import { useEffect, useState } from "react";

export default function User() {

    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchData = async () => {

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL_API}/user`);
            const users: User[] = await response.json();

            console.log(users);
            setUsers(users);
        }

        fetchData();
    }, []);

    const deleteUser = (event : React.MouseEvent<HTMLButtonElement>) => {
        alert("alert: " + event.currentTarget.value);
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
                                    <button onClick={deleteUser} value={user.id}>Delete</button>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </>
    );
}