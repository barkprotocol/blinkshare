"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../components/pages/Header";
import { checkAuthStatus } from "../firebase/auth";
import React from "react";

const About: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      const isUserAuthenticated = await checkAuthStatus();
      if (!isUserAuthenticated) {
        router.push("/login");
      } else {
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuthentication();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">About Page</h1>
          <p className="text-gray-600">
            This is a protected page that only authenticated users can access.
          </p>
        </div>
      </div>
    </>
  );
};

export default About;
