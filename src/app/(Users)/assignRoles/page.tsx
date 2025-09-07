"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { toast } from "react-toastify";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Role {
  _id: string;
  name: string;
  slug: string;
}

export default function AssignRoles() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [originalRoles, setOriginalRoles] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await fetch("api/users");
        const rolesData = await fetch("api/roles");
        setUsers(await usersData.json());
        setRoles(await rolesData.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Fetching user's roles
  useEffect(() => {
    if (!selectedUser) return;

    const fetchUserRoles = async () => {
      try {
        const res = await fetch(`/api/userRole/${selectedUser._id}`);
        // console.log("User Id:", selectedUser._id);

        if (res.ok) {
          const data = await res.json();
          // console.log("Data:", data);

          let userRoleIds; //or userRoleIds = []

          if (Array.isArray(data)) {
            userRoleIds = data.map((item) => item.roleId?._id);
          } else if (data.roleId) {
            // for single roleId
            userRoleIds = [data.roleId._id || data.roleId];
          } else if (data.roleIds) {
            // If data has roleIds array
            userRoleIds = data.roleIds;
          }

          setSelectedRoles(userRoleIds);
          setOriginalRoles(userRoleIds);
          // console.log("User Roles:", userRoleIds);
        } else {
          setSelectedRoles([]);
          setOriginalRoles([]);
        }
      } catch (error) {
        console.error("Error fetching user roles:", error);
        setSelectedRoles([]);
        setOriginalRoles([]);
      }
    };

    fetchUserRoles();
  }, [selectedUser]);

  // Handling role toggle
  const handleRoleToggle = (roleId: string) => {
    setSelectedRoles((prev) => {
      if (prev.includes(roleId)) {
        return prev.filter((id) => id !== roleId);
      } else {
        return [...prev, roleId];
      }
    });
  };

  // Handling role update
  const handleRoleUpdate = async () => {
    if (!selectedUser || isUpdating) return;

    setIsUpdating(true);

    try {
      const response = await fetch("/api/userRole", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser._id,
          roleIds: selectedRoles,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Update successful:", result);
        setOriginalRoles([...selectedRoles]);
        toast.success("Roles updated successfully!");
      } else {
        const error = await response.json();
        console.error("Role update failed:", error);
        toast.error("Failed to update roles");
      }
    } catch (error) {
      console.error("Error updating roles:", error);
      toast.error("An error occurred while updating roles");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="flex gap-3 items-center mx-24 my-3">
        <span className="text-lg py-1 font-medium my-3 basis-9/12 text-center border border-gray-500 rounded">
          USERS
        </span>
        <span className="text-lg py-1 font-medium my-3 basis-3/12 text-center border border-gray-500 rounded">
          ROLES
        </span>
      </div>

      {/* Users list */}
      <div className="flex mx-24 gap-3">
        <div className="border border-gray-500 rounded p-4 bg-gray-50 basis-9/12">
          <ul className="flex flex-col gap-2">
            {users.map((user) => (
              <li
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`cursor-pointer p-3 rounded ${
                  selectedUser?._id === user._id
                    ? "bg-yellow-200 border-blue-300"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                <span className="font-medium">Name:</span> {user.name} <br />
                <span className="font-medium">Email:</span> {user.email}
              </li>
            ))}
          </ul>
        </div>

        {/* Roles list */}
        <div className="border border-gray-500 rounded p-4 bg-gray-50 basis-3/12">
          {!selectedUser ? (
            <p className="text-gray-700 text-center font-bold">Select a User</p>
          ) : (
            <div className="flex flex-col">
              <div className="mb-4">
                <ul>
                  {roles.map((role) => (
                    <li key={role._id}>
                      <label className="flex items-center gap-3 cursor-pointer p-1 hover:bg-gray-100 rounded">
                        <input
                          type="checkbox"
                          value={role._id}
                          checked={selectedRoles.includes(role._id)}
                          onChange={() => handleRoleToggle(role._id)}
                          className="w-4 h-4"
                        />
                        <span>{role.name}</span>
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
                {isUpdating ? "Updating..." : "Update Roles"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
