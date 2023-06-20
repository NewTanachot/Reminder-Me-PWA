import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { IPlace, IPlaceCreate } from "../../../model/entity/IPlace";

// Init Prisma connection
const prisma = new PrismaClient();

export async function GET(): Promise<NextResponse> {

    const place: IPlace[] = await prisma.place.findMany();

    if (!place) {
        return NextResponse.json({ error: "GET Place: have some error."}, { status: 400 });
    }

    return NextResponse.json(place, { status: 200 });
}

export async function POST(request: Request): Promise<NextResponse> {

    const res: IPlaceCreate = await request.json();
    const newPlace: IPlace = await prisma.place.create({
        data: res
    });

    if (!newPlace) {
        return NextResponse.json({ error: "POST Place: have some error."}, { status: 400 });
    }

    return NextResponse.json(newPlace, { status: 200 });
}