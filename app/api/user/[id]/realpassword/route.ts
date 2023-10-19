import { GetSecondLastVariableFromPath } from '@/extension/api_extension';
import { DecryptString } from '@/extension/string_extension';
import { ResponseModel } from '@/model/responseModel';
import { NextResponse } from 'next/server';
import prisma from "@/prisma";

// get secret key from .env
const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY ?? "";

export async function GET(request: Request) : Promise<NextResponse> {

    // get User By Id
    const userData = GetSecondLastVariableFromPath(request.url);

    // get user from database
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { id: userData }, { name: userData }
            ]
        }
    });

    // check if not exist
    if (!user) {
        return NextResponse.json(<ResponseModel> { isSuccess: false, message: "[Get User]: User not found." }, { status: 400 });
    }

    user.password = DecryptString(user.password, secretKey, user.IV_key);

    return NextResponse.json(user, { status: 200 });
};