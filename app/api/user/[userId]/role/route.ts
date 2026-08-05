import { checkUserPermission, getCurrentUSer } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await context.params;

    // Get currently logged-in user
    const currentUser = await getCurrentUSer();

    // Only admin can change roles
    if (!currentUser || !checkUserPermission(currentUser, Role.ADMIN)) {
      return NextResponse.json(
        {
          error: "You are not authorized to assign the role",
        },
        { status: 401 },
      );
    }

    // Admin cannot change their own role
    if (userId === currentUser.id) {
      return NextResponse.json(
        {
          error: "You cannot change your own role",
        },
        { status: 403 },
      );
    }

    // Get new role from request body
    const { role } = await request.json();

    // Only USER and MANAGER roles can be assigned
    const validRoles = [Role.USER, Role.MANAGER];

    if (!validRoles.includes(role)) {
      return NextResponse.json(
        {
          error: "Invalid role. Role must be USER or MANAGER",
        },
        { status: 400 },
      );
    }

    // Update user's role
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role,
      },
      include: {
        team: true,
      },
    });

    return NextResponse.json({
      user: updatedUser,
      message: `User role updated to ${role} successfully`,
    });
  } catch (error) {
    console.error("Role assignment error:", error);

    if (error instanceof Error && error.message.includes("Record not found")) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
