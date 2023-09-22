import { DecryptString } from "@/extension/string_extension";
import { UserExtensionModel } from "@/model/subentityModel";
import { ResponseModel } from "@/model/responseModel";
import { PrismaClient, User } from "@prisma/client";
import { NextResponse } from "next/server";

// Init Prisma connection
// const prisma = new PrismaClient();

// get secret key from .env
const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY ?? "";

export async function POST(request: Request) : Promise<NextResponse> {

    // get body of request
    const userLoginFromBody: UserExtensionModel = await request.json();

    // fetch add user
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL_API}/user/${userLoginFromBody.name}`);

    // user not found
    if (!response.ok) {
        const errorMessage: ResponseModel = await response.json();
        return NextResponse.json(errorMessage, { status: 500 });
    }

    const user: User = await response.json();
    const decryptPassword = DecryptString(user.password, secretKey, user.IV_key);

    if (userLoginFromBody.password != decryptPassword) {
        return NextResponse.json(<ResponseModel> { isSuccess: false, message: "[Get Login]: Wrong password." }, { status: 400 });
    }

    return NextResponse.json(user, { status: 200 });
}