import { db } from "@/lib/db";
import { users, accounts, sessions, verificationTokens, authenticators } from "@/lib/db/schema";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { type DefaultSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
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
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
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
    role: string;
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
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
    authenticatorsTable: authenticators,
  }) as any,
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
          role: user.role,
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
          token.role = dbUser.role || "student";
          token.phone = dbUser.phone
          
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
        } else {
          // Fallback if user not found in DB yet
          token.id = user.id;
          token.role = user.role || "student";
        }
      }
      
      if (trigger === "update" && session) {
        token.name = session.name;
        token.email = session.email;
        if (session.phone) token.phone = session.phone;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.phone = token.phone;
        
        // Check if user needs to complete profile (no phone)
        if (!token.phone && session.user.email) {
          const [dbUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, session.user.email))
            .limit(1);
          
          if (dbUser && !dbUser.phone) {
            // User needs to add phone number
            session.user.needsProfileCompletion = true;
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
