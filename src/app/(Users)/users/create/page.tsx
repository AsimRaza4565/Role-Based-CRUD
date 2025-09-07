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
    <div className="h-screen flex items-center">
      <form
        onSubmit={handleUserCreate}
        noValidate
        className="flex flex-col gap-3 w-md mx-auto border rounded border-gray-500 px-5 py-3"
      >
        <h2 className="font-medium text-center text-2xl mb-3">
          Create new User
        </h2>

        <div className="flex flex-col gap-1">
          <label htmlFor="username" className="font-medium text-lg">
            Name
          </label>
          <input
            title="User Name"
            type="text"
            id="username"
            placeholder="Enter User's Name"
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

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="font-medium text-lg">
            Email
          </label>
          <input
            title="Email"
            id="email"
            type="email"
            placeholder="Enter Email"
            className="border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && (
            <div className="bg-red-600 text-white w-fit text-sm px-3 py-1 rounded mt-1">
              {emailError}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="font-medium text-lg">
            Password
          </label>

          <div className="relative flex flex-col gap-1">
            <div className="relative flex items-center">
              <input
                title="Password"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                className="border p-2 rounded w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* Eye toggle button */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-gray-600 absolute right-3 flex items-center cursor-pointer"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>{" "}
            </div>

            {passwordError && (
              <div className="bg-red-600 text-white w-fit text-sm px-3 py-1 rounded mt-1">
                {passwordError}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="role" className="font-medium text-lg">
            Role
          </label>
          <select
            title="Role"
            id="role"
            className="border p-2 rounded cursor-pointer"
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
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
          className="p-2 bg-blue-500 hover:bg-blue-600 mt-3 rounded cursor-pointer mb-1"
        >
          Create
        </button>
      </form>
    </div>
  );
}
