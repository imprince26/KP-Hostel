import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, admissionApplications } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as { role?: string }).role;
    if (userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    // Fetch all users with profile data
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        emailVerified: users.emailVerified,
        image: users.image,
        avatar: users.avatar,
        role: users.role,
        phone: users.phone,
        bio: users.bio,
        dateOfBirth: users.dateOfBirth,
        address: users.address,
        city: users.city,
        state: users.state,
        pincode: users.pincode,
        guardianName: users.guardianName,
        guardianPhone: users.guardianPhone,
        collegeName: users.collegeName,
        course: users.course,
        year: users.year,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt));

    // Fetch corresponding admission applications to link hostel residency and academic profile info
    const applications = await db
      .select({
        id: admissionApplications.id,
        userId: admissionApplications.userId,
        email: admissionApplications.email,
        applicationNumber: admissionApplications.applicationNumber,
        status: admissionApplications.status,
        assignedBlock: admissionApplications.assignedBlock,
        roomNumber: admissionApplications.roomNumber,
        collegeName: admissionApplications.collegeName,
        course: admissionApplications.course,
        year: admissionApplications.year,
        phone: admissionApplications.phone,
        guardianName: admissionApplications.guardianName,
        guardianPhone: admissionApplications.guardianPhone,
        address: admissionApplications.address,
        city: admissionApplications.city,
        state: admissionApplications.state,
        pincode: admissionApplications.pincode,
        dateOfBirth: admissionApplications.dateOfBirth,
        createdAt: admissionApplications.createdAt,
      })
      .from(admissionApplications)
      .orderBy(desc(admissionApplications.createdAt));

    // Map by both userId and email for reliable linking
    const appMapByUserId = new Map<string, typeof applications[0]>();
    const appMapByEmail = new Map<string, typeof applications[0]>();

    for (const app of applications) {
      if (app.userId && !appMapByUserId.has(app.userId)) {
        appMapByUserId.set(app.userId, app);
      }
      if (app.email) {
        const lowerEmail = app.email.trim().toLowerCase();
        if (!appMapByEmail.has(lowerEmail)) {
          appMapByEmail.set(lowerEmail, app);
        }
      }
    }

    const enrichedUsers = allUsers.map((u) => {
      const userEmailKey = u.email ? u.email.trim().toLowerCase() : "";
      const app = appMapByUserId.get(u.id) || (userEmailKey ? appMapByEmail.get(userEmailKey) : null) || null;

      return {
        ...u,
        // Fallback to application data if user profile fields are empty
        collegeName: u.collegeName || app?.collegeName || null,
        course: u.course || app?.course || null,
        year: u.year || app?.year || null,
        phone: u.phone || app?.phone || null,
        guardianName: u.guardianName || app?.guardianName || null,
        guardianPhone: u.guardianPhone || app?.guardianPhone || null,
        address: u.address || app?.address || null,
        city: u.city || app?.city || null,
        state: u.state || app?.state || null,
        pincode: u.pincode || app?.pincode || null,
        dateOfBirth: u.dateOfBirth || app?.dateOfBirth || null,
        application: app
          ? {
              id: app.id,
              applicationNumber: app.applicationNumber,
              status: app.status,
              assignedBlock: app.assignedBlock,
              roomNumber: app.roomNumber,
              createdAt: app.createdAt,
            }
          : null,
        isResident: app ? ["admitted", "active"].includes(app.status) : false,
      };
    });

    const stats = {
      total: allUsers.length,
      students: allUsers.filter((u) => u.role === "student").length,
      admins: allUsers.filter((u) => u.role === "admin").length,
      verified: allUsers.filter((u) => !!u.emailVerified).length,
      residents: enrichedUsers.filter((u) => u.isResident).length,
    };

    return NextResponse.json({
      users: enrichedUsers,
      stats,
    });
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
