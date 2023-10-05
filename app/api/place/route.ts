import { PlaceModelDecorator, PlaceModelValidator } from "@/extension/api_extension";
import { ResponseModel } from "@/model/responseModel";
import { Place, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

// Init Prisma connection
const prisma = new PrismaClient();

export async function GET(request: Request): Promise<NextResponse> {

    // get body of request
    const userIdParam = new URL(request.url).searchParams.get("userId");
    let place: Place | Place[] | null;

    try 
    {
        // check param is exist or not 
        if (userIdParam && userIdParam != "" && userIdParam != " ") 
        {
            // find place from database
            place = await prisma.place.findMany({
                where: {
                    userId: userIdParam
                },
                orderBy: {
                    createdAt: "desc"
                }
            });
        }
        else
        {
            // find place from database
            place = await prisma.place.findMany({
                orderBy: {
                    createdAt: "desc"
                }
            });
        }

        return NextResponse.json(place == null ? <Place>{} : place, { status: 200 });
    }
    catch (error) 
    {
        return NextResponse.json(<ResponseModel> { 
            isSuccess: false, 
            message: "[GET Place]: Get place fail. - " + error
        }, { status: 500 });
    }
}

export async function POST(request: Request): Promise<NextResponse> {

    // get body of request
    const placeCreate: Place = await request.json();

    // validation request model
    const isValid = PlaceModelValidator(placeCreate);

    if (!isValid) {
        return NextResponse.json(<ResponseModel> { 
            isSuccess: false, 
            message: "[POST Place]: Invalid request."
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
            message: "[POST Place]: Create place fail. Maybe duplicate name - " + error 
        }, { status: 400 });
    }
}

export async function PUT(request: Request): Promise<NextResponse> {

    // get body of request
    const placeUpdate: Place = await request.json();

    // validation request model
    const isValid = PlaceModelValidator(placeUpdate);

    if (!isValid) {
        return NextResponse.json(<ResponseModel> { 
            isSuccess: false, 
            message: "[PUT Place]: Invalid request."
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
        }, { status: 400 });
    }
}