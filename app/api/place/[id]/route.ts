import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { ResponseModel } from '@/model/response_model';
import { GetLastVariableFromPath } from '@/extension/api_extension';

// Init Prisma connection
const prisma = new PrismaClient()

export async function GET(request: Request) : Promise<NextResponse> {

    // get place By Id
    const placeId = GetLastVariableFromPath(request.url);

    // get user from database
    const place = await prisma.place.findFirst({
        where: {
            id: placeId
        }
    });

    // check if not exist
    if (!place) {
        return NextResponse.json(<ResponseModel> { isSuccess: false, message: "[Get Place]: Place not found." }, { status: 400 });
    }

    return NextResponse.json(place, { status: 200 });
};

export async function DELETE(request: Request) : Promise<NextResponse> {

    // get place By Id
    const placeId = GetLastVariableFromPath(request.url);

    // delete place from database
    const deleteUser = await prisma.place.delete({
        where: {
            id: placeId
        }
    });

    return NextResponse.json(deleteUser, { status: 200 });
}