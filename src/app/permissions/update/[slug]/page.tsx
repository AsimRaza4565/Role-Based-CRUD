"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function UpdatePermission() {
  const router = useRouter();
  const { slug } = useParams();
  console.log("slug", slug);

  const [permissionName, setPermissionName] = useState("");
  const [permissionId, setPermissionId] = useState("");
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
    if (!slugEdited && permissionName) {
      setSlugState(slugify(permissionName));
    }
  }, [permissionName, slugEdited]);

  useEffect(() => {
    async function fetchPermission() {
      if (!slug) return;
      const res = await fetch(`/api/permissions/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setPermissionName(data.name);
        setPermissionId(data._id);
        setSlugState(data.slug);
      }
      // console.log("Permission Name:", permissionName);
    }
    fetchPermission();
  }, [slug]);

  const handlePermissionUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!permissionName || !slug) return;

    try {
      const response = await fetch(`/api/modifyPermission/${permissionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: permissionName, slug: slugState }),
      });

      if (response.ok) {
        toast.success("Permission updated");
        router.back();
      } else {
        toast.error("Failed to update Permission");
      }
    } catch {
      toast.error("An error occurred while updating permission");
    }
  };

  return (
    <div className="h-screen flex items-center">
      <form
        onSubmit={handlePermissionUpdate}
        className="flex flex-col gap-3 w-md mx-auto border rounded border-gray-500 px-5 py-7"
      >
        <h2 className="font-medium text-center text-2xl">Update Permission</h2>
        <hr />
        <div className="flex flex-col">
          <label className="font-medium mt-3 mb-2">Permission Name</label>
          <input
            type="text"
            title="Permission Name"
            className="border p-2 rounded"
            value={permissionName}
            onChange={(e) => setPermissionName(e.target.value)}
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
          disabled={!permissionName || !slug}
          className="p-2 bg-yellow-500 hover:bg-yellow-600 rounded cursor-pointer mt-3"
        >
          Update
        </button>
      </form>
    </div>
  );
}
