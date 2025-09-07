"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function UpdatePost(props) {
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
      } else {
        // const error = await response.json();
        await response.json();
        toast.error("Failed to update post");
      }
    } catch (error) {
      toast.error("An error occurred while updating post");
    }
  };

  return (
    <div className="h-screen flex items-center">
      <form
        onSubmit={handlePostUpdate}
        className="flex flex-col gap-3 w-md mx-auto border rounded border-gray-500 px-5 py-7"
      >
        <h2 className="font-medium text-center text-2xl">Update Post</h2>
        <hr />
        <div className="flex flex-col">
          <label htmlFor="updatePost" className="font-medium mt-3 mb-2">
            Title
          </label>
          <input
            title="Update Post"
            type="text"
            id="updatePost"
            placeholder={postTitle}
            className="border p-2 rounded"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="updateSlug" className="font-medium mb-2">
            Content
          </label>
          <textarea
            title="Update Content"
            id="updateContent"
            placeholder={content}
            className="border p-2 rounded"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
            required
          />
        </div>
        <button
          type="submit"
          disabled={!postTitle || !content}
          onClick={() => router.back()}
          className="p-2 bg-yellow-500 hover:bg-yellow-600 rounded cursor-pointer mt-3"
        >
          Update
        </button>
      </form>
    </div>
  );
}
