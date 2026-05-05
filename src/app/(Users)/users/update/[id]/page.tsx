"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type RoleOption = { _id: string; name: string; slug: string };

export default function EditUser() {
  const router = useRouter();
  const { id } = useParams();

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

        setName(data.name);
        setEmail(data.email);
        setRole(data.roleId || "");
        // setPassword(data.password);
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Update User Profile
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Modify details and access levels
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          <form onSubmit={handleUserEdit} className="space-y-6" noValidate>
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700">
                Name
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  placeholder="Enter User's Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all"
                />
              </div>
              {nameError && (
                <p className="mt-2 text-sm text-rose-600 font-medium">{nameError}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="text"
                  required
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all bg-slate-50 text-slate-500 cursor-not-allowed"
                  disabled
                />
              </div>
              {emailError && (
                <p className="mt-2 text-sm text-rose-600 font-medium">{emailError}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password <span className="text-slate-400 font-normal">(Leave blank to keep unchanged)</span>
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="text"
                  placeholder="Update Password (Optional)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all"
                />
              </div>
              {passwordError && (
                <p className="mt-2 text-sm text-rose-600 font-medium">{passwordError}</p>
              )}
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-slate-700">
                Role
              </label>
              <div className="mt-1">
                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-white text-slate-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all cursor-pointer"
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              {roleError && (
                <p className="mt-2 text-sm text-rose-600 font-medium">{roleError}</p>
              )}
            </div>

            <div className="pt-2 mb-2">
              <button
                type="submit"
                disabled={!name || !email}
                className="cursor-pointer w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </div>
            
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => router.back()}
                className="cursor-pointer text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
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
