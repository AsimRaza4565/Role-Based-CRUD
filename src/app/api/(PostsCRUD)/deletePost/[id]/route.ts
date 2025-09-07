import { NextResponse } from "next/server";
import { connectDatabase } from "../../../../../lib/mongodb";
import Post from "../../../../../models/post";

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  await connectDatabase();

  try {
    const { id } = await context.params;

    const deletedPost = await Post.findByIdAndDelete(id);
    // console.log("deletedPost", deletedPost);

    if (!deletedPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Post deleted",
    });
  } catch (err) {
    console.error("Error deleting Post:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
