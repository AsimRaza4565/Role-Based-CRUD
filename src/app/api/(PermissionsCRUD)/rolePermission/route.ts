import { NextResponse } from "next/server";
import { connectDatabase } from "../../../../lib/mongodb";
import RolePermission from "../../../../models/rolePermission";

export async function POST(req: Request) {
  await connectDatabase();

  try {
    const body = await req.json();
    const { roleId, permissionIds } = body;

    if (!roleId || !Array.isArray(permissionIds)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const uniquepermissionIds = Array.from(
      new Set(permissionIds.map((r) => String(r)))
    ); //Set remove duplicates

    // Removing existing permissions
    const deleteResult = await RolePermission.deleteMany({
      roleId: roleId,
      permissionId: { $nin: uniquepermissionIds },
    });
    console.log("deleteResult", deleteResult);

    if (uniquepermissionIds.length === 0) {
      return NextResponse.json(
        { message: "No Permissions for the role" },
        { status: 200 }
      );
    }

    const operation = uniquepermissionIds.map((permissionId) => ({
      //performing multiple operations using bulkwrite
      updateOne: {
        filter: { roleId, permissionId },
        update: { $setOnInsert: { roleId, permissionId } },
        upsert: true,
      },
    }));

    const upsertResult = await RolePermission.bulkWrite(operation, {
      ordered: false,
    });

    return NextResponse.json(
      {
        message: "Permissions updated successfully",
        // deletedCount: deleteResult.deletedCount,
        upsertResult,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in POST /api/rolePermission:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
