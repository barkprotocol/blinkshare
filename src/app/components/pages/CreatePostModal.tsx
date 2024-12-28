import React, { useState, ChangeEvent, FormEvent } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase/config";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    name: string;
  };
  userid: string;
  setPosts: React.Dispatch<React.SetStateAction<Array<{ content: string; timestamp: string; author: string }>>>;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, userData, userid, setPosts }) => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userRef = doc(db, "users", userid);
      const newPost = {
        content,
        timestamp: new Date().toISOString(),
        author: userData.name,
      };

      // Optimistic UI Update
      setPosts((prevPosts) => [...prevPosts, newPost]);

      await updateDoc(userRef, {
        posts: arrayUnion(newPost),
      });

      setContent("");
      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
      setError("There was an error creating your post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
      aria-labelledby="create-post-modal"
      aria-hidden={!isOpen}
    >
      <div className="bg-white rounded-lg max-w-lg w-full p-6">
        <h2 id="create-post-modal" className="text-2xl font-bold mb-4">Create New Post</h2>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={content}
            onChange={handleContentChange}
            className="w-full h-32 p-2 border rounded-lg resize-none"
            placeholder="What's on your mind?"
            required
            aria-describedby="post-content"
          />
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-spin">Loading...</span>
              ) : (
                "Post"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
