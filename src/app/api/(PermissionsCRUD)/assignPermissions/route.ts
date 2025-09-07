import { NextResponse } from "next/server";
import { connectDatabase } from "../../../../lib/mongodb";
import RolePermission from "../../../../models/rolePermission";

export async function POST(request: Request) {
  await connectDatabase();

  try {
    const body = await request.json();
    const { roleId, permissionIds } = body;

    if (!roleId || !Array.isArray(permissionIds)) {
      return NextResponse.json({ error: "Data missing" }, { status: 400 });
    }

    // New Permissions
    const uniquePermissionIds = Array.from(
      new Set(permissionIds.map((r) => String(r)))
    ); //Set removes duplicates

    const deleteResult = await RolePermission.deleteMany({
      roleId: roleId,
      permissionId: { $nin: uniquePermissionIds }, //deleting roles that are not in new list
    });
    console.log(deleteResult);

    if (uniquePermissionIds.length === 0) {
      return NextResponse.json({ message: "No Permissions" }, { status: 200 });
    }

    const operations = uniquePermissionIds.map((permissionId) => ({
      //will run on every permission
      updateOne: {
        //performing multiple operations on a single collection
        filter: { roleId, permissionId },
        update: { $setOnInsert: { roleId, permissionId } }, //$setOnInsert only sets these fields if new document will be inserted/created
        upsert: true,
      },
    }));

    const Result = await RolePermission.bulkWrite(operations);

    return NextResponse.json(
      {
        message: "Permissions updated successfully",
        Result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/assignPermissions:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
