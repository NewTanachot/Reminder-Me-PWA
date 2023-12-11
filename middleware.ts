import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {

    // in pipeline
    const origin = request.headers.get("origin");

    // service execute
    const response = NextResponse.next();
    
    // out pipeline
    response.headers.set('Access-Control-Allow-Origin', origin ?? '*');
    return response;
}

export const config = {
    matcher: '/:path*',
}