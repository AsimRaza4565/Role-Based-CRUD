"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function CreatePost() {
  const [postTitle, setPostTitle] = useState("");
  const [content, setContent] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const router = useRouter();

  const handlePostCreate = async (e) => {
    e.preventDefault();

    if (!postTitle || !content || isCreating) return;

    setIsCreating(true);

    try {
      const response = await fetch("/api/createPost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: postTitle, content: content }),
      });

      if (response.ok) {
        router.push("/posts");
        toast.success("Post created");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("An error occurred while creating post");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="h-screen flex items-center">
      <form
        onSubmit={handlePostCreate}
        className="flex flex-col gap-3 w-md mx-auto border rounded border-gray-500 px-5 py-3"
      >
        <h2 className="font-medium text-center text-2xl mb-3">
          Create new Post
        </h2>
        <div className="flex flex-col gap-1">
          <label htmlFor="postTitle" className="font-medium text-lg">
            Title
          </label>
          <input
            title="Post Title"
            type="text"
            id="postTitle"
            placeholder="Enter Post Title"
            className="border p-2 rounded"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="PostContent" className="font-medium text-lg">
            Content{" "}
          </label>
          <textarea
            title="Post Content"
            id="postContent"
            placeholder="Content"
            className="border p-2 rounded"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={!postTitle || !content || isCreating}
          onClick={() => router.back()}
          className="p-2 bg-blue-500 hover:bg-blue-600 mt-2 rounded cursor-pointer"
        >
          Create
        </button>
      </form>
    </div>
  );
}
