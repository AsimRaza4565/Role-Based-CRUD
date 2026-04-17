"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function UpdateRole() {
  const router = useRouter();
  const { slug } = useParams();

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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Update Role
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Modify the properties of this access role
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          <form onSubmit={handleRoleUpdate} className="space-y-6" noValidate>
            
            <div>
              <label htmlFor="roleName" className="block text-sm font-medium text-slate-700">
                Role Name
              </label>
              <div className="mt-1">
                <input
                  id="roleName"
                  name="roleName"
                  type="text"
                  required
                  placeholder="e.g. Editor, Admin, Viewer"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="slugState" className="block text-sm font-medium text-slate-700">
                Role Slug Identifier
              </label>
              <div className="mt-1">
                <input
                  id="slugState"
                  name="slugState"
                  type="text"
                  required
                  placeholder="e.g. editor, admin, viewer"
                  value={slugState}
                  onChange={(e) => {
                    setSlugState(slugify(e.target.value));
                    setSlugEdited(true);
                  }}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all bg-slate-50"
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                A unique identifier automatically generated from the name unless edited.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!roleName || !slug}
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
