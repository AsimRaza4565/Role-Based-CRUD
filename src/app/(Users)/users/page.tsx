"use client";

import Navbar from "@/app/components/Navbar";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface User {
  _id: string;
  name: string;
  email: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (response.ok) {
          const usersData = await response.json();
          setUsers(usersData);
          // console.log("data", usersData);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error while fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/deleteUser/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userId));
        toast.success("User deleted");
        const result = await response.json();

        //Checking if there is not user in DB
        if (result.shouldLogout) {
          toast.success("User deleted");
          await signOut({ callbackUrl: "/" });
          return;
        }
      } else {
        await response.json();
        toast.error("Failed to delete User");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("An error occurred while deleting User");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex px-7">
        <Link href={"/users/create"}>
          <button className="bg-blue-400 hover:bg-blue-500 border w-full p-2 rounded mt-3 mb-1 cursor-pointer">
            Create New User
          </button>
        </Link>
      </div>

      <main className="px-7 items-center my-3">
        <h1 className="text-center text-3xl font-bold mb-5">
          Registered Users
        </h1>

        {users.length === 0 ? (
          <p className="text-center text-gray-600">No users found</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-green-200 border border-gray-500">
                <th className="p-4 text-left border border-gray-500">Name</th>
                <th className="p-4 text-left">Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="bg-gray-100 border border-gray-500"
                >
                  <td className="px-4 py-2 border border-gray-500">
                    {user.name}
                  </td>
                  <td className="px-4 py-2 flex justify-between items-center">
                    {user.email}

                    <div className="flex gap-2">
                      <Link href={`/users/update/${user._id}`}>
                        <button className="bg-yellow-500 text-sm p-2 rounded hover:bg-yellow-600 cursor-pointer text-white">
                          Update
                        </button>
                      </Link>

                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="bg-red-500 text-sm p-2 rounded hover:bg-red-600 cursor-pointer text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </>
  );
}
