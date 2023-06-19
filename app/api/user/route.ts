import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { IUserCreate } from '../../../model/entity/IUser'

// Init Prisma connection
const prisma = new PrismaClient()

export async function POST() : Promise<NextResponse> {

    const newUserCreate: IUserCreate = {
        name : "new",
        password : "new"
    }

    const addedUser = await prisma.user.create({
        data: newUserCreate,
      })

    return NextResponse.json(addedUser, { status : 200 });
};