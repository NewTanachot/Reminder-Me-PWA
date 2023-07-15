import { NextResponse } from 'next/server'
import { execSync } from 'child_process';

export async function GET() : Promise<NextResponse> {

    try {

        const result = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
        return NextResponse.json(result, { status: 200 });
    } 
    catch (error) {

        return NextResponse.json(null, { status: 200 });
    }
}