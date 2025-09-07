import { NextAuthOptions } from "next-auth"; //type that defines the settings for NextAuth
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "../../../../models/user";
import { connectDatabase } from "../../../../lib/mongodb";
import UserRole from "../../../../models/userRole";
import RolePermission from "../../../../models/rolePermission";
import Role from "../../../../models/role";
import Permission from "../../../../models/permission";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }
        const { email, password } = credentials;
        try {
          await connectDatabase();

          const user = await User.findOne({ email });
          if (!user) {
            throw new Error("Invalid Email");
          }

          // Comparing password with hashed password
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            throw new Error("Invalid Password");
          }
          return {
            id: user._id.toString(),
            _id: user._id.toString(),
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("Error:", error);

          if (error instanceof Error && error.message) {
            throw new Error(error.message);
          }
          throw new Error("Login Failed");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Geting user's roles
        const userRoles = await UserRole.find({ userId: user.id }).populate({
          path: "roleId",
          model: Role,
        });
        // console.log("userRoles", userRoles);

        // Collecting role slug
        const roles = userRoles.map((ur) => ur.roleId.slug);

        const roleIds = userRoles.map((ur) => ur.roleId._id);

        // Collecting Permissions for each role
        const rolePermissions = await RolePermission.find({
          roleId: { $in: roleIds },
        }).populate({
          path: "permissionId",
          model: Permission,
        });
        // console.log("rolePermissions", rolePermissions);

        // Getting unique permissions
        const permissions = [
          ...new Set(rolePermissions.map((rp) => rp.permissionId.slug)),
        ];

        // Attaching roles and permissions to token
        token.roles = roles;
        token.permissions = permissions;
      }
      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        // console.log(session?.user?.email);
        // console.log("session", session);
      }
      session.user.roles = token.roles;
      session.user.permissions = token.permissions;
      // console.log("Current User Roles", session.user.roles);
      // console.log("Current User permissions", session.user.permissions);

      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 1 * 1 * 60 * 60, // 5 minute session expiry time
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions); //creating API handler for authentication

export { handler as GET, handler as POST };
