import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-static"
export function GET(request:NextRequest){
  console.log(1111)
  return NextResponse.json({
    message: "hello static"
  })
}