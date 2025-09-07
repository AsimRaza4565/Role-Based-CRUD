"use client";

import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react"; //icon library

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!email) {
      setEmailError("Email is required!");
      setPasswordError("");
      return;
    }
    if (!password) {
      setPasswordError("Password is required!");
      setEmailError("");
      return;
    }

    // Validation checks
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email format");
      setPasswordError("");
      return;
    }

    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be 8+ characters with uppercase, lowercase, number & special characters"
      );
      setEmailError("");
      return;
    }

    try {
      const res = await signIn("credentials", {
        //credentials is the name of credentails provider
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        if (res.error === "Invalid Email") {
          setEmailError("Email not Registered");
          setPasswordError("");
        } else if (res.error === "Invalid Password") {
          setPasswordError("Invalid Password");
          setEmailError("");
        }
      } else {
        setEmailError("");
        setPasswordError("");

        const session = await getSession();
        const roles = session?.user?.roles || [];
        const permissions = session?.user?.permissions || [];
        // console.log("roles", roles);
        // console.log("permissions", permissions);

        if (permissions.includes("post-read")) {
          router.push("/posts");
        } else if (permissions.includes("event-read")) {
          router.push("/events");
        } else if (
          permissions.includes("role-create") ||
          permissions.includes("role-update") ||
          permissions.includes("role-delete") ||
          roles.includes("roles-manager")
        ) {
          router.push("/roles");
        } else if (
          permissions.includes("permission-create") ||
          permissions.includes("permission-update") ||
          permissions.includes("permission-delete") ||
          roles.includes("permissions-manager")
        ) {
          router.push("/permissions");
        } else {
          // fallback if nothing matches
          router.push("/");
          toast.warn("You don't have access to any resource");
        }

        toast.success("Logged In");
      }
      // setError(res.error); // displaying API message
    } catch (error) {
      console.log("Error:", error);
      toast.error("Something went wrong while signup");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-sm rounded-lg p-6 border-1 flex flex-col gap-3 bg-green-200 shadow-lg shadow-gray-300"
      >
        <h1 className="text-2xl font-semibold text-center">Welcome!</h1>

        <div className="flex flex-col gap-1">
          <label className="block font-medium">Email</label>
          <input
            title="email"
            type="email"
            placeholder="Enter your Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border px-3 py-2 bg-amber-50"
          />
          {emailError && (
            <div className="bg-red-600 text-white w-fit text-sm px-3 py-1 rounded mt-1">
              <b>{emailError}</b>
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
              <b>{passwordError}</b>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="text-white rounded-sm px-2 py-1 font-medium mt-4 cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
        >
          Login
        </button>

        <div className="text-sm mt-3 text-right">
          <span>Don&apos;t have an account?&nbsp;</span>
          <Link
            className="text-blue-600 underline hover:no-underline"
            href={"/register"}
          >
            <b>Register</b>
          </Link>
        </div>
      </form>
    </main>
  );
}
