import Link from "next/link";

export default function Register() {
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
                <Link href="">register</Link>
                &nbsp;
                <Link href="/auth/user">manage user</Link>
            </div>
        </div>
    );
}