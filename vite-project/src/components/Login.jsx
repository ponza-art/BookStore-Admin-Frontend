import React, { useState, useEffect } from "react";
import { login } from "../services/auth"; // Assuming this is your login service
import { useNavigate } from "react-router-dom";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  // Check if user is already logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Assume the user is already authenticated
      navigate("/admin");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear any previous error
    setIsLoading(true); // Show loading indicator
  
    try {
      const response = await login(email, password);
  
      // Debugging login response
      console.log("Login Response:", response);
  
      if (response && response.data) {
        // Store token in localStorage
        localStorage.setItem("token", response.data.user.token);
        onLoginSuccess(response.data.user); // Call the login success function
  
        // Check if the user is an admin
        if (response.data.user.isAdmin) {
          // Redirect to admin panel if user is an admin
          navigate("/admin");
        } else {
          // If user is not an admin, show an error message
          setError("Access denied. You are not an admin.");
        }
      } else {
        setError("Unexpected response format.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false); // Hide loading indicator after login attempt
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        
        {/* Error Message */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input input-bordered w-full"
          />
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input input-bordered w-full"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
