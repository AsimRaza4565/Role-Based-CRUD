"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react"; //icon library

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const router = useRouter();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Regex patterns
    const nameRegex = /^[A-Za-z\s]{2,30}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!name) {
      setNameError("Name is required!");
      setEmailError("");
      setPasswordError("");
      return;
    }
    if (!email) {
      setEmailError("Email is required!");
      setNameError("");
      setPasswordError("");
      return;
    }
    if (!password) {
      setPasswordError("Password is required!");
      setNameError("");
      setEmailError("");
      return;
    }

    // Validating email
    if (!validateEmail(email)) return;

    // Validation checks
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
      const resUserExixts = await fetch("api/user-exists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const { user } = await resUserExixts.json();

      if (user) {
        toast.error("User already exists");
        return;
      }

      // Inserting data
      const res = await fetch("api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        const form = e.target;
        form.reset();
        router.push("/");
        toast.success("Successfully Registered");
      } else {
        console.log("Registration failed!");
      }
    } catch (error) {
      console.log("Error during registration: ", error);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-sm rounded-lg p-6 border-1 flex flex-col gap-3 bg-green-200 shadow-lg shadow-gray-300"
      >
        <h1 className="text-2xl font-semibold text-center">Welcome!</h1>

        <div className="flex flex-col gap-1">
          <label className="block font-medium">Name</label>
          <input
            title="name"
            type="name"
            placeholder="Enter your Name"
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border px-3 py-2 bg-amber-50"
          />
          {nameError && (
            <div className="bg-red-600 text-white w-fit text-sm px-3 py-1 rounded mt-1">
              {nameError}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="block font-medium">Email</label>
          <input
            title="email"
            type="email"
            placeholder="Enter your Email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="w-full rounded border px-3 py-2 bg-amber-50"
          />
          {emailError && (
            <div className="bg-red-600 text-white w-fit text-sm px-3 py-1 rounded mt-1">
              {emailError}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="block font-medium">Password</label>

          <div className="relative flex items-center">
            <input
              title="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border px-3 py-2 bg-amber-50"
            />
            {/* Eye toggle button */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-gray-600 absolute right-3 flex items-center"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          {passwordError && (
            <div className="bg-red-600 text-white w-fit text-sm px-3 py-1 rounded mt-1">
              {passwordError}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="text-white rounded-sm px-2 py-1 font-medium mt-4 cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
        >
          Register
        </button>

        <div className="text-sm mt-3 text-right">
          Already have an account?&nbsp;
          <Link
            className=" text-blue-600 underline hover:no-underline"
            href={"/"}
          >
            <b>Login</b>
          </Link>
        </div>
      </form>
    </main>
  );
}
