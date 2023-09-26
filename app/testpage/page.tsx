import Link from "next/link";

export default function Test() {
    return (
        <div className="h1 text-success">
            <div>
                This is Test page 
            </div>
            <Link href="/" className="text-success h1">Back</Link>
        </div>
    )
}