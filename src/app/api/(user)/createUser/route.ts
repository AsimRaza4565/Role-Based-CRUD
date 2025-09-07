import { NextResponse } from "next/server";
import { connectDatabase } from "../../../../lib/mongodb";
import User from "../../../../models/user";
import Role from "../../../../models/role";
import UserRole from "../../../../models/userRole";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    await connectDatabase();

    const { name, email, password, roleId } = await request.json();

    if (!name || !email || !password || !roleId) {
      return NextResponse.json(
        { error: "Please fill all fields" },
        { status: 400 }
      );
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    // Assigning role
    const role = await Role.findById(roleId);
    if (!role) {
      return NextResponse.json(
        { error: "Invalid role provided" },
        { status: 400 }
      );
    }

    const userRole = await UserRole.create({
      userId: user._id,
      roleId: role._id,
    });

    if (!userRole) {
      return NextResponse.json(
        { error: "Failed to assign role" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "User created successfully", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Error occurred while creating the user", error },
      { status: 500 }
    );
  }
}
