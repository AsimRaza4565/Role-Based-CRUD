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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Update Permission
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Modify the properties of this access level
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          <form onSubmit={handlePermissionUpdate} className="space-y-6" noValidate>
            
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
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="slugState" className="block text-sm font-medium text-slate-700">
                Permission Slug Identifier
              </label>
              <div className="mt-1">
                <input
                  id="slugState"
                  name="slugState"
                  type="text"
                  required
                  placeholder="e.g. read-users, create-posts"
                  value={slugState}
                  onChange={(e) => {
                    setSlugState(slugify(e.target.value));
                    setSlugEdited(true);
                  }}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all bg-slate-50"
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                A unique machine-readable identifier automatically generated from the name unless edited.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!permissionName || !slug}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Changes
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
