import { NextResponse } from 'next/server'
import { PrismaClient, User } from '@prisma/client'
import { ErrorModel } from '@/model/error_model';

// Init Prisma connection
const prisma = new PrismaClient()

export async function GET() : Promise<NextResponse> {

    // get user from database
    const user: User[] = await prisma.user.findMany();

    // check if not exist
    if (!user) {
        return NextResponse.json(<ErrorModel>{ isSuccess: false, message: "[Get User]: User not found." }, { status: 400 });
    }

    return NextResponse.json(user, { status: 200 });
};

export async function POST(request: Request) : Promise<NextResponse> {

    // get body of request
    const userCreateFromBody: User = await request.json();

    // create user to database
    const addedUser: User = await prisma.user.create({
        data: userCreateFromBody,
      })

    // check if create fail
    if (!addedUser) {
        return NextResponse.json(<ErrorModel>{ isSuccess: false, message: "[POST User]: Create user fail." }, { status: 400 });
    }

    return NextResponse.json(addedUser, { status : 200 });
};

export async function PUT(request: Request) : Promise<NextResponse> {

    // get body of request
    const userCreateFromBody: User = await request.json();

    // check if userName exist
    const countIfNameExist = await prisma.user.count({
        where: {
            name: userCreateFromBody.name
        }
    });

    if (countIfNameExist !== 0)
    {
        return NextResponse.json(<ErrorModel>{ isSuccess: false, message: "[POST User]: Duplicate userName." }, { status: 400 });
    }

    // update user in database
    const updateUser = await prisma.user.update({
        where: {
            id: userCreateFromBody.id
        },
        data: userCreateFromBody
    });

    // check if update fail
    if (!updateUser) {
        return NextResponse.json(<ErrorModel>{ isSuccess: false, message: "[PUT User]: Update user fail" }, { status: 400 });
    }

    return NextResponse.json(updateUser, { status : 200 });
};

export async function DELETE(request: Request) : Promise<NextResponse> {

    // get param from API URL
    const urlRequest = new URL(request.url);
    const userIdfromParam = urlRequest.searchParams.get("id");

    // check if param is null
    if (userIdfromParam == null) {
        return NextResponse.json(<ErrorModel>{ isSuccess: false, message: "[DELETE User]: Require id param." }, { status: 400 });
    }

    // delete user
    const deletedUser = await prisma.user.delete({
        where: {
            id: userIdfromParam
        }
    })

    return NextResponse.json(deletedUser, { status: 200 });
}