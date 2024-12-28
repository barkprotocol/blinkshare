"use client";

import { useState, useEffect } from "react";
import { resetPassword } from "../firebase/auth";
import React from "react";

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Focus the email input when the modal opens
      document.getElementById("email-input")?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    const { error: resetError } = await resetPassword(email);

    if (resetError) {
      setError(resetError.message || "Sorry, we couldn't reset your password");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    // Close modal after 3 seconds on success
    setTimeout(() => {
      onClose();
      setEmail("");
      setSuccess(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-lg transform transition-all">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Forgot Password</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 focus:outline-none"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success ? (
          <div className="mb-4 p-2 bg-green-100 text-green-600 rounded-lg text-sm">
            Password reset link has been sent to your email address. Please
            check your inbox.
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-6">
              Enter your email address, and we'll send you a link to reset your
              password.
            </p>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full p-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sand-500"
                required
                aria-label="Email address"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-sand-500 text-white py-3 rounded-lg font-semibold transition duration-300 hover:bg-sand-600 disabled:bg-sand-300"
                aria-label="Send password reset link"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        )}

        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="text-sand-500 hover:underline focus:outline-none"
            aria-label="Cancel password reset"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
