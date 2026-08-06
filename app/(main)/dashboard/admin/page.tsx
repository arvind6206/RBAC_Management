import AdminDashboard from "@/app/components/dashboard/AdminDashboard";
import { checkUserPermission, getCurrentUSer } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { transformTeams, transformUsers } from "@/app/lib/util";
import { Role } from "@/app/types";
import { redirect } from "next/navigation";

const AdminPage = async () => {
  const user = await getCurrentUSer();
  if (!user || !checkUserPermission(user, Role.ADMIN)) {
    redirect("/unauthorized");
  }

  //fetch data for admin dashboard
  const [prismaUser, prismaTeams] = await Promise.all([
    prisma.user.findMany({
      include: {
        team: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.team.findMany({
      include: {
        members: {
          select: {
            id: true,
            name: true,
            role: true,
            email: true,
          },
        },
      },
    }),
  ]);
  const users = transformUsers(prismaUser)
  const teams = transformTeams(prismaTeams)
  return (
    <AdminDashboard users={users} teams={teams} currentUser={user} />
  );
};

export default AdminPage;
