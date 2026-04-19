import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import PortalDashboard from "@/components/PortalDashboard";

export default async function HomePage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const systems: string[] = (user.publicMetadata?.systems as string[]) ?? [];
  const isAdmin = user.publicMetadata?.role === "admin";

  return (
    <PortalDashboard
      userName={user.firstName ?? user.emailAddresses[0].emailAddress}
      userEmail={user.emailAddresses[0].emailAddress}
      userImageUrl={user.imageUrl}
      allowedSystems={systems}
      isAdmin={isAdmin}
    />
  );
}
