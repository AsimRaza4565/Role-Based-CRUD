"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function CreateRole() {
  const [roleName, setRoleName] = useState("");
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
      setSlug(slugify(roleName));
    }
  }, [roleName]);

  const handleRoleCreate = async (e) => {
    e.preventDefault();

    if (!roleName || !slug || isCreating) return;

    setIsCreating(true);

    try {
      const response = await fetch("/api/createRole", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: roleName, slug: slug }),
      });

      if (response.ok) {
        router.push("/roles");
        toast.success("Role created successfully");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create role");
      }
    } catch (error) {
      console.error("Error creating role:", error);
      toast.error("An error occurred while creating role");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="h-screen flex items-center">
      <form
        onSubmit={handleRoleCreate}
        className="flex flex-col gap-3 w-md mx-auto border rounded border-gray-500 px-5 py-3"
      >
        <h2 className="font-medium text-center text-2xl">Create new Role</h2>
        <input
          title="Create Role"
          type="text"
          id="createRole"
          placeholder="Enter Role Name"
          className="border p-2 rounded"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          required
        />
        <input
          title="Create Slug"
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
          disabled={!roleName || isCreating}
          onClick={() => router.back()}
          className="p-2 bg-blue-500 hover:bg-blue-600 mt-2 rounded cursor-pointer"
        >
          Create
        </button>
      </form>
    </div>
  );
}
