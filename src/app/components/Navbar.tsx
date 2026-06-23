"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  // permission helpers
  const canSeeUsers =
    session?.user?.permissions?.includes("user-read") ||
    session?.user?.permissions?.includes("user-create") ||
    session?.user?.permissions?.includes("user-update") ||
    session?.user?.permissions?.includes("user-delete");

  const canSeePosts = session?.user?.permissions?.includes("post-read");
  const canSeeEvents = session?.user?.permissions?.includes("event-read");

  const canSeeRoles =
    session?.user?.permissions?.includes("role-read") ||
    session?.user?.permissions?.includes("role-create") ||
    session?.user?.permissions?.includes("role-update") ||
    session?.user?.permissions?.includes("role-delete") ||
    session?.user?.roles?.includes("roles-manager") ||
    session?.user?.roles?.includes("admin");

  const isAdmin = session?.user?.roles?.includes("admin");

  const canSeePermissions =
    session?.user?.permissions?.includes("permission-read") ||
    session?.user?.permissions?.includes("permission-create") ||
    session?.user?.permissions?.includes("permission-update") ||
    session?.user?.permissions?.includes("permission-delete") ||
    session?.user?.roles?.includes("permissions-manager") ||
    isAdmin;

  // nav items list
  const navItems = [
    { label: "Users", href: "/users", show: canSeeUsers },
    { label: "Posts", href: "/posts", show: canSeePosts },
    { label: "Events", href: "/events", show: canSeeEvents },
    { label: "Roles", href: "/roles", show: canSeeRoles },
    { label: "Assign Roles", href: "/assignRoles", show: isAdmin },
    { label: "Permissions", href: "/permissions", show: canSeePermissions },
    { label: "Assign Permissions", href: "/assignPermissions", show: isAdmin },
  ].filter((item) => item.show);

  const desktopLinkClass = (href: string) =>
    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
      pathname === href
        ? "border-indigo-500 text-slate-900"
        : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
    }`;

  const mobileLinkClass = (href: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
      pathname === href
        ? "bg-indigo-50 text-indigo-700 font-semibold"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    }`;

  return (
    <>
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-black text-indigo-600 tracking-tighter">
                RBAC<span className="text-slate-800 font-medium tracking-normal">HQ</span>
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex lg:-my-px lg:ml-8 lg:space-x-8">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className={desktopLinkClass(item.href)}>
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right side: logout + hamburger */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-900 hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
              >
                Logout
              </button>

              {/* Hamburger */}
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {menuOpen ? (
                  /* X icon */
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  /* Hamburger icon */
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-slate-100 bg-white px-4 py-4 space-y-1">
            {navItems.length > 0 ? (
              navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={mobileLinkClass(item.href)}
                >
                  {/* Active indicator dot */}
                  <span
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      pathname === item.href ? "bg-indigo-500" : "bg-transparent"
                    }`}
                  />
                  {item.label}
                </Link>
              ))
            ) : (
              <p className="px-4 py-3 text-sm text-slate-400 italic">No pages available</p>
            )}

            {/* Mobile logout */}
            <div className="pt-3 border-t border-slate-100 mt-3">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                </svg>
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
