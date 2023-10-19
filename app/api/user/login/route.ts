import { DecryptString } from "@/extension/string_extension";
import { ResponseModel } from "@/model/responseModel";
import { User } from "@prisma/client";
import { NextResponse } from "next/server";
import { UserModelDecorator } from "@/extension/api_extension";

// get secret key from .env
const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY ?? "";

export async function POST(request: Request) : Promise<NextResponse> {

    // get body of request
    const userLoginFromBody: User = await request.json();

    // decorated user (Clean data)
    const decoratedUser = UserModelDecorator(userLoginFromBody);

    // fetch add user
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL_API}/user/${decoratedUser.name}`);

    // user not found
    if (!response.ok) {
        const errorMessage: ResponseModel = await response.json();
        return NextResponse.json(errorMessage, { status: 500 });
    }

    const user: User = await response.json();
    const decryptPassword = DecryptString(user.password, secretKey, user.IV_key);

    if (decoratedUser.password != decryptPassword) {
        return NextResponse.json(<ResponseModel> { isSuccess: false, message: "[Get Login]: Wrong password." }, { status: 400 });
    }

    return NextResponse.json(user, { status: 200 });
}