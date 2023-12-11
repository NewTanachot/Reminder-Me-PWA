import { NextRequest, NextResponse } from 'next/server'
import { ResponseModel } from '@/model/responseModel';
import prisma from "@/prisma";
import { GetUserByUserData } from '../route';
import { IUserApiParam } from '@/model/requestModel';

export async function GET(request: NextRequest, { params }: IUserApiParam) : Promise<NextResponse> {

    // get user from database
    const user = await GetUserByUserData(params.id);

    // check if not exist
    if (!user) {
        return NextResponse.json(<ResponseModel> { isSuccess: false, message: "[Get User]: User not found." }, { status: 400 });
    }

    return NextResponse.json(user, { status: 200 });
};

export async function DELETE(request: NextRequest, { params }: IUserApiParam) : Promise<NextResponse> {

    // delete user
    const deletedUser = await prisma.user.delete({
        where: {
            id: params.id
        }
    })

    return NextResponse.json(deletedUser, { status: 200 });
}