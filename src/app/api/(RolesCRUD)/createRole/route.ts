import { NextResponse } from "next/server";
import { connectDatabase } from "../../../../lib/mongodb";
import Role from "../../../../models/role";

export async function POST(request: Request) {
  try {
    await connectDatabase();
    // console.log("Database Connected")
    const { name, slug } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "Enter the Role and slug name" },
        { status: 400 }
      );
    }
    const RoleExists = await Role.findOne({ name });
    if (RoleExists) {
      return NextResponse.json(
        { error: "Role already exists" },
        { status: 400 }
      );
    }

    // const role = await Role.create({ name });
    // console.log(role);
    await Role.create({ name, slug });
    return NextResponse.json({ message: "Role created" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error occurred while creating the role", error },
      { status: 500 }
    );
  }
}
