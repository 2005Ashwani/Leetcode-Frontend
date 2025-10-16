import { useForm } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axiosClient from "../utils/axiosClient";

export default function SignAsAdmin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isloading, setIsLoading] = useState(false);

  // Destructure reset to clear the form later
  const { register, handleSubmit, reset } = useForm();

  // Handle form submit
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const res = await axiosClient.post(`/auth/admin/register`, data);
      console.log("Response:", res.data);
      alert("Admin Registered Successfully!");
      reset(); // Clears all form fields after successful submission
    } catch (error) {
      console.log(error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-200 p-4">
      {isloading === true ? (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center z-50">
          <div className="w-14 h-14 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-purple-300 animate-pulse">
            Registering Admin...
          </p>
        </div>
      ) : (
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-sm w-full border border-purple-600">
          <h2 className="text-2xl font-bold text-center mb-6 text-white">
            Admin Sign Up
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <input
              {...register("firstName")}
              type="text"
              placeholder="Enter First Name"
              className="w-full p-3 bg-gray-700 border border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 transition-colors"
            />

            <input
              {...register("lastName")}
              type="text"
              placeholder="Enter Last Name"
              className="w-full p-3 bg-gray-700 border border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 transition-colors"
            />

            <input
              {...register("email")}
              type="email"
              placeholder="Enter Email"
              className="w-full p-3 bg-gray-700 border border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 transition-colors"
            />

            <input
              {...register("age")}
              type="Number"
              placeholder="Enter Age"
              className="w-full p-3 bg-gray-700 border border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 transition-colors"
            />

            <input
              {...register("role")}
              type="text"
              placeholder="Enter Role"
              className="w-full p-3 bg-gray-700 border border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 transition-colors"
            />

            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="********"
                className="w-full p-3 bg-gray-700 border border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 pr-10 transition-colors"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-md transition duration-300 transform hover:scale-105"
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
