import { NextResponse } from 'next/server'
import { PrismaClient, User } from '@prisma/client'
import { ResponseModel } from '@/model/responseModel';
import { EncryptString, DecryptString } from '@/extension/string_extension';
import { UserModelDecorator } from '@/extension/api_extension';

// Init Prisma connection
const prisma = new PrismaClient()

// get secret key from .env
const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY ?? "";

export async function GET() : Promise<NextResponse> {

    try 
    {
        // get user from database
        const user = await prisma.user.findMany();

        // decrypt password string
        // user.map(e => {
        //     e.password = DecryptString(e.password, secretKey, e.IV_key)
        // });

        return NextResponse.json(user, { status: 200 });
    }
    catch (error) 
    {
        return NextResponse.json(<ResponseModel> { 
            isSuccess: false, 
            message: "[GET User]: Get user fail. - " + error
        }, { status: 500 });
    }
};

export async function POST(request: Request) : Promise<NextResponse> {

    // get body of request
    const userCreateFromBody: User = await request.json();

    // decorated user (Clean data)
    const decoratedUser = UserModelDecorator(userCreateFromBody);

    const [ encryptPassword, IV_Key ] = EncryptString(decoratedUser.password, secretKey);
    decoratedUser.password = encryptPassword
    decoratedUser.IV_key = IV_Key

    // create user to database
    try 
    {
        const addedUser = await prisma.user.create({
            data: decoratedUser,
          })

        return NextResponse.json(addedUser, { status : 200 });
    }
    catch (error) 
    {
        return NextResponse.json(<ResponseModel> { 
            isSuccess: false, 
            message: "[POST User]: Create user fail. Maybe duplicate name - " + error
        }, { status: 400 });
    }
};

export async function PUT(request: Request) : Promise<NextResponse> {

    // get body of request
    const userUpdateFromBody: User = await request.json();

    // decorated user (Clean data)
    const decoratedUser = UserModelDecorator(userUpdateFromBody);

    // check if userName exist
    const countIfNameExist = await prisma.user.count({
        where: {
            name: decoratedUser.name
        }
    });

    if (countIfNameExist !== 0)
    {
        return NextResponse.json(<ResponseModel> { isSuccess: false, message: "[PUT User]: Duplicate userName." }, { status: 400 });
    }

    // encrypt password
    const [ encryptPassword, IV_Key ] = EncryptString(decoratedUser.password, secretKey);
    decoratedUser.password = encryptPassword
    decoratedUser.IV_key = IV_Key

    // update user in database
    try 
    {
        const updateUser = await prisma.user.update({
            where: {
                id: decoratedUser.id
            },
            data: decoratedUser
        });

        return NextResponse.json(updateUser, { status : 200 });
    }
    catch (error) 
    {
        return NextResponse.json(<ResponseModel> { 
            isSuccess: false, 
            message: "[PUT User]: Update user fail. Maybe duplicate name - " + error
        }, { status: 400 });
    }
};