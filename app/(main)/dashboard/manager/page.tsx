import { checkUserPermission, getCurrentUSer } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@/app/types";
import { redirect } from "next/navigation";

const ManagerPage = async () => {
  const user = await getCurrentUSer();
  if (!user || !checkUserPermission(user, Role.ADMIN)) {
    redirect("/unauthorized");
  }

  //fetch manager's own team member
  const prismaMyTeamMembers = user.teamId ?
    prisma.user.findMany({
        
    }, {
      include: {
        team: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }) : ()
  
  return (
    <AdminDashboard users={prismaUser} teams={prismaTeams} currentUser={user} />
  );
};

export default ManagerPage;
