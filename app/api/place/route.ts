import { PlaceModelDecorator, PlaceModelCreateValidator, PlaceModelUpdateValidator } from "@/extension/api_extension";
import { ResponseModel } from "@/model/responseModel";
import { Place } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";
import { IsStringValid } from "@/extension/string_extension";

const GetPlace = async () => {
    return await prisma.place.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });
}

const GetPlaceByUserId = async (userId: string) => {
    return await prisma.place.findMany({
        where: {
            userId: userId
        },
        orderBy: {
            createdAt: "desc"
        }
    });
}

export async function GET(request: NextRequest): Promise<NextResponse> {

    // get body of request
    const userIdParam = request.nextUrl.searchParams.get("userId");
    let place: Place[];

    try 
    {
        // check param is exist or not 
        if (IsStringValid(userIdParam)) 
        {
            // find place from database
            place = await GetPlaceByUserId(userIdParam as string);
        }
        else
        {
            // find place from database
            place = await GetPlace();
        }

        return NextResponse.json(place, { status: 200 });
    }
    catch (error) 
    {
        return NextResponse.json(<ResponseModel> { 
            isSuccess: false, 
            message: "[GET Place]: Get place fail. - " + error
        }, { status: 500 });
    }
}

export async function POST(request: NextRequest): Promise<NextResponse> {

    // get body of request
    const placeCreate: Place = await request.json();
    const allUserPlace = await GetPlaceByUserId(placeCreate.userId);

    // validation request model
    const validateResult = PlaceModelCreateValidator(placeCreate, allUserPlace);

    if (!validateResult.isValid) {
        return NextResponse.json(<ResponseModel> { 
            isSuccess: false, 
            message: `[POST Place]: ${validateResult.message ?? "Invalid request"}.`
        }, { status: 400 });
    }

    const decoratedPlaceCreate = PlaceModelDecorator(placeCreate);

    // create user
    try 
    {
        const newPlace: Place = await prisma.place.create({
            data: decoratedPlaceCreate
        });

        return NextResponse.json(newPlace, { status: 200 });
    }
    catch (error)
    {
        return NextResponse.json(<ResponseModel> { 
            isSuccess: false, 
            message: "[POST Place]: Create place fail. - " + error 
        }, { status: 500 });
    }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {

    // get body of request
    const placeUpdate: Place = await request.json();
    const allUserPlace = await GetPlaceByUserId(placeUpdate.userId);

    // validation request model
    const validateResult = PlaceModelUpdateValidator(placeUpdate, allUserPlace);

    if (!validateResult.isValid) {
        return NextResponse.json(<ResponseModel> { 
            isSuccess: false, 
            message: `[PUT Place]: ${validateResult.message ?? "Invalid request"}.`
        }, { status: 400 });
    }

    const decoratedPlaceUpdate = PlaceModelDecorator(placeUpdate);

    // update place to database
    try 
    {
        const updatePlace = await prisma.place.update({
            where: {
                id: decoratedPlaceUpdate.id,
            },
            data: decoratedPlaceUpdate
        });

        return NextResponse.json(updatePlace, { status: 200 });
    }
    catch (error)
    {
        return NextResponse.json(<ResponseModel> { 
            isSuccess: false, 
            message: "[PUT Place]: Update place fail. - " + error
        }, { status: 500 });
    }
}