import { NextRequest, NextResponse } from "next/server";

const allowedOrigins = [
    "http://192.168.1.44:3000", 
    "http://192.168.1.36:3000",
    "http://localhost:3000"
]

export function middleware(request: NextRequest) {
   
//     const origin=request.headers.get("origin")
//     console.log(origin)

//     if(origin && !allowedOrigins.includes(origin))
//     {
//          // return early
//          return new NextResponse(null,{status:400,
//                                        statusText:"BadRequest",
//                                        headers:{'Content-Type':'text/plain'}})
//    }

    return NextResponse.next();

    // const origin = request.headers.get('origin') ?? '';

    // console.log(origin)

    // if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
    //     response.headers.set('Access-Control-Allow-Origin', origin);
    // }

    // return response;
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: "/api/:path*",
  };