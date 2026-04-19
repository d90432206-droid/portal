import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user || user.publicMetadata?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { userId, systems, role } = await req.json();

  const clerk = await clerkClient();
  await clerk.users.updateUserMetadata(userId, {
    publicMetadata: { systems, role: role ?? "user" },
  });

  return NextResponse.json({ ok: true });
}

export async function GET() {
  const user = await currentUser();
  if (!user || user.publicMetadata?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const clerk = await clerkClient();
  const { data: users } = await clerk.users.getUserList({ limit: 100 });

  const result = users.map((u) => ({
    id: u.id,
    email: u.emailAddresses[0]?.emailAddress ?? "",
    firstName: u.firstName,
    lastName: u.lastName,
    imageUrl: u.imageUrl,
    systems: (u.publicMetadata?.systems as string[]) ?? [],
    role: (u.publicMetadata?.role as string) ?? "user",
  }));

  return NextResponse.json(result);
}
