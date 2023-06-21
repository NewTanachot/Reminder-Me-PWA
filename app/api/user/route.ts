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
    try 
    {
        const addedUser: User = await prisma.user.create({
            data: userCreateFromBody,
          })

        return NextResponse.json(addedUser, { status : 200 });
    }
    catch (error) 
    {
        return NextResponse.json(<ErrorModel>{ 
            isSuccess: false, 
            message: "[POST User]: Create user fail. Maybe duplicate name ======== " + error
        }, { status: 400 });
    }
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
        return NextResponse.json(<ErrorModel>{ isSuccess: false, message: "[PUT User]: Duplicate userName." }, { status: 400 });
    }

    // update user in database
    try 
    {
        const updateUser = await prisma.user.update({
            where: {
                id: userCreateFromBody.id
            },
            data: userCreateFromBody
        });

        return NextResponse.json(updateUser, { status : 200 });
    }
    catch (error) 
    {
        return NextResponse.json(<ErrorModel>{ 
            isSuccess: false, 
            message: "[PUT User]: Update user fail. Maybe duplicate name ======== " + error
        }, { status: 400 });
    }
};