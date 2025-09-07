"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

interface Permission {
  _id: string;
  name: string;
  slug: string;
}

export default function Permission() {
  const { data: session } = useSession();
  const [permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("api/permissions");
        const data = await res.json();
        // console.log("data:", data);
        setPermissions(data);
      } catch (error) {
        console.error("Error fetching Permissions:", error);
      }
    };
    fetchData();
  }, []);

  const handleDeletePermission = async (permissionId: string) => {
    try {
      const response = await fetch(`/api/deletePermission/${permissionId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Permission deleted");
      } else {
        await response.json();
        toast.error("Failed to delete permission");
      }
    } catch (error) {
      console.error("Error deleting Permission:", error);
      toast.error("An error occurred while deleting Permission");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        {session?.user?.permissions?.includes("permission-create") && (
          <Link href={"/permissions/create"}>
            <button className="bg-blue-400 hover:bg-blue-500 border p-2 rounded my-3 mx-24 cursor-pointer">
              Create New Permission
            </button>
          </Link>
        )}
      </div>

      <div className="mx-24 my-1">
        <h1 className="text-3xl font-bold mb-4 text-center">Permissions</h1>
        <div className="border rounded p-5 flex flex-col">
          <ul>
            {permissions.map((permission) => (
              <li
                key={permission._id}
                className="text-lg font-medium border mb-1 p-2 flex justify-between items-center rounded border-gray-500"
              >
                <span>{permission.name}</span>
                <div className="flex gap-2">
                  {session?.user?.permissions?.includes(
                    "permission-update"
                  ) && (
                    <Link href={`/permissions/update/${permission.slug}`}>
                      <button className="bg-yellow-500 p-2 text-sm rounded hover:bg-yellow-600 cursor-pointer text-white ml-2">
                        Update
                      </button>
                    </Link>
                  )}
                  {session?.user?.permissions?.includes(
                    "permission-delete"
                  ) && (
                    <button
                      onClick={() => handleDeletePermission(permission._id)}
                      className="bg-red-500 p-2 text-sm rounded hover:bg-red-600 cursor-pointer text-white"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
