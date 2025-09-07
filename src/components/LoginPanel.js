import React, { useState } from "react";
import { motion } from "framer-motion";

const LoginPanel = ({ onClose, onLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    onLogin(formData);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={handleBackdropClick}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Login Panel */}
      <motion.div
        className="relative z-10 w-full max-w-md mx-4"
        initial={{
          scale: 0.8,
          rotateX: -15,
          y: 50,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          rotateX: 0,
          y: 0,
          opacity: 1,
        }}
        exit={{
          scale: 0.8,
          rotateX: 15,
          y: -50,
          opacity: 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 0.5,
        }}
        style={{ perspective: "1000px" }}
      >
        <div className="glass glow rounded-2xl p-8 border border-blue-400/30 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-black/40 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h2
              className="text-3xl font-bold text-white mb-2"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Welcome to Sujith Collab
            </motion.h2>
            <motion.p
              className="text-blue-200/80 text-sm"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Enter your credentials to access the platform
            </motion.p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label
                htmlFor="username"
                className="block text-sm font-medium text-blue-200 mb-2"
              >
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-white/10 border ${
                    errors.username ? "border-red-400" : "border-blue-400/30"
                  } rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300`}
                  placeholder="Enter your username"
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600/10 to-purple-600/10 pointer-events-none opacity-0 transition-opacity duration-300 hover:opacity-100" />
              </div>
              {errors.username && (
                <motion.p
                  className="text-red-400 text-sm mt-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.username}
                </motion.p>
              )}
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <label
                htmlFor="password"
                className="block text-sm font-medium text-blue-200 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-white/10 border ${
                    errors.password ? "border-red-400" : "border-blue-400/30"
                  } rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300`}
                  placeholder="Enter your password"
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600/10 to-purple-600/10 pointer-events-none opacity-0 transition-opacity duration-300 hover:opacity-100" />
              </div>
              {errors.password && (
                <motion.p
                  className="text-red-400 text-sm mt-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.password}
                </motion.p>
              )}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex gap-4 pt-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white font-medium hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 border border-blue-400/30 rounded-lg text-white font-medium hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed btn-hover"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Logging in...
                  </div>
                ) : (
                  "Login"
                )}
              </button>
            </motion.div>
          </form>

          {/* Additional Links */}
          <motion.div
            className="mt-6 text-center space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {" "}
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a
              href="#"
              className="text-blue-300 hover:text-blue-200 text-sm transition-colors duration-300"
              onClick={(e) => e.preventDefault()}
            >
              Forgot your password?
            </a>
            <p className="text-white/50 text-xs">
              Don't have an account?{" "}
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a
                href="#"
                className="text-blue-300 hover:text-blue-200 ml-1 transition-colors duration-300"
                onClick={(e) => e.preventDefault()}
              >
                Sign up
              </a>
            </p>
          </motion.div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-300"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoginPanel;
