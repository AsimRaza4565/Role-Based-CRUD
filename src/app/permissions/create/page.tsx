"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function CreatePermission() {
  const [permissionName, setPermissionName] = useState("");
  const [slug, setSlug] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);

  const router = useRouter();

  function slugify(str) {
    return str
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // replacing spaces with -
      .replace(/[^a-z0-9-]/g, ""); // remove enything except a-z, 0-9, or -
  }

  useEffect(() => {
    if (!slugEdited) {
      setSlug(slugify(permissionName));
    }
  }, [permissionName]);

  const handlePermissionCreate = async (e) => {
    e.preventDefault();

    if (!permissionName || !slug || isCreating) return;

    setIsCreating(true);

    try {
      const response = await fetch("/api/createPermission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: permissionName, slug: slug }),
      });

      if (response.ok) {
        router.push("/permissions");
        toast.success("Permission created");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create permission");
      }
    } catch (error) {
      console.error("Error creating permission:", error);
      toast.error("An error occurred while creating permission");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="h-screen flex items-center">
      <form
        onSubmit={handlePermissionCreate}
        className="flex flex-col gap-3 w-md mx-auto border rounded border-gray-500 px-5 py-7"
      >
        <h2 className="font-medium text-center text-2xl">
          Create new Permission
        </h2>
        <input
          title="CreatePermission"
          type="text"
          id="createPermission"
          placeholder="Enter Permission Name"
          className="border p-2 rounded"
          value={permissionName}
          onChange={(e) => setPermissionName(e.target.value)}
          required
        />
        <input
          title="CreateSlug"
          type="text"
          id="CreateSlug"
          placeholder="Slug"
          className="border p-2 rounded"
          value={slug}
          onChange={(e) => {
            setSlug(slugify(e.target.value));
            setSlugEdited(true); //manually edited
          }}
          required
        />
        <button
          type="submit"
          disabled={!permissionName || isCreating}
          onClick={() => router.back()}
          className="p-2 bg-blue-500 hover:bg-blue-600 rounded cursor-pointer"
        >
          Create
        </button>
      </form>
    </div>
  );
}
