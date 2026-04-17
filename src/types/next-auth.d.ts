import { DefaultSession } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      roles?: string[];
      permissions?: string[];
    };
  }

  interface User {
    roles?: string[];
    permissions?: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    roles?: string[];
    permissions?: string[];
  }
}