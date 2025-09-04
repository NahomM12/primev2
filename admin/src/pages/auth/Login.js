import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin } from "../../store/auth/authSlices";

const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { isSuccess } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    dispatch(
      adminLogin({
        email,
        password,
      })
      // .then(navigate("/admin/user-management"))
    );
  };

  // Redirect to sign-up page
  const handleSignUp = () => {
    navigate("/signup"); // Redirect to Signup page
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/admin/user-management");
    }
  }, [isSuccess]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Only Admin Login
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 border border-red-300 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="•••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition duration-200"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center"></div>
      </div>
    </div>
  );
};

export default Login;
