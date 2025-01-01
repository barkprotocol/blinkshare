import { auth } from "./config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  onAuthStateChanged,
} from "firebase/auth";
import { createUserDocument, getUserDataByEmail } from "./store";

const googleProvider = new GoogleAuthProvider();

// Password validation with detailed conditions
export const validatePassword = (password) => {
  const minLength = password.length >= 6;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);

  return { isValid: minLength && hasNumber && hasSpecial && hasUpper && hasLower };
};

// Sign-up function with enhanced email verification
export const signUp = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Send email verification after sign up
    await sendEmailVerification(userCredential.user, {
      url: window.location.origin + "/login",
      handleCodeInApp: true,
    });

    // Create user document in Firestore
    const { userid, error: storeError } = await createUserDocument(email, displayName);

    if (storeError) {
      throw new Error(storeError);
    }

    return { user: userCredential.user, userid, error: null };
  } catch (error) {
    console.error("Signup error:", error); // Add this for debugging
    return { user: null, userid: null, error: error.message };
  }
};

// Log-in function
export const logIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error("Login error:", error); // For debugging
    return { user: null, error: "Incorrect email or password" }; // Custom message for the user
  }
};

// Log-out function
export const logOut = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    console.error("Logout error:", error); // For debugging
    return { error: error.message };
  }
};

// Reset password function
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error) {
    console.error("Password reset error:", error); // For debugging
    return { error: error.message };
  }
};

// Sign-in with Google function
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    if (!user.emailVerified) {
      throw new Error("Email verification required");
    }

    // Check if the user exists in Firestore
    const { userData } = await getUserDataByEmail(user.email);

    if (!userData) {
      // Create new user document if it doesn't exist
      const { userid, error: storeError } = await createUserDocument(
        user.email,
        user.displayName || "User"
      );

      if (storeError) throw new Error(storeError);
      return { user, userid, error: null };
    }

    return { user, userid: userData.userid, error: null };
  } catch (error) {
    console.error("Google sign-in error:", error); // For debugging
    return { user: null, userid: null, error: error.message };
  }
};

// Resend email verification if not verified
export const resendVerificationEmail = async (user) => {
  try {
    if (!user) throw new Error("No user found");

    await sendEmailVerification(user, {
      url: window.location.origin + "/login",
      handleCodeInApp: true,
    });

    return { error: null };
  } catch (error) {
    console.error("Email verification error:", error);
    return { error: error.message };
  }
};

// Listen for authentication state changes
export const authStateListener = (callback) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is logged in
      callback({ user, isAuthenticated: true });
    } else {
      // User is logged out
      callback({ user: null, isAuthenticated: false });
    }
  });
};
