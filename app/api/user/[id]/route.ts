import { NextResponse } from 'next/server'
import { ResponseModel } from '@/model/responseModel';
import { GetLastVariableFromPath } from '@/extension/api_extension';
import prisma from "@/prisma";
import { GetUserByUserData } from '../route';

export async function GET(request: Request) : Promise<NextResponse> {

    // get User By Id
    const userData = GetLastVariableFromPath(request.url);

    // get user from database
    const user = await GetUserByUserData(userData);

    // check if not exist
    if (!user) {
        return NextResponse.json(<ResponseModel> { isSuccess: false, message: "[Get User]: User not found." }, { status: 400 });
    }

    return NextResponse.json(user, { status: 200 });
};

export async function DELETE(request: Request) : Promise<NextResponse> {

    // get User By Id
    const userId = GetLastVariableFromPath(request.url);

    // delete user
    const deletedUser = await prisma.user.delete({
        where: {
            id: userId
        }
    })

    return NextResponse.json(deletedUser, { status: 200 });
}