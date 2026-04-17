"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-black text-indigo-600 tracking-tighter">
                RBAC<span className="text-slate-800 font-medium tracking-normal">HQ</span>
              </span>
            </Link>
            <div className="hidden sm:-my-px sm:ml-8 sm:flex sm:space-x-8">
              {session?.user?.roles?.includes("admin") && (
                <Link
                  href={"/users"}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    pathname == "/users"
                      ? "border-indigo-500 text-slate-900"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
                >
                  Users
                </Link>
              )}

              {session?.user?.permissions?.includes("post-read") && (
                <Link
                  href={"/posts"}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    pathname == "/posts"
                      ? "border-indigo-500 text-slate-900"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
                >
                  Posts
                </Link>
              )}

              {session?.user?.permissions?.includes("event-read") && (
                <Link
                  href={"/events"}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    pathname == "/events"
                      ? "border-indigo-500 text-slate-900"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
                >
                  Events
                </Link>
              )}

              {(session?.user?.roles?.includes("admin") ||
                session?.user?.roles?.includes("roles-manager")) && (
                <Link
                  href={"/roles"}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    pathname == "/roles"
                      ? "border-indigo-500 text-slate-900"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
                >
                  Roles
                </Link>
              )}

              {session?.user?.roles?.includes("admin") && (
                <Link
                  href={"/assignRoles"}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    pathname == "/assignRoles"
                      ? "border-indigo-500 text-slate-900"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
                >
                  Assign Roles
                </Link>
              )}

              {(session?.user?.roles?.includes("admin") ||
                session?.user?.roles?.includes("permissions-manager")) && (
                <Link
                  href={"/permissions"}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    pathname == "/permissions"
                      ? "border-indigo-500 text-slate-900"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
                >
                  Permissions
                </Link>
              )}

              {session?.user?.roles?.includes("admin") && (
                <Link
                  href={"/assignPermissions"}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    pathname == "/assignPermissions"
                      ? "border-indigo-500 text-slate-900"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
                >
                  Assign Permissions
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-900 hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
