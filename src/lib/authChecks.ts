import { NextResponse } from "next/server";
import { JWT } from "next-auth/jwt";

// Checking permission
export function withPermission(token: JWT, requiredPermissions: string[]) {
  // console.log("token", token);

  // Checking if token has permissions property and if it's an array
  if (!token?.permissions || !Array.isArray(token.permissions)) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  // Checking if user has any of the required permissions
  const hasPermission = requiredPermissions.some((permisssion) =>
    token.permissions.includes(permisssion)
  );
  // console.log("token permissions", token.permissions);

  if (!hasPermission) {
    return NextResponse.json({ error: "Not Authorized" }, { status: 403 });
  }

  return null; // null means allowed
}
