import { NextResponse } from 'next/server'
import { PrismaClient, User } from '@prisma/client'
import { ErrorModel } from '@/model/error_model';
import { encryptString, decryptString } from '@/extension/string_extension';

// Init Prisma connection
const prisma = new PrismaClient()

export async function GET() : Promise<NextResponse> {

    try 
    {
        // get user from database
        const user = await prisma.user.findMany();

        return NextResponse.json(user, { status: 200 });
    }
    catch (error) 
    {
        return NextResponse.json(<ErrorModel> { 
            isSuccess: false, 
            message: "[GET User]: Get user fail. ======== " + error
        }, { status: 500 });
    }
};

export async function POST(request: Request) : Promise<NextResponse> {

    // get body of request
    const userCreateFromBody: User = await request.json();

    // encrypt password
    userCreateFromBody.password = encryptString(userCreateFromBody.password, process.env.NEXT_PUBLIC_SECRET_KEY ?? "");

    console.log(userCreateFromBody.name)
    console.log(userCreateFromBody.password)

    // create user to database
    try 
    {
        const addedUser = await prisma.user.create({
            data: userCreateFromBody,
          })

        return NextResponse.json(addedUser, { status : 200 });
    }
    catch (error) 
    {
        return NextResponse.json(<ErrorModel> { 
            isSuccess: false, 
            message: "[POST User]: Create user fail. Maybe duplicate name ======== " + error
        }, { status: 400 });
    }
};

export async function PUT(request: Request) : Promise<NextResponse> {

    // get body of request
    const userUpdateFromBody: User = await request.json();

    // check if userName exist
    const countIfNameExist = await prisma.user.count({
        where: {
            name: userUpdateFromBody.name
        }
    });

    if (countIfNameExist !== 0)
    {
        return NextResponse.json(<ErrorModel> { isSuccess: false, message: "[PUT User]: Duplicate userName." }, { status: 400 });
    }

    // encrypt password
    userUpdateFromBody.password = encryptString(userUpdateFromBody.password, process.env.NEXT_PUBLIC_SECRET_KEY ?? "");

    // update user in database
    try 
    {
        const updateUser = await prisma.user.update({
            where: {
                id: userUpdateFromBody.id
            },
            data: userUpdateFromBody
        });

        return NextResponse.json(updateUser, { status : 200 });
    }
    catch (error) 
    {
        return NextResponse.json(<ErrorModel> { 
            isSuccess: false, 
            message: "[PUT User]: Update user fail. Maybe duplicate name ======== " + error
        }, { status: 400 });
    }
};