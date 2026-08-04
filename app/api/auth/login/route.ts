import { Role,} from './../../../types/index';
import { prisma } from '@/app/lib/db';
import { NextRequest, NextResponse } from "next/server";
import { generateToken, verifyPassword } from '@/app/lib/auth';

export async function POST(request: NextRequest){
    try {
        const {email, password} = await request.json()

        //validate require Field
        if(!email || !password){
            return NextResponse.json({
                error: "email & password are required or not valid"
            },
            {status: 400}
        )
        }

        //find exising
        const findUser = await prisma.user.findUnique({
            where: {email},
            include: {team: true}
        })
        if(!findUser){
            return NextResponse.json(
                {
                    error: "User not exist"
                },
                {status: 401}
            )
        }

        const matched = await verifyPassword(password, findUser.password)

        if(!matched){
            return NextResponse.json({
                msg: "Incorrect password"
            },
        {status: 400})
        }

        //generate Token
        const token = generateToken(findUser.id)
        const response = NextResponse.json({
            user: {
                msg: "Login Successfully",
                token
            }
        })

        //set cookie
        response.cookies.set("token",token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60*60*24*7,

        })
        return response;

    } catch (error) {
        console.error("Error while login")
        return NextResponse.json({
            error: "Internal Server Error"
        },
    {status: 500})
    }
}