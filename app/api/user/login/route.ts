import { DecryptString } from "@/extension/string_extension";
import { ResponseModel } from "@/model/responseModel";
import { User } from "@prisma/client";
import { NextResponse } from "next/server";
import { UserModelDecorator } from "@/extension/api_extension";
import { GetUserByUserData } from "../route";

// get secret key from .env
const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY ?? "";

export async function POST(request: Request) : Promise<NextResponse> {

    // get body of request
    const userLoginFromBody: User = await request.json();

    // decorated user (Clean data)
    const decoratedUser = UserModelDecorator(userLoginFromBody);

    // get user 
    const user = await GetUserByUserData(decoratedUser.name);

    // check user not found
    if (!user) {
        return NextResponse.json(<ResponseModel> { isSuccess: false, message: "[Get User]: User not found." }, { status: 400 });
    }

    // decrypt user password
    const decryptPassword = DecryptString(user.password, secretKey, user.IV_key);

    // check user password
    if (decoratedUser.password != decryptPassword) {
        return NextResponse.json(<ResponseModel> { isSuccess: false, message: "[Get Login]: Wrong password." }, { status: 400 });
    }

    return NextResponse.json(user, { status: 200 });
}