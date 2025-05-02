"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLoginMutation } from "@/features/auth/authApiSlice";
import { setCookie } from "cookies-next";
import Toast from "../../utils/toast";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/features/auth/authSlice";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  // Get the dispatch function at the component level
  const dispatch = useDispatch();
  
  // Using the Redux RTK Query mutation hook
  const [login, { isLoading, error }] = useLoginMutation();
  
  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message || "Login failed. Please try again.");
    }
  }, [error]);

  const validateForm = () => {
    const errors = {};
    
    // Email validation
    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email address is invalid";
    }
    
    // Password validation
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    try {
      // Call the login mutation with credentials
      const result = await login({ email, password }).unwrap();
      if (result.status === true) {
        // Dispatch to Redux store to update auth state
        dispatch(setCredentials({
          user: result.user,
          token: result.token
        }));
        // Set token in cookie
        setCookie('token', result.token, { 
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/' 
        });
        toast.success(`${result.message}`);
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      } else {
        toast.error(`${result.message}`);
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-gray-900">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg  dark:text-white dark:bg-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Welcome Back</h1>
          <p className="text-neutral-600 mt-2 dark:text-gray-400">Login to get or donate blood and save lives</p>
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
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
            )}
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
            {formErrors.password && (
              <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
            )}
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
          <button
            type="submit"
            disabled={isLoading}
            className="button"
          >
            {isLoading ? (
              <>
                <div className="mr-2"></div>
                <span>Logging in...</span>
              </>
            ) : (
              "Sign In"
            )}
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

      {/* Use the reusable Toast component */}
      <Toast />
    </div>
  );
}
