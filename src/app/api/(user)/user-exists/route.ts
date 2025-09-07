import { NextResponse } from "next/server";
import { connectDatabase } from "../../../../lib/mongodb";
import User from "../../../../models/user";

export async function POST(request: Request) {
  try {
    await connectDatabase();
    const { email } = await request.json();
    const user = await User.findOne({ email }).select("_id");
    // console.log("user", user);
    return NextResponse.json({ user });
  } catch (error) {
    console.log(error);
  }
}
