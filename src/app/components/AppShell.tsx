"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

const authRoutes = ["/", "/register", "/login", "/signup"];

export default function AppShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const showNavbar = !authRoutes.includes(pathname);

  return (
    <div className="min-h-screen">
      {showNavbar && <Navbar />}
      <main>{children}</main>
    </div>
  );
}