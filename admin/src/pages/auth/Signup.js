import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { adminRegister } from "../../store/auth/authSlices";
import axios from "axios";

const Signup = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState("admin");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate(); // For navigation

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const data = {
      name,
      email,
      password,
    };
    try {
      dispatch(adminRegister(data))
        .unwrap()
        .then(() => {
          navigate("/login");
        });
    } catch (error) {
      setError("Signup failed. Please try again.");
      console.error(error);
    }
  };

  const redirectToLogin = () => {
    // Redirect to the login page with a state to open Manager Login
    navigate("/login", { state: { isManager: true } });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left section: Illustration/Message */}
      <div className="w-1/2 bg-gray-100 flex justify-center items-center p-8">
        <div>
          <h1 className="text-3xl font-semibold text-purple-600 mb-4">
            Admin sign up
          </h1>
          <p className="text-gray-500"></p>
        </div>
      </div>

      {/* Right section: Signup Form */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-white p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Sign up</h2>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-gray-700">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Full name"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Email Address"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Password"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Confirm Password"
                required
              />
            </div>

            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition duration-200"
            >
              Create Account
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Already a user?{" "}
              <button
                onClick={redirectToLogin} // Navigate to the login page with Manager mode
                className="text-purple-600 hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
