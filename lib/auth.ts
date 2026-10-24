import { db } from "@/lib/db";
import { users, accounts, sessions, verificationTokens, authenticators } from "@/lib/db/schema";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { type DefaultSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import type { Adapter } from "next-auth/adapters";
import { USER_ROLES, isOneOf, type UserRole } from "@/lib/domain";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      phone?: string | null;
      dateOfBirth?: string | null;
      gender?: string | null;
      caste?: string | null;
      subCaste?: string | null;
      address?: string | null;
      city?: string | null;
      state?: string | null;
      pincode?: string | null;
      guardianName?: string | null;
      guardianPhone?: string | null;
      collegeName?: string | null;
      course?: string | null;
      year?: string | null;
      needsProfileCompletion?: boolean;
      acceptedTermsAt?: string | null;
      acceptedPrivacyAt?: string | null;
      termsVersion?: string | null;
      createdAt?: string;
      lastLoginAt?: string | null;
      avatar?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
    phone?: string | null;
    dateOfBirth?: string | null;
    gender?: string | null;
    caste?: string | null;
    subCaste?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    pincode?: string | null;
    guardianName?: string | null;
    guardianPhone?: string | null;
    collegeName?: string | null;
    course?: string | null;
    year?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    phone?: string | null;
    dateOfBirth?: string | null;
    gender?: string | null;
    caste?: string | null;
    subCaste?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    pincode?: string | null;
    guardianName?: string | null;
    guardianPhone?: string | null;
    collegeName?: string | null;
    course?: string | null;
    year?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  // `@auth/drizzle-adapter` targets the Auth.js v5 adapter shape while this
  // project runs NextAuth v4. The method surface is compatible and the session
  // strategy is JWT, so the adapter is only exercised for OAuth account
  // linking; the cast documents the version mismatch without changing runtime
  // behaviour.
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
    authenticatorsTable: authenticators,
  }) as unknown as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string))
          .limit(1);

        if (!user || !user.passwordHash) {
          throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: isOneOf(USER_ROLES, user.role) ? user.role : "student",
          image: user.image,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, trigger, session, account }) {
      // On initial sign in
      if (user) {
        // Fetch the latest user data from database
        const [dbUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, user.email!))
          .limit(1);

        if (dbUser) {
          token.id = dbUser.id;
          token.role = isOneOf(USER_ROLES, dbUser.role) ? dbUser.role : "student";
          token.phone = dbUser.phone;
          token.avatar = dbUser.avatar;

          // Set default role for OAuth users if not set
          if (account?.provider === "google" && !dbUser.role) {
            await db
              .update(users)
              .set({
                role: "student",
                emailVerified: new Date(),
              })
              .where(eq(users.id, dbUser.id));
            token.role = "student";
          }

          // Record the sign-in. The session callback reads the row back, so the
          // account screen can show the exact date and time of the last login.
          await db
            .update(users)
            .set({ lastLoginAt: new Date() })
            .where(eq(users.id, dbUser.id));
        } else {
          // Fallback if user not found in DB yet
          token.id = user.id;
          token.role = user.role ?? "student";
        }
      }
      
      if (trigger === "update" && session) {
        token.name = session.name;
        token.email = session.email;
        if (session.phone) token.phone = session.phone;
        if (session.avatar !== undefined) token.avatar = session.avatar;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role;
        session.user.phone = token.phone;
        session.user.avatar = token.avatar as string | null;
        
        // Fetch additional user data
        if (session.user.email) {
          const [dbUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, session.user.email))
            .limit(1);
          
          if (dbUser) {
            session.user.createdAt = dbUser.createdAt?.toISOString();
            session.user.lastLoginAt = dbUser.lastLoginAt?.toISOString() ?? null;
            session.user.avatar = dbUser.avatar; // Always use latest from DB
            session.user.acceptedTermsAt = dbUser.acceptedTermsAt?.toISOString() ?? null;
            session.user.acceptedPrivacyAt = dbUser.acceptedPrivacyAt?.toISOString() ?? null;
            session.user.termsVersion = dbUser.termsVersion ?? null;

            // Profile fields, so the portal can show and gate on them without
            // an extra request per page.
            session.user.phone = dbUser.phone;
            session.user.dateOfBirth = dbUser.dateOfBirth;
            session.user.address = dbUser.address;
            session.user.city = dbUser.city;
            session.user.state = dbUser.state;
            session.user.pincode = dbUser.pincode;
            session.user.guardianName = dbUser.guardianName;
            session.user.guardianPhone = dbUser.guardianPhone;
            session.user.collegeName = dbUser.collegeName;
            session.user.course = dbUser.course;
            session.user.year = dbUser.year;

            // Check if user needs to complete profile (no phone)
            if (!dbUser.phone) {
              session.user.needsProfileCompletion = true;
            }
          }
        }
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Let the adapter create the user first for OAuth providers
      if (account?.provider === "google") {
        // OAuth sign-in is always allowed
        // We'll handle role and phone setup in the jwt/session callbacks
        return true;
      }
      
      // For credentials provider, user must exist and be verified
      if (account?.provider === "credentials") {
        return true;
      }
      
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Remove locale prefix from redirect URLs
      const parsedUrl = new URL(url, baseUrl);
      
      // Remove /en, /gu, or any other locale prefix from pathname
      const pathname = parsedUrl.pathname.replace(/^\/(en|gu)(\/|$)/, '$2');
      
      // If URL is relative or starts with baseUrl, ensure no locale prefix
      if (url.startsWith("/")) {
        return pathname;
      }
      
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}${pathname}${parsedUrl.search}`;
      }
      
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

// Helper function to get session on server side
export { getServerSession } from "next-auth/next";
