import { ErrorModel } from "@/model/error_model";
import { Place, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

// Init Prisma connection
const prisma = new PrismaClient();

export async function GET(): Promise<NextResponse> {

    // find place from database
    const place: Place[] = await prisma.place.findMany();

    // check if place is null
    if (!place) {
        return NextResponse.json(<ErrorModel>{ isSuccess: false, message: "[Get Place]: User not found." }, { status: 400 });
    }

    return NextResponse.json(place, { status: 200 });
}

export async function POST(request: Request): Promise<NextResponse> {

    // get body of request
    const placeCreate: Place = await request.json();

    // check if place name exist
    // const countIfNameExist = await prisma.user.count({
    //     where: {
    //         name: placeCreate.name
    //     }
    // });

    // if (countIfNameExist !== 0)
    // {
    //     return NextResponse.json(<ErrorModel>{ isSuccess: false, message: "[POST Place]: Duplicate place name." }, { status: 400 });
    // }

    // create user
    const newPlace: Place = await prisma.place.create({
        data: placeCreate
    });

    // check if exist
    if (!newPlace) {
        return NextResponse.json(<ErrorModel>{ isSuccess: false, message: "[POST Place]: Create place fail." }, { status: 400 });
    }

    return NextResponse.json(newPlace, { status: 200 });
}

export async function PUT(request: Request): Promise<NextResponse> {

    // get body of request
    const placeCreate: Place = await request.json();

    // check if place name exist
    // const countIfNameExist = await prisma.user.count({
    //     where: {
    //         name: placeCreate.name
    //     }
    // });

    // if (countIfNameExist !== 0)
    // {
    //     return NextResponse.json(<ErrorModel>{ isSuccess: false, message: "[POST Place]: Duplicate place name." }, { status: 400 });
    // }

    // update place to database
    const updatePlace = await prisma.place.update({
        where: {
            id: placeCreate.id
        },
        data: placeCreate
    });

    // check if update fail
    if (!updatePlace) {
        return NextResponse.json(<ErrorModel>{ isSuccess: false, message: "[PUT Place]: Update place fail" }, { status: 400 });
    }

    return NextResponse.json(updatePlace, { status: 200 });
}

export async function DELETE(request: Request) : Promise<NextResponse> {

    // get param from API URL
    const urlRequest = new URL(request.url);
    const userIdfromParam = urlRequest.searchParams.get("id");

    // check if param is null
    if (userIdfromParam == null) {
        return NextResponse.json(<ErrorModel>{ isSuccess: false, message: "[DELETE Place]: Require id param." }, { status: 400 });
    }
    
    // delete place from database
    const deleteUser = await prisma.place.delete({
        where: {
            id: userIdfromParam
        }
    });

    return NextResponse.json(deleteUser, { status: 200 });
}