"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function UpdateRole() {
  const router = useRouter();
  const { slug } = useParams();
  // console.log("slug", slug);

  const [roleName, setRoleName] = useState("");
  const [roleId, setRoleId] = useState("");
  const [slugState, setSlugState] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  function slugify(str: string) {
    return str
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  useEffect(() => {
    if (!slugEdited && roleName) {
      setSlugState(slugify(roleName));
    }
  }, [roleName, slugEdited]);

  useEffect(() => {
    async function fetchRole() {
      if (!slug) return;
      const res = await fetch(`/api/roles/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setRoleName(data.name);
        setRoleId(data._id);
        setSlugState(data.slug);
      }
      // console.log("Role Name", roleName);
    }
    fetchRole();
  }, [slug]);

  const handleRoleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName || !slug) return;

    try {
      const response = await fetch(`/api/modifyRole/${roleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: roleName, slug: slugState }),
      });

      if (response.ok) {
        toast.success("Role updated");
        router.back();
      } else {
        toast.error("Failed to update role");
      }
    } catch {
      toast.error("An error occurred while updating role");
    }
  };

  return (
    <div className="h-screen flex items-center">
      <form
        onSubmit={handleRoleUpdate}
        className="flex flex-col gap-3 w-md mx-auto border rounded border-gray-500 px-5 py-7"
      >
        <h2 className="font-medium text-center text-2xl">Update Role</h2>
        <hr />
        <div className="flex flex-col">
          <label className="font-medium mt-3 mb-2">Role Name</label>
          <input
            type="text"
            title="Role Name"
            className="border p-2 rounded"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="font-medium mb-2">Slug</label>
          <input
            title="Slug"
            type="text"
            className="border p-2 rounded"
            value={slugState}
            onChange={(e) => {
              setSlugState(slugify(e.target.value));
              setSlugEdited(true);
            }}
            required
          />
        </div>
        <button
          type="submit"
          disabled={!roleName || !slug}
          className="p-2 bg-yellow-500 hover:bg-yellow-600 rounded cursor-pointer mt-3"
        >
          Update
        </button>
      </form>
    </div>
  );
}
