import { NextResponse } from "next/server";
import { connectDatabase } from "../../../../lib/mongodb";
import Post from "../../../../models/post";

export async function POST(request: Request) {
  try {
    await connectDatabase();
    // console.log("Database Connected")
    const { title, content } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: "Enter the Title and Content" },
        { status: 400 }
      );
    }
    // const PostExists = await Post.findOne({ title });
    // if (PostExists) {
    //   return NextResponse.json(
    //     { error: "Post title already exists" },
    //     { status: 400 }
    //   );
    // }

    // const post = await Post.create({ title });
    // console.log(post);
    await Post.create({ title, content });
    return NextResponse.json({ message: "Post created" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error occurred while creating the post", error },
      { status: 500 }
    );
  }
}
