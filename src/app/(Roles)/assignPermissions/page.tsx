"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { toast } from "react-toastify";

interface Role {
  _id: string;
  name: string;
  slug: string;
}

interface Permission {
  _id: string;
  name: string;
  slug: string;
}

export default function AssignRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [originalPermissions, setOriginalPermissions] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesData = await fetch("api/roles");
        const permissionsData = await fetch("api/permissions");
        setRoles(await rolesData.json());
        setPermissions(await permissionsData.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Fetching role's permissions
  useEffect(() => {
    if (!selectedRole) return;

    const fetchRolePermission = async () => {
      try {
        const res = await fetch(`/api/rolePermission/${selectedRole._id}`);
        // console.log("Role Id:", selectedRole._id);

        if (res.ok) {
          const data = await res.json();
          // console.log("Data:", data);

          let rolePermissionIds; //or rolePermissionIds = []

          if (Array.isArray(data)) {
            rolePermissionIds = data.map((item) => item.permissionId?._id);
          } else if (data.permissionId) {
            // for single permissionId
            rolePermissionIds = [data.permission._id || data.permissionId];
          } else if (data.permissionIds) {
            // If data has permissionIds array
            rolePermissionIds = data.permissionIds;
          }

          setSelectedPermissions(rolePermissionIds);
          setOriginalPermissions(rolePermissionIds);
          // console.log("Role Permissions:", rolePermissionIds);
        } else {
          setSelectedPermissions([]);
          setOriginalPermissions([]);
        }
      } catch (error) {
        console.error("Error fetching role permissions:", error);
        setSelectedPermissions([]);
        setOriginalPermissions([]);
      }
    };

    fetchRolePermission();
  }, [selectedRole]);

  // Handling role toggle
  const handlePermissionToggle = (roleId: string) => {
    setSelectedPermissions((prev) => {
      if (prev.includes(roleId)) {
        return prev.filter((id) => id !== roleId);
      } else {
        return [...prev, roleId];
      }
    });
  };

  // Handling role update
  const handleRoleUpdate = async () => {
    if (!selectedRole || isUpdating) return;

    setIsUpdating(true);

    try {
      const response = await fetch("/api/rolePermission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roleId: selectedRole._id,
          permissionIds: selectedPermissions,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Update successful:", result);
        setOriginalPermissions([...selectedPermissions]);
        toast.success("Permissions updated successfully!");
      } else {
        const error = await response.json();
        console.error("Permission update failed:", error);
        toast.error("Failed to update permissions");
      }
    } catch (error) {
      console.error("Error updating permissions:", error);
      toast.error("An error occurred while updating permissions");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="w-screen">
      <Navbar />
      <div>
        <div className="flex gap-3 items-center border-gray-500 rounded mx-28 my-3">
          <span className="text-lg py-1 font-medium my-3 basis-8/12 text-center border border-gray-500 rounded">
            ROLES
          </span>
          <span className="text-lg py-1 font-medium my-3 basis-4/12 text-center border border-gray-500 rounded">
            PERMISSIONS
          </span>
        </div>

        {/* Roles list */}
        <div className="flex mx-28 gap-3">
          <div className="border border-gray-500 rounded p-4 bg-gray-50 basis-8/12">
            <ul className="flex flex-col gap-2">
              {roles.map((role) => (
                <li
                  key={role._id}
                  onClick={() => setSelectedRole(role)}
                  className={`cursor-pointer p-3 rounded ${
                    selectedRole?._id === role._id
                      ? "bg-yellow-200 border-blue-300"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  <span className="font-medium">{role.name} </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Permissions list */}
          <div className="border border-gray-500 rounded p-4 bg-gray-50 basis-4/12">
            {!selectedRole ? (
              <p className="text-gray-700 text-center font-bold">
                Select a Role
              </p>
            ) : (
              <div className="flex flex-col">
                <div className="mb-4">
                  <ul>
                    {permissions.map((permission) => (
                      <li key={permission._id}>
                        <label className="flex items-center gap-3 cursor-pointer p-1 hover:bg-gray-100 rounded">
                          <input
                            type="checkbox"
                            value={permission._id}
                            checked={selectedPermissions.includes(
                              permission._id
                            )}
                            onChange={() =>
                              handlePermissionToggle(permission._id)
                            }
                            className="w-4 h-4"
                          />
                          <span>{permission.name}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={handleRoleUpdate}
                  disabled={isUpdating}
                  className={`px-4 py-2 rounded border ${
                    !isUpdating
                      ? "bg-yellow-300 hover:bg-yellow-400 cursor-pointer border-yellow-400"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300"
                  }`}
                >
                  {isUpdating ? "Updating..." : "Update Permissions"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
