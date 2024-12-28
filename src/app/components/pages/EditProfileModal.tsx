import React, { useState, useEffect, FormEvent } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { X } from "lucide-react";
import { db } from "../../firebase/config";

interface SocialMedia {
  instagram: string;
  twitter: string;
  youtube: string;
  twitch: string;
  music: string;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: any;
  userid: string;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  userData,
  userid,
}) => {
  const [formData, setFormData] = useState({
    bannerImage: "",
    profileImage: "",
    name: "",
    superPower: "",
    about: "",
    portfolioUrl: "",
    walletAddress: "",
    socialMedia: {
      instagram: "",
      twitter: "",
      youtube: "",
      twitch: "",
      music: "",
    },
    categories: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (userData) {
      setFormData({
        bannerImage: userData.bannerImage || "",
        profileImage: userData.profileImage || "",
        name: userData.name || "",
        superPower: userData.superPower || "",
        about: userData.about || "",
        portfolioUrl: userData.portfolioUrl || "",
        walletAddress: userData.walletAddress || "",
        socialMedia: {
          instagram: userData.socialMedia?.instagram || "",
          twitter: userData.socialMedia?.twitter || "",
          youtube: userData.socialMedia?.youtube || "",
          twitch: userData.socialMedia?.twitch || "",
          music: userData.socialMedia?.music || "",
        },
        categories: (userData.categories || []).join(", "),
      });
    }
  }, [userData]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const userRef = doc(db, "users", userid);

      // Validate required fields
      if (
        !formData.bannerImage ||
        !formData.profileImage ||
        !formData.name ||
        !formData.superPower ||
        !formData.about ||
        !formData.portfolioUrl
      ) {
        throw new Error("Please fill in all required fields");
      }

      // Process categories into array
      const categoriesArray = formData.categories
        .split(",")
        .map((cat) => cat.trim())
        .filter((cat) => cat.length > 0);

      if (categoriesArray.length === 0) {
        throw new Error("Please add at least one category");
      }

      // Update document
      await updateDoc(userRef, {
        bannerImage: formData.bannerImage,
        profileImage: formData.profileImage,
        name: formData.name,
        superPower: formData.superPower,
        about: formData.about,
        portfolioUrl: formData.portfolioUrl,
        walletAddress: formData.walletAddress,
        socialMedia: formData.socialMedia,
        categories: categoriesArray,
        updatedAt: new Date().toISOString(),
      });

      onClose();
      window.location.reload();
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Required Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wallet Address *
            </label>
            <input
              type="text"
              required
              value={formData.walletAddress}
              onChange={(e) =>
                setFormData({ ...formData, walletAddress: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-sand focus:border-transparent"
              placeholder="Enter your Solana wallet address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Banner Image URL *
            </label>
            <input
              type="url"
              required
              value={formData.bannerImage}
              onChange={(e) =>
                setFormData({ ...formData, bannerImage: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-sand focus:border-transparent"
              placeholder="https://example.com/banner.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Image URL *
            </label>
            <input
              type="url"
              required
              value={formData.profileImage}
              onChange={(e) =>
                setFormData({ ...formData, profileImage: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-sand focus:border-transparent"
              placeholder="https://example.com/profile.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-sand focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Super Power *
            </label>
            <input
              type="text"
              required
              value={formData.superPower}
              onChange={(e) =>
                setFormData({ ...formData, superPower: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-sand focus:border-transparent"
              placeholder="e.g., Coding Wizard"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              About *
            </label>
            <textarea
              required
              value={formData.about}
              onChange={(e) =>
                setFormData({ ...formData, about: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-sand focus:border-transparent h-32"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Portfolio URL *
            </label>
            <input
              type="url"
              required
              value={formData.portfolioUrl}
              onChange={(e) =>
                setFormData({ ...formData, portfolioUrl: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-sand focus:border-transparent"
              placeholder="https://portfolio.blinkshare.com"
            />
          </div>

          {/* Social Media URLs - Optional */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">
              Social Media Links (Optional)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram
                </label>
                <input
                  type="url"
                  value={formData.socialMedia.instagram}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialMedia: {
                        ...formData.socialMedia,
                        instagram: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-sand focus:border-transparent"
                  placeholder="https://instagram.com/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Twitter
                </label>
                <input
                  type="url"
                  value={formData.socialMedia.twitter}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialMedia: {
                        ...formData.socialMedia,
                        twitter: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-sand focus:border-transparent"
                  placeholder="https://x.com/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  YouTube
                </label>
                <input
                  type="url"
                  value={formData.socialMedia.youtube}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialMedia: {
                        ...formData.socialMedia,
                        youtube: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-sand focus:border-transparent"
                  placeholder="https://youtube.com/channel/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Twitch
                </label>
                <input
                  type="url"
                  value={formData.socialMedia.twitch}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialMedia: {
                        ...formData.socialMedia,
                        twitch: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-sand focus:border-transparent"
                  placeholder="https://twitch.tv/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Music
                </label>
                <input
                  type="url"
                  value={formData.socialMedia.music}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialMedia: {
                        ...formData.socialMedia,
                        music: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-sand focus:border-transparent"
                  placeholder="https://musicplatform.com/username"
                />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categories
            </label>
            <input
              type="text"
              value={formData.categories}
              onChange={(e) =>
                setFormData({ ...formData, categories: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-sand focus:border-transparent"
              placeholder="Enter categories separated by commas"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-sand text-white py-2 px-6 rounded-lg font-semibold disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
