import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { withPermission } from "./lib/authChecks";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = new URL(req.url);
  // console.log("token data", token);

  // Allowing these routes without token
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/register") ||
    pathname.startsWith("/api/user-exists")
  ) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // USERS
  if (
    pathname.startsWith("/api/createUser") ||
    pathname.startsWith("/users/create")
  ) {
    const check = withPermission(token, ["user-create"]);
    if (check) return check;
  }
  if (
    pathname.startsWith("/api/updateUser") ||
    pathname.startsWith("/users/update")
  ) {
    const check = withPermission(token, ["user-update"]);
    if (check) return check;
  }
  if (
    pathname.startsWith("/api/deleteUser") ||
    pathname.startsWith("/users/delete")
  ) {
    const check = withPermission(token, ["user-delete"]);
    if (check) return check;
  }
  if (pathname.startsWith("/api/users") || pathname.startsWith("/users")) {
    const check = withPermission(token, [
      "user-create",
      "user-update",
      "user-delete",
    ]);
    if (check) return check;
  }

  // POSTS
  if (
    pathname.startsWith("/api/createPost") ||
    pathname.startsWith("/posts/create")
  ) {
    const check = withPermission(token, ["post-create"]);
    if (check) return check;
  }
  if (
    pathname.startsWith("/api/updatePost") ||
    pathname.startsWith("/posts/update")
  ) {
    const check = withPermission(token, ["post-update"]);
    if (check) return check;
  }
  if (
    pathname.startsWith("/api/deletePost") ||
    pathname.startsWith("/posts/delete")
  ) {
    const check = withPermission(token, ["post-delete"]);
    if (check) return check;
  }
  if (pathname.startsWith("/api/posts") || pathname.startsWith("/posts")) {
    const check = withPermission(token, [
      "post-create",
      "post-read",
      "post-update",
      "post-delete",
    ]);
    if (check) return check;
  }

  // EVENTS
  if (
    pathname.startsWith("/api/createEvent") ||
    pathname.startsWith("/events/create")
  ) {
    const check = withPermission(token, ["event-create"]);
    if (check) return check;
  }
  if (
    pathname.startsWith("/api/updateEvent") ||
    pathname.startsWith("/events/update")
  ) {
    const check = withPermission(token, ["event-update"]);
    if (check) return check;
  }
  if (
    pathname.startsWith("/api/deleteEvent") ||
    pathname.startsWith("/events/delete")
  ) {
    const check = withPermission(token, ["event-delete"]);
    if (check) return check;
  }
  if (pathname.startsWith("/api/events") || pathname.startsWith("/events")) {
    const check = withPermission(token, [
      "events-create",
      "event-read",
      "events-update",
      "events-delete",
    ]);
    if (check) return check;
  }
  // ROLES
  if (
    pathname.startsWith("/api/createRole") ||
    pathname.startsWith("/roles/create")
  ) {
    const check = withPermission(token, ["role-create"]);
    if (check) return check;
  }
  if (
    pathname.startsWith("/api/modifyRole") ||
    pathname.startsWith("/roles/update")
  ) {
    const check = withPermission(token, ["role-update"]);
    if (check) return check;
  }
  if (
    pathname.startsWith("/api/deleteRole") ||
    pathname.startsWith("/roles/delete")
  ) {
    const check = withPermission(token, ["role-delete"]);
    if (check) return check;
  }
  if (pathname.startsWith("/api/roles") || pathname.startsWith("/roles")) {
    const check = withPermission(token, [
      "role-create",
      "role-update",
      "role-delete",
    ]);
    if (check) return check;
  }

  // PERMISSIONS
  if (
    pathname.startsWith("/api/createPermission") ||
    pathname.startsWith("/permissions/create")
  ) {
    const check = withPermission(token, ["permission-create"]);
    if (check) return check;
  }
  if (
    pathname.startsWith("/api/modifyPermission") ||
    pathname.startsWith("/permissions/update")
  ) {
    const check = withPermission(token, ["permission-update"]);
    if (check) return check;
  }
  if (
    pathname.startsWith("/api/deletePermission") ||
    pathname.startsWith("/permissions/delete")
  ) {
    const check = withPermission(token, ["permission-delete"]);
    if (check) return check;
  }
  if (
    pathname.startsWith("/api/permissions") ||
    pathname.startsWith("/permissions")
  ) {
    const check = withPermission(token, [
      "permission-create",
      "permission-update",
      "permission-delete",
    ]);
    if (check) return check;
  }

  // Allowing the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
    "/users/:path*",
    "/roles/:path*",
    "/assignRoles",
    "/permissions/:path*",
    "/assignPermissions",
    "/posts/:path*",
    "/events/:path*",
  ],
};
