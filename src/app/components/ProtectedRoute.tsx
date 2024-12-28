import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { getUserDataByEmail } from "../firebase/store";
import EmailVerificationNotice from "./EmailVerificationNotice";
import React from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireVerification?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireVerification = true }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const redirectUser = async () => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const { userData } = await getUserDataByEmail(user.email);
        if (userData?.userid) {
          router.push(`/profile/${userData.userid}`);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    redirectUser();
  }, [user, router]);

  if (loading) {
    return <div>Loading...</div>; // A simple loading message or spinner
  }

  if (!user) {
    return null; // Don't render children if user is not authenticated
  }

  return (
    <>
      {children}
      {requireVerification && user?.emailVerified && <EmailVerificationNotice currentProfileUserid={user?.uid} />}
    </>
  );
};

export default ProtectedRoute;
