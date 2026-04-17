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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Create New Permission
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Define a granular access level within the system
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          <form onSubmit={handlePermissionCreate} className="space-y-6" noValidate>
            
            <div>
              <label htmlFor="permissionName" className="block text-sm font-medium text-slate-700">
                Permission Name
              </label>
              <div className="mt-1">
                <input
                  id="permissionName"
                  name="permissionName"
                  type="text"
                  required
                  placeholder="e.g. Read Users, Create Posts"
                  value={permissionName}
                  onChange={(e) => setPermissionName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-slate-700">
                Permission Slug Identifier
              </label>
              <div className="mt-1">
                <input
                  id="slug"
                  name="slug"
                  type="text"
                  required
                  placeholder="e.g. read-users, create-posts"
                  value={slug}
                  onChange={(e) => {
                    setSlug(slugify(e.target.value));
                    setSlugEdited(true);
                  }}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all bg-slate-50"
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                A unique machine-readable identifier automatically generated from the name unless edited.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!permissionName || !slug || isCreating}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? "Creating..." : "Create Permission"}
              </button>
            </div>
            
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => router.back()}
                className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
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
