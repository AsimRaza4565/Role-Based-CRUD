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

        if (permissions.includes("post-read")) {
          router.push("/posts");
        } else if (permissions.includes("event-read")) {
          router.push("/events");
        } else if (permissions.includes("user-read")) {
          router.push("/users");
        } else if (
          permissions.includes("role-read") ||
          permissions.includes("role-create") ||
          permissions.includes("role-update") ||
          permissions.includes("role-delete") ||
          roles.includes("roles-manager")
        ) {
          router.push("/roles");
        } else if (
          permissions.includes("permission-read") ||
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
      console.error("Error:", error);
      toast.error("Something went wrong while signup");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Or{" "}
          <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            register for a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your Email"
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
                  autoComplete="current-password"
                  required
                  placeholder="Enter your Password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-slate-400 hover:text-slate-500 focus:outline-none cursor-pointer"
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
              <button
                type="submit"
                className="cursor-pointer w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
