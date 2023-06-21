import { NextResponse } from 'next/server'
import { PrismaClient, User } from '@prisma/client'
import { ErrorModel } from '@/model/error_model';
import { GetLastVariableFromPath } from '@/extension/api_extension';

// Init Prisma connection
const prisma = new PrismaClient()

export async function GET(request: Request) : Promise<NextResponse> {

    // get User By Id
    const userId = GetLastVariableFromPath(request.url);

    // get user from database
    const user = await prisma.user.findFirst({
        where: {
            id: userId
        }
    });

    // check if not exist
    if (!user) {
        return NextResponse.json(<ErrorModel>{ isSuccess: false, message: "[Get User]: User not found." }, { status: 400 });
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