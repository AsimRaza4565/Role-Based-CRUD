"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

type RoleOption = { _id: string; name: string; slug: string };

export default function CreateUesr() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [roles, setRoles] = useState<RoleOption[]>([])
  const [showPassword, setShowPassword] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [roleError, setRoleError] = useState("");

  const router = useRouter();

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
      setPasswordError("");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleUserCreate = async (e) => {
    e.preventDefault();

    // Regex patterns
    const nameRegex = /^[A-Za-z\s]{2,30}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!name) {
      setNameError("Name is required!");
      setEmailError("");
      setPasswordError("");
      setRoleError("");
      return;
    }
    if (!email) {
      setEmailError("Email is required!");
      setNameError("");
      setPasswordError("");
      setRoleError("");

      return;
    }
    if (!password) {
      setPasswordError("Password is required!");
      setNameError("");
      setEmailError("");
      setRoleError("");

      return;
    }

    if (!roleId) {
      setRoleError("Roll is required!");
      setNameError("");
      setEmailError("");
      setPassword("");
      return;
    }

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

    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be 8+ characters with uppercase, lowercase, number & special characters"
      );
      setNameError("");
      setEmailError("");
      return;
    }

    try {
      // Checking if user already exists
      const resUserExixts = await fetch("/api/user-exists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const { user } = await resUserExixts.json();

      if (user) {
        toast.error("User already exists");
        return;
      }

      //Creating User
      const response = await fetch("/api/createUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, roleId }),
      });

      if (response.ok) {
        router.push("/users");
        toast.success("User created");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("An error occurred while creating user");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Create New User
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Add a new member to your organization
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          <form onSubmit={handleUserCreate} className="space-y-6" noValidate>
            
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
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
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
                  type="email"
                  required
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                />
              </div>
              {emailError && (
                <p className="mt-2 text-sm text-rose-600 font-medium">{emailError}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-slate-400 hover:text-slate-500 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
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
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-white text-slate-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all cursor-pointer"
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

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Create Account
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
