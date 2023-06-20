import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { IUser, IUserCreate } from '../../../model/entity/IUser'

// Init Prisma connection
const prisma = new PrismaClient()

export async function GET() : Promise<NextResponse> {

    const user: IUser[] = await prisma.user.findMany();

    if (!user) {
        return NextResponse.json({ error: "GET User: have some error."}, { status: 400 });
    }

    return NextResponse.json(user, { status: 200 });
};

export async function POST() : Promise<NextResponse> {

    const newUserCreate: IUserCreate = {
        name : "new",
        password : "new"
    }

    const addedUser: IUser = await prisma.user.create({
        data: newUserCreate,
      })

    if (!addedUser) {
        return NextResponse.json({ error: "POST User: have some error."}, { status: 400 });
    }

    return NextResponse.json(addedUser, { status : 200 });
};