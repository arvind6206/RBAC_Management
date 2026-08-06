import { checkUserPermission, getCurrentUSer } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@/app/types";
import { redirect } from "next/navigation";

const UserPage = async () => {
  const user = await getCurrentUSer();
  if (!user) {
    redirect("/login");
  }

  //fetch user specific data
  const teamMembers = user.teamId ?
    prisma.user.findMany({
        where: {
            teamId: user.teamId,
        },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      },
    
    }) : [];
  
  return (
    <UserDashboard teamMembers={teamMembers} currentUser={user} />
  );
};

export default UserPage;
