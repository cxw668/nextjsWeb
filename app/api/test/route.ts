import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest){
  console.log('---->')
  const response = new NextResponse("Hello World!")
  response.headers.set(
    'Cache-Control', 
    'public, max-age=31536000, immutable'
  )

  return response
}