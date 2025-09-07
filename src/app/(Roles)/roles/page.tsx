"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Link from "next/link";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

interface Role {
  _id: string;
  name: string;
  slug: string;
}

export default function Roles() {
  const { data: session } = useSession();
  console.log("session", session);

  const [roles, setRoles] = useState<Role[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("api/roles");
        const data = await res.json();
        // console.log("data:", data);
        setRoles(data);
      } catch (error) {
        console.error("Error fetching Roles:", error);
      }
    };
    fetchData();
  }, []);

  const handleDeleteRole = async (roleId: string) => {
    try {
      const response = await fetch(`/api/deleteRole/${roleId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Role deleted");
      } else {
        await response.json();
        toast.error("Failed to delete role");
      }
    } catch (error) {
      console.error("Error deleting Role:", error);
      toast.error("An error occurred while deleting Role");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex pb-5">
        {session?.user?.permissions?.includes("role-create") && (
          <Link href={"/roles/create"}>
            <button className="bg-blue-400 hover:bg-blue-500 border p-2 rounded my-3 mx-36 cursor-pointer">
              Create New Role
            </button>
          </Link>
        )}
      </div>

      <div className="mx-36 pb-5">
        <h1 className="text-3xl font-bold mb-4 text-center">Roles</h1>
        <div className="border rounded p-5 flex flex-col">
          <ul>
            {roles.map((role) => (
              <li
                key={role._id}
                className="text-lg font-medium border mb-1 p-2 flex justify-between items-center rounded border-gray-500"
              >
                <span>{role.name}</span>

                <div className="flex gap-2">
                  {session?.user?.permissions?.includes("role-update") && (
                    <Link href={`/roles/update/${role.slug}`}>
                      <button className="bg-yellow-500 p-2 text-sm rounded hover:bg-yellow-600 cursor-pointer text-white ml-2">
                        Update
                      </button>
                    </Link>
                  )}

                  {session?.user?.permissions?.includes("role-delete") && (
                    <button
                      onClick={() => handleDeleteRole(role._id)}
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
