import { User } from "@prisma/client";

export default async function User() {

    const response = await fetch(`${process.env.BASEURL_API}user`);
    const users: User[] = await response.json();

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>UserId</th>
                        <th>UserName</th>
                        <th>Password</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map((user, index) => 
                            <tr key={index}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.password}</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </>
    );
}