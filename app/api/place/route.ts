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

import Cors from 'cors';
import initMiddleware from '@/extension/test';

// Initialize the cors middleware
const cors = initMiddleware(
  Cors({
    origin: 'http://localhost:3000', // replace with the actual origin of your Next.js web application
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

export async function GET(request: Request, Response: Response): Promise<NextResponse> {

    await cors(request, Response);
    const origin = request.headers.get('origin');

    // get body of request
    const userIdParam = new URL(request.url).searchParams.get("userId");
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

        // return NextResponse.json(place, { status: 200 });
        return new NextResponse(JSON.stringify(place), {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': origin ?? "*"
            }
        })
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

export async function PUT(request: Request): Promise<NextResponse> {

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

export const OPTIONS = async (request: NextRequest) => {
    // Return Response
    return NextResponse.json(
      {},
      {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"  
        },
      }
    );
  };