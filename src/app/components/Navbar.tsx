"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  // console.log("roles", session?.user?.roles);

  return (
    <>
      <div className="flex items-center gap-5 px-3 py-2 bg-gray-300">
        {session?.user?.roles?.includes("admin") && (
          <Link
            href={"/users"}
            className={`text-blue-700 text-lg hover:text-blue-900 ${
              pathname == "/users" ? "underline" : ""
            }`}
          >
            Users
          </Link>
        )}

        {session?.user?.permissions?.includes("post-read") && (
          <Link
            href={"/posts"}
            className={`text-blue-700 text-lg hover:text-blue-900 ${
              pathname == "/posts" ? "underline" : ""
            }`}
          >
            Posts
          </Link>
        )}

        {session?.user?.permissions?.includes("event-read") && (
          <Link
            href={"/events"}
            className={`text-blue-700 text-lg hover:text-blue-900 ${
              pathname == "/events" ? "underline" : ""
            }`}
          >
            Events
          </Link>
        )}

        {(session?.user?.roles?.includes("admin") ||
          session?.user?.roles?.includes("roles-manager")) && (
          <Link
            href={"/roles"}
            className={`text-blue-700 text-lg hover:text-blue-900 ${
              pathname == "/roles" ? "underline" : ""
            }`}
          >
            Roles
          </Link>
        )}

        {session?.user?.roles?.includes("admin") && (
          <Link
            href={"/assignRoles"}
            className={`text-blue-700 text-lg hover:text-blue-900 ${
              pathname == "/assignRoles" ? "underline" : ""
            }`}
          >
            AssignRoles
          </Link>
        )}

        {(session?.user?.roles?.includes("admin") ||
          session?.user?.roles?.includes("permissions-manager")) && (
          <Link
            href={"/permissions"}
            className={`text-blue-700 text-lg hover:text-blue-900 ${
              pathname == "/permissions" ? "underline" : ""
            }`}
          >
            Permissions
          </Link>
        )}

        {session?.user?.roles?.includes("admin") && (
          <Link
            href={"/assignPermissions"}
            className={`text-blue-700 text-lg hover:text-blue-900 ${
              pathname == "/assignPermissions" ? "underline" : ""
            }`}
          >
            AssignPermissions
          </Link>
        )}

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })} //It'll clear user’s session (JWT)
          className="text-white bg-red-600 px-3 py-2 ml-auto rounded-sm cursor-pointer hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </>
  );
}
