"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

function UpdatePostContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const postId = searchParams.get("id");
  const [postTitle, setPostTitle] = useState(searchParams.get("title") || "");
  const [content, setContent] = useState(searchParams.get("content") || "");

  const handlePostUpdate = async (e) => {
    e.preventDefault();
    if (!postTitle || !content) return;

    try {
      const response = await fetch(`/api/updatePost/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: postTitle, content: content }),
      });

      if (response.ok) {
        toast.success("Post updated");
        router.push("/posts");
      } else {
        await response.json();
        toast.error("Failed to update post");
      }
    } catch (error) {
      toast.error("An error occurred while updating post");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Update Post
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Edit and modify your published post
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          <form onSubmit={handlePostUpdate} className="space-y-6" noValidate>
            
            <div>
              <label htmlFor="updatePost" className="block text-sm font-medium text-slate-700">
                Title
              </label>
              <div className="mt-1">
                <input
                  id="updatePost"
                  name="updatePost"
                  type="text"
                  required
                  placeholder="Enter Post Title"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="updateContent" className="block text-sm font-medium text-slate-700">
                Content
              </label>
              <div className="mt-1">
                <textarea
                  id="updateContent"
                  name="updateContent"
                  rows={6}
                  required
                  placeholder="Write your post content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all resize-none"
                />
              </div>
            </div>

            <div className="pt-2 mb-2">
              <button
                type="submit"
                disabled={!postTitle || !content}
                className="cursor-pointer w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </div>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => router.back()}
                className="cursor-pointer text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
              >
                Cancel and return
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function UpdatePost() {
  return (
    <Suspense fallback={null}>
      <UpdatePostContent />
    </Suspense>
  );
}
