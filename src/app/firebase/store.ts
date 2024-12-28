import { app, db } from "./config";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";

// Generate a unique userId
export const generateUserId = (name) => {
  const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, "-");
  const randomString = Math.random().toString(36).substring(2, 8);
  return `${normalizedName}-${randomString}`;
};

// Check if a user exists by userId
export const checkIfUserExists = async (userid) => {
  try {
    const userRef = doc(db, "users", userid); // Using the imported `db`
    const userSnap = await getDoc(userRef);
    return userSnap.exists();
  } catch (error) {
    console.error("Error checking if user exists:", error);
    return false;
  }
};

// Create or update user document in Firestore
export const createUserDocument = async (email, displayName) => {
  try {
    const userid = generateUserId(displayName);

    // Check if the user already exists
    const userExists = await checkIfUserExists(userid);

    if (userExists) {
      return { userid: null, error: "User already exists with this ID" };
    }

    const userRef = doc(db, "users", userid);
    const defaultUserData = {
      userid,
      name: displayName,
      email,
      createdAt: new Date().toISOString(),
      bannerImage:
        "https://www.indianshelf.in/views/themes/template-2022/assets/images/banner.jpg",
      profileImage:
        "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
      superPower: "New Creator",
      about: `${displayName} is a new creator. Welcome to their page!`,
      portfolioUrl: "",
      socialMedia: {
        instagram: "",
        twitter: "",
        youtube: "",
        twitch: "",
        music: "",
      },
      categories: [],
      posts: [],
      supporters: [],
    };

    await setDoc(userRef, defaultUserData);
    return { userid, error: null };
  } catch (error) {
    console.error("Error creating user document:", error);
    return { userid: null, error: error.message };
  }
};

// Fetch user data from Firestore by userId
export const getUserData = async (userid) => {
  try {
    const userRef = doc(db, "users", userid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return { userData: userSnap.data(), error: null };
    } else {
      return { userData: null, error: "User not found" };
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return { userData: null, error: error.message };
  }
};

// Fetch user data from Firestore by email
export const getUserDataByEmail = async (email) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      return { userData, error: null };
    }

    return { userData: null, error: "User not found" };
  } catch (error) {
    console.error("Error fetching user data by email:", error);
    return { userData: null, error: error.message };
  }
};

// Update user data (e.g., after profile edit)
export const updateUserData = async (userid, updateData) => {
  try {
    const userRef = doc(db, "users", userid);
    await updateDoc(userRef, updateData);
    return { success: true, error: null };
  } catch (error) {
    console.error("Error updating user document:", error);
    return { success: false, error: error.message };
  }
};

export { app };