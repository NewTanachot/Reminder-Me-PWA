import { NextRequest, NextResponse } from 'next/server'
import { ResponseModel } from '@/model/responseModel';
import { IPlaceApiParam, IUpdateCardStatusApiRequest } from '@/model/requestModel';
import prisma from "@/prisma";

export async function GET(request: NextRequest, { params }: IPlaceApiParam) : Promise<NextResponse> {
    
    // get user from database
    const place = await prisma.place.findFirst({
        where: {
            id: params.id
        }
    });

    // check if not exist
    if (!place) {
        return NextResponse.json(<ResponseModel> { isSuccess: false, message: "[Get Place]: Place not found." }, { status: 400 });
    }

    return NextResponse.json(place, { status: 200 });
};

export async function PUT(request: NextRequest, { params }: IPlaceApiParam) : Promise<NextResponse> {

    // get body of request
    const placeStatus: IUpdateCardStatusApiRequest = await request.json();

    try {
        // delete place from database
        const updatePlace = await prisma.place.update({
            where: {
                id: params.id
            },
            data: {
                isDisable: placeStatus.isDisable
            }
        });

        return NextResponse.json(updatePlace, { status: 200 });
    }
    catch (error) {
        return NextResponse.json(<ResponseModel> { 
            isSuccess: false, 
            message: "[PUT Place]: Update place status fail. - " + error
        }, { status: 400 });
    }
}

export async function DELETE(request: Request, { params }: IPlaceApiParam) : Promise<NextResponse> {

    try {
        // delete place from database
        const deletePlace = await prisma.place.delete({
            where: {
                id: params.id
            }
        });

        return NextResponse.json(deletePlace, { status: 200 });
    }
    catch (error) {
        return NextResponse.json(<ResponseModel> { 
            isSuccess: false, 
            message: "[DELETE Place]: Delete place fail. - " + error
        }, { status: 400 });
    }
}