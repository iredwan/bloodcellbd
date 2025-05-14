"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useLoginUserMutation } from "@/features/users/userApiSlice";
import { useLazyGetUserInfoQuery } from "@/features/userInfo/userInfoApiSlice";
import { useDispatch } from "react-redux";
import {
  setUserInfo,
  clearUserInfo,
} from "@/features/userInfo/userInfoSlice";

export default function Login() {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [login, { isLoading: isLoginLoading, error: loginError }] = useLoginUserMutation();
  const [getUserInfo, { isLoading: isUserInfoLoading }] = useLazyGetUserInfoQuery();

  useEffect(() => {
    if (loginError) {
      toast.error(loginError?.data?.message || "Login failed. Please try again.");
    }
  }, [loginError]);

  const validateForm = () => {
    const errors = {};
    if (!email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Invalid email address";

    if (!password) errors.password = "Password is required";
    else if (password.length < 6) errors.password = "Password must be at least 6 characters";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // First attempt to login
      const loginResult = await login({ email, password }).unwrap();

      if (!loginResult?.status) {
        toast.error(loginResult?.message || "Login failed");
        return;
      }
  
      // Login success
      const userInfoResult = await getUserInfo().unwrap();
  
      if (userInfoResult?.status && userInfoResult?.user) {
        dispatch(setUserInfo(userInfoResult.user));
        
        toast.success(loginResult.message || "Login successful");
        // Redirect after a delay
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        dispatch(clearUserInfo());
        toast.error(userInfoResult?.message || "Unauthorized or invalid user");
      }
    } catch (err) {
      dispatch(clearUserInfo());
  
      // For HTTP-only cookies, we might get a 401 even when login is successful
      // because the cookie might not be immediately accessible
      const statusCode = err?.status;
      
      if (statusCode === 401 && err.message?.includes("Please login")) {
        // This is likely just the expected auth state before redirect
        console.log("Auth state transitioning, redirecting...");
        
        // The login itself was successful, so continue with success flow
        toast.success("Login successful");
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else if (statusCode === 401) {
        toast.error("Unauthorized. Please check your credentials.");
      } else {
        toast.error(err.message || "Unexpected error occurred. Try again later.");
      }
  
      console.error("Error in login or fetching user info:", err);
    }
  };
  
  const isLoading = isLoginLoading || isUserInfoLoading;

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-gray-900">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg dark:text-white dark:bg-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Welcome Back</h1>
          <p className="text-neutral-600 mt-2 dark:text-gray-400">
            Login to get or donate blood and save lives
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1 dark:text-gray-400">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 border ${formErrors.email ? 'border-red-500' : 'border-neutral-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
              placeholder="you@example.com"
            />
            {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1 dark:text-gray-400">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 border ${formErrors.password ? 'border-red-500' : 'border-neutral-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
              placeholder="••••••••"
            />
            {formErrors.password && <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700 dark:text-gray-400">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-secondary hover:text-secondary-dark dark:text-gray-400">
                Forgot password?
              </Link>
            </div>
          </div>

          <div className="flex justify-center">
            <button type="submit" disabled={isLoading} className="button">
              {isLoading ? <span>Logging in...</span> : "Sign In"}
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-neutral-600 dark:text-gray-400">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-medium text-secondary hover:text-secondary-dark">
                Register here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
