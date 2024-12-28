"use client";

import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { logOut } from "../../firebase/auth";
import { getUserDataByEmail } from "../../firebase/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import React from "react";

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<any>(null);

  // Fetch user profile when the user is logged in
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.email) {
        try {
          const { userData } = await getUserDataByEmail(user.email);
          if (userData?.userid) {
            setUserProfile(userData);
          } else {
            console.warn("User data not found or incomplete");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  // Handle user sign-out
  const handleSignOut = async () => {
    try {
      const { error } = await logOut();
      if (!error) {
        router.push("/");
      } else {
        console.error("Error signing out:", error);
      }
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white bg-opacity-20 backdrop-blur-md py-4 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6">
        {/* Logo with Icon before Text */}
        <div className="flex items-center space-x-2">
          <Link href="/" aria-label="BlinkShare Home" className="hover:text-gray-600 flex items-center">
            <img
              src="https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp"
              alt="BlinkShare Logo"
              className="h-8 w-auto"
            />
            <span className="text-gray-900 text-2xl font-bold ml-2">Blink</span>
            <span className="text-black text-2xl font-light ml-1">Share</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          <Link
            href="/#how-it-works"
            className="text-black font-bold hover:text-gray-900"
          >
            How it Works
          </Link>

          {/* Conditionally render login/sign-up or user profile and sign-out */}
          {!user ? (
            <>
              <Link
                href="/login"
                className="text-black font-bold hover:text-gray-900"
              >
                Login
              </Link>
              <Link href="/signup">
                <button className="inline-block bg-black text-white text-sm font-semibold py-2 px-4 rounded-md hover:bg-gray-800 transition duration-300 ml-6">
                  Sign up free
                </button>
              </Link>
            </>
          ) : (
            <>
              {userProfile && (
                <Link
                  href={`/profile/${userProfile.userid}`}
                  className="text-black font-bold hover:text-gray-900"
                >
                  My Profile
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="inline-block bg-black text-white text-sm font-semibold py-2 px-4 rounded-xl hover:bg-gray-800 transition duration-300"
              >
                Sign out
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
