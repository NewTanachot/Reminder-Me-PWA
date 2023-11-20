import { NextResponse } from 'next/server';
import { ResponseModel } from '@/model/responseModel';
import { EncryptString, DecryptString } from '@/extension/string_extension';
import { UserModelCreateValidator, UserModelDecorator, UserModelUpdateValidator } from '@/extension/api_extension';
import { User } from '@prisma/client';
import prisma from "@/prisma";

// get secret key from .env
const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY ?? "";

const GetAllUsers = async () => {
    return await prisma.user.findMany();
}

export const GetUserByUserData = async (userData: string) => {
    return await prisma.user.findFirst({
        where: {
            OR: [
                { id: userData }, { name: userData }
            ]
        }
    });
}

export async function GET() : Promise<NextResponse> {

    try 
    {
        // get user from database
        const user = await GetAllUsers();

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
    const allUsers = await GetAllUsers();

    // decorated user (Clean data)
    const decoratedUser = UserModelDecorator(userCreateFromBody);

    // validate user request
    const validateResult = UserModelCreateValidator(decoratedUser, allUsers);

    if (!validateResult.isValid) {
        return NextResponse.json(<ResponseModel> { 
            isSuccess: false, 
            message: `[POST User]: ${validateResult.message ?? "Invalid input"}.`
        }, { status: 400 });
    }

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
            message: "[POST User]: Create user fail. - " + error
        }, { status: 500 });
    }
};

export async function PUT(request: Request) : Promise<NextResponse> {

    // get body of request
    const userUpdateFromBody: User = await request.json();
    const allUsers = await GetAllUsers();

    // decorated user (Clean data)
    const decoratedUser = UserModelDecorator(userUpdateFromBody);

    // validate user request
    const validateResult = UserModelUpdateValidator(decoratedUser, allUsers);

    if (!validateResult.isValid) {
        return NextResponse.json(<ResponseModel> { 
            isSuccess: false, 
            message: `[PUT User]: ${validateResult.message ?? "Invalid input"}.`
        }, { status: 400 });
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
            message: "[PUT User]: Update user fail. - " + error
        }, { status: 500 });
    }
};