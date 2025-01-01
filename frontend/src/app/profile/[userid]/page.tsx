import { getUserData } from '@/app/firebase/store';
import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { app } from '@/app/firebase/store';

type UserData = {
  name: string;
  profileImage?: string;
  bannerImage?: string;
  superPower?: string;
  walletAddress?: string;
  about?: string;
  portfolioUrl?: string;
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    twitch?: string;
    music?: string;
  };
  posts?: Array<{
    title: string;
    timestamp: string;
    content: string;
  }>;
  supporters?: Array<{
    profileImage: string;
    name: string;
    amount: BigInt;
  }>;
};

const ProfilePage = ({ userid }: { userid: string }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Firebase Auth instance
  const auth = getAuth(app);
  const user = auth.currentUser; // Get the current user

  // Fetch user data from an API or database
  const fetchUserData = async () => {
    if (userid) {
      try {
        setLoading(true);
        const { userData: fetchedData, error } = await getUserData(userid);

        if (error) {
          setError(error);
          setUserData(null);
        } else if (fetchedData) {
          // Sort posts by timestamp
          fetchedData.posts?.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

          // Sort supporters by amount (BigInt to number comparison)
          fetchedData.supporters?.sort((a, b) => Number(b.amount) - Number(a.amount));

          setUserData(fetchedData);
          setIsCurrentUser(user?.email === fetchedData.email); // Check if current user is the same as fetched user
        }
      } catch (err) {
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userid]);

  const handleSupportClick = (): void => {
    if (userData?.walletAddress) {
      window.open(
        `https://dial.to/?action=solana-action%3Ahttps%3A%2F%2Fblinkshare.vercel.app%2Fapi%2Factions%2F${userid}&cluster=devnet`,
        '_blank'
      );
    }
  };

  const getRelativeTime = (timestamp: string): string => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) return `${diffInDays}d ago`;
    if (diffInHours > 0) return `${diffInHours}h ago`;
    if (diffInMinutes > 0) return `${diffInMinutes}m ago`;
    return 'just now';
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return <div>User data not found</div>;
  }

  return (
    <div className="profile-page">
      {/* Profile Banner and Image */}
      {userData.bannerImage && (
        <img
          src={userData.bannerImage}
          alt="Banner"
          className="w-full h-48 object-cover rounded-t-lg"
        />
      )}

      <div className="flex items-center gap-4 mt-6">
        {userData.profileImage && (
          <img
            src={userData.profileImage}
            alt="Profile"
            className="w-16 h-16 rounded-full border-2 border-white shadow-md"
          />
        )}
        <div>
          <h2 className="text-2xl font-bold">{userData.name}</h2>
          {userData.superPower && (
            <p className="text-sm text-gray-600">{userData.superPower}</p>
          )}
        </div>
      </div>

      {/* User Bio */}
      {userData.about && <p className="mt-4 text-lg">{userData.about}</p>}

      {/* Portfolio URL */}
      {userData.portfolioUrl && (
        <p className="mt-2 text-sm text-gray-500 hover:underline">
          <a href={userData.portfolioUrl} target="_blank" rel="noopener noreferrer">
            View Portfolio
          </a>
        </p>
      )}

      {/* Social Media Links */}
      {userData.socialMedia && (
        <div className="mt-4 space-x-4">
          {userData.socialMedia.instagram && (
            <a href={`https://instagram.com/${userData.socialMedia.instagram}`} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          )}
          {userData.socialMedia.twitter && (
            <a href={`https://twitter.com/${userData.socialMedia.twitter}`} target="_blank" rel="noopener noreferrer">
              Twitter
            </a>
          )}
          {userData.socialMedia.youtube && (
            <a href={`https://youtube.com/${userData.socialMedia.youtube}`} target="_blank" rel="noopener noreferrer">
              YouTube
            </a>
          )}
        </div>
      )}

      {/* Posts Section */}
      {userData.posts && userData.posts.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Recent Posts</h3>
          <ul className="space-y-4">
            {userData.posts.map((post, index) => (
              <li key={index} className="border-b pb-4">
                <h4 className="font-medium text-lg">{post.title}</h4>
                <p className="text-sm text-gray-600">{getRelativeTime(post.timestamp)}</p>
                <p className="mt-2">{post.content}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Supporters Section */}
      {userData.supporters && userData.supporters.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Supporters</h3>
          <ul className="space-y-4">
            {userData.supporters.map((supporter, index) => (
              <li key={index} className="flex items-center gap-4">
                <img
                  src={supporter.profileImage}
                  alt="Supporter"
                  className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                />
                <div>
                  <p className="font-medium">{supporter.name}</p>
                  <p className="text-sm text-gray-600">
                    {supporter.amount.toString()} SOL
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Support Button */}
      {isCurrentUser && (
        <button
          onClick={handleSupportClick}
          className="mt-6 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Support This User
        </button>
      )}
    </div>
  );
};

export default ProfilePage;
