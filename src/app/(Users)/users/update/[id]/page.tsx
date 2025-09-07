"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type RoleOption = { _id: string; name: string; slug: string };

export default function EditUser() {
  const router = useRouter();
  const { id } = useParams();
  // console.log("id", id);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [roleError, setRoleError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/roles");
        if (!res.ok) throw new Error("Can't load roles");
        const data: RoleOption[] = await res.json();
        setRoles(data);
      } catch (err) {
        console.error(err);
        setRoleError("Can't load roles");
      }
    })();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      const res = await fetch(`/api/users/${id}`);
      if (res.ok) {
        const data = await res.json();
        // console.log("data", data);

        setName(data.name);
        setEmail(data.email);
        setRole(data.roleId || "");
        // setPassword(data.password);
        // console.log("name", name);
        // console.log("Email", email);
        // console.log("Password", password);
      }
    }
    fetchData();
  }, [id]);

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("Invalid email format");
      return false;
    }

    // Setting Email domains
    const allowedDomains = [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "hotmail.com",
      "icloud.com",
      "revnix.com",
    ];

    const domain = value.split("@")[1];
    if (!allowedDomains.includes(domain)) {
      setEmailError("Email domain is invalid!");
      setNameError("");
      setRoleError("");
      setPasswordError("");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleUserEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    //Regix patterns
    const nameRegex = /^[A-Za-z\s]{2,30}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Validating email
    if (!validateEmail(email)) return;

    if (!nameRegex.test(name)) {
      setNameError(
        "Name must be 2-30 characters and only contain letters/spaces"
      );
      setEmailError("");
      setPasswordError("");
      return;
    }

    if (password) {
      if (!passwordRegex.test(password)) {
        setPasswordError(
          "Password must be 8+ characters with uppercase, lowercase, number & special characters"
        );
        setNameError("");
        setEmailError("");
        return;
      }
    }

    try {
      const response = await fetch(`/api/updateUser/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          email: email,
          ...(password && { password }), //Only including when entered
          roleId: role,
          // id,
        }),
      });

      if (response.ok) {
        toast.success("User updated");
        router.back();
      } else {
        toast.error("Failed to update user");
      }
    } catch {
      toast.error("An error occurred while updating user");
    }
  };

  return (
    <div className="h-screen flex items-center">
      <form
        onSubmit={handleUserEdit}
        className="flex flex-col gap-3 w-md mx-auto border rounded border-gray-500 px-5 py-5"
      >
        <h2 className="font-medium text-center text-2xl">
          Update User Information
        </h2>
        <hr />
        <div className="flex flex-col">
          <label className="font-medium mt-3 mb-2">Name</label>
          <input
            type="text"
            title="Name"
            className="border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {nameError && (
            <div className="bg-red-600 text-white w-fit text-sm px-3 py-1 rounded mt-1">
              {nameError}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <label className="font-medium mb-2">Email</label>
          <input
            title="Email"
            type="text"
            className="border p-2 rounded"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          {emailError && (
            <div className="bg-red-600 text-white w-fit text-sm px-3 py-1 rounded mt-1">
              {emailError}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <label className="font-medium mb-2">Password</label>
          <input
            title="Password"
            type="text"
            className="border p-2 rounded"
            placeholder="Encypted"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          {passwordError && (
            <div className="bg-red-600 text-white w-fit text-sm px-3 py-1 rounded mt-1">
              {passwordError}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="role" className="font-medium text-lg">
            Role
          </label>
          <select
            title="Role"
            id="role"
            className="border p-2 rounded cursor-pointer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select a role</option>
            {roles.map((role) => (
              <option key={role._id} value={role._id}>
                {role.name}
              </option>
            ))}
          </select>

          {roleError && (
            <div className="bg-red-600 text-white w-fit text-sm px-3 py-1 rounded mt-1">
              {roleError}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!name || !email}
          className="p-2 bg-yellow-500 hover:bg-yellow-600 rounded cursor-pointer mt-3"
        >
          Update
        </button>
      </form>
    </div>
  );
}
