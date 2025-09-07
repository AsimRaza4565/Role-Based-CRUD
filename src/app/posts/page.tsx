"use client";

import Navbar from "@/app/components/Navbar";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Post {
  _id: string;
  title: string;
  content: string;
}

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);

  const { data: session } = useSession();
  // console.log("permissions", session?.user?.permissions);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsData = await fetch("api/posts");
        setPosts(await postsData.json());
        console.log("postsData", postsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/deletePost/${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Post deleted");
      } else {
        await response.json();
        toast.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting Post:", error);
      toast.error("An error occurred while deleting Post");
    }
  };

  return (
    <>
      <Navbar />
      <div className="mx-10 pb-5">
        {session?.user?.permissions?.includes("post-create") && (
          <Link href={"/posts/create"}>
            <button
              type="button"
              className="px-3 py-1 mx-5 mt-2 mb-3 bg-blue-500 hover:bg-blue-600 border rounded cursor-pointer"
            >
              Create Post
            </button>
          </Link>
        )}
        <h1 className="text-3xl text-center font-bold my-3">Posts</h1>

        <div className="p-3 border-1 border-gray-500 rounded-md mx-5">
          <ul className="flex gap-3 flex-wrap">
            {posts.map((post) => (
              <li
                key={post._id}
                className="flex flex-col basis-[24%] border rounded bg-amber-100 px-3 py-2"
              >
                <span className="text-2xl font-medium text-center mt-2">
                  {post.title}
                </span>{" "}
                <br />
                <p className="mb-auto">{post.content}</p>
                <div className="flex justify-end mt-5">
                  {session?.user?.permissions?.includes("post-update") && (
                    <Link
                      href={`/posts/update?id=${post._id}&title=${post.title}&content=${post.content}`}
                    >
                      <button className="bg-yellow-500 px-4 py-2 text-sm rounded hover:bg-yellow-600 cursor-pointer text-white ml-2">
                        Edit
                      </button>
                    </Link>
                  )}

                  {session?.user?.permissions?.includes("post-delete") && (
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="bg-red-500 p-2 text-sm rounded hover:bg-red-600 cursor-pointer text-white ml-2"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
