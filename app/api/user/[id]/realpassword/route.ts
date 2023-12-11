import { DecryptString } from '@/extension/string_extension';
import { ResponseModel } from '@/model/responseModel';
import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/prisma";
import { IUserApiParam } from '@/model/requestModel';

// get secret key from .env
const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY ?? "";

export async function GET(request: NextRequest, { params }: IUserApiParam) : Promise<NextResponse> {

    // get user from database [ params.id is UserID or UserName ]
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { id: params.id }, 
                { name: params.id }
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