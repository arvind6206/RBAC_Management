import { getCurrentUSer } from "@/app/lib/auth";
import { Role } from '@/app/types';
import { Prisma } from '@prisma/client/extension';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/app/lib/db';

export async function GET(request: NextRequest){
    try {
        const user = await getCurrentUSer()
        if(!user){
            return NextResponse.json({
                error: "You are not authorized to access user information",
            },
        {status: 401})
        }

        const searchParams = request.nextUrl.searchParams;
        const role = searchParams.get("role") as Role
        const teamId = searchParams.get("teamId")

        //build where clause based on user role
        const where: Prisma.UserWhereInput = {}
        if(user.role === Role.ADMIN){
            //admin can see all users
        } else if(user.role === Role.MANAGER){
            //Manager can see users in their team or cross team user but not cross team Manager
            where.OR=[{teamId: user.teamId}, {role: Role.USER}]
        } else {
            //regular users can only see in their team
            where.teamId = user.teamId
            where.role = {not: Role.ADMIN}
        }

        //aditional filter
        if(teamId){
            where.teamId = teamId
        }

        if(role){
            where.role = role
        }

        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                team: {
                    select: {
                        id: true,
                        name: true
                    },
                },
                createdAt: true
            },
            orderBy: {createdAt: "desc"},
        })
        return NextResponse.json({
            users
        })
    } catch (error) {
        console.error("Get users error", error)
        return NextResponse.json({
            error: "Internal Server Error"
        }, {status: 500})
    }
}