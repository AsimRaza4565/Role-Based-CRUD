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
    <div className="bg-slate-50 min-h-screen pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Posts</h1>
            <p className="mt-2 text-sm text-slate-500">
              Browse and manage published posts in the system.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            {session?.user?.permissions?.includes("post-create") && (
              <Link href={"/posts/create"}>
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Create Post
                </button>
              </Link>
            )}
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-xl shadow-sm">
            <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-slate-900">No posts found</h3>
            <p className="mt-1 text-sm text-slate-500">Get started by creating a new post.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                <div className="p-6 flex-grow flex flex-col">
                  <h2 className="text-xl font-bold text-slate-900 mb-2 truncate" title={post.title}>
                    {post.title}
                  </h2>
                  <p className="text-slate-600 text-sm line-clamp-4 flex-grow">
                    {post.content}
                  </p>
                </div>
                
                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3 mt-auto">
                  {session?.user?.permissions?.includes("post-update") && (
                    <Link
                      href={`/posts/update?id=${post._id}&title=${encodeURIComponent(post.title)}&content=${encodeURIComponent(post.content)}`}
                    >
                      <button className="text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-md transition-colors border border-emerald-200 text-sm font-medium">
                        Edit
                      </button>
                    </Link>
                  )}
                  {session?.user?.permissions?.includes("post-delete") && (
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-md transition-colors border border-rose-200 text-sm font-medium"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
