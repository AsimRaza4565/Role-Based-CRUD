import { NextResponse } from "next/server";
import { connectDatabase } from "../../../../lib/mongodb";
import Post from "../../../../models/post";

export async function GET() {
  try {
    await connectDatabase();
    const posts = await Post.find();
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
