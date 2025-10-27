/* src/services/auth.js */
import { API_CONFIG, STORAGE_KEYS } from "../utils/constants";

// --- Cookie Helper Functions ---
function setCookie(name, value, days = 7) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  // Encode the value to handle special characters in the JSON string
  document.cookie =
    name + "=" + (encodeURIComponent(value) || "") + expires + "; path=/";
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      const value = c.substring(nameEQ.length, c.length);
      // Decode the value before returning
      return decodeURIComponent(value);
    }
  }
  return null;
}

function eraseCookie(name) {
  document.cookie = name + "=; Max-Age=-99999999; path=/;";
}
// --- End of Cookie Helper Functions ---

export const authService = {
  // Local registration
  register: async (userData) => {
    try {
      const { username, email, password } = userData;

      // Simulate API call
      const newUser = {
        id: Date.now(),
        provider: "local",
        username,
        email,
        name: username,
        // Add a dynamically generated picture URL
        picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          username
        )}&background=random`,
        registeredAt: new Date().toISOString(),
        isVerified: false,
      };

      setCookie(STORAGE_KEYS.USER, JSON.stringify(newUser));
      return { success: true, user: newUser };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: error.message };
    }
  },

  // Local login
  login: async (credentials) => {
    try {
      const { username, password } = credentials;

      // Simulate API call
      const user = {
        id: Date.now(),
        provider: "local",
        username,
        email: `${username}@example.com`,
        name: username,
        // Add a dynamically generated picture URL
        picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          username
        )}&background=random`,
        loginAt: new Date().toISOString(),
      };

      setCookie(STORAGE_KEYS.USER, JSON.stringify(user));
      return { success: true, user };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  },

  // GitHub OAuth
  githubAuth: async (code) => {
    try {
      // In a real app, you'd exchange the code for a token
      const githubUser = {
        id: Date.now(),
        provider: "github",
        login: "authenticated_user",
        name: "GitHub Authenticated User",
        email: "user@github.com",
        avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4",
        bio: "Successfully authenticated via GitHub OAuth",
        location: "Global",
        company: "GitHub",
        blog: "https://github.com",
        public_repos: Math.floor(Math.random() * 50) + 5,
        public_gists: Math.floor(Math.random() * 20),
        followers: Math.floor(Math.random() * 200) + 20,
        following: Math.floor(Math.random() * 100) + 10,
        created_at: new Date(
          Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000 * 3
        ).toISOString(),
        updated_at: new Date().toISOString(),
        html_url: "https://github.com/authenticated_user",
        oauth_code: code,
      };

      setCookie(STORAGE_KEYS.USER, JSON.stringify(githubUser));
      return { success: true, user: githubUser };
    } catch (error) {
      console.error("GitHub auth error:", error);
      return { success: false, error: error.message };
    }
  },

  // Google OAuth
  googleAuth: async (credentialOrProfile) => {
    try {
      let googleUser;

      if (typeof credentialOrProfile === "string") {
        // existing behavior: decode JWT credential
        const decoded = JSON.parse(atob(credentialOrProfile.split(".")[1]));
        googleUser = {
          provider: "google",
          id: decoded.sub,
          name: decoded.name,
          email: decoded.email,
          picture: decoded.picture,
          email_verified: decoded.email_verified,
          given_name: decoded.given_name,
          family_name: decoded.family_name,
          locale: decoded.locale,
        };
      } else if (
        credentialOrProfile &&
        typeof credentialOrProfile === "object"
      ) {
        // profile object returned from Google userinfo endpoint
        const p = credentialOrProfile;
        googleUser = {
          provider: "google",
          id: p.sub || p.id || Date.now(),
          name: p.name || `${p.given_name || ""} ${p.family_name || ""}`.trim(),
          email: p.email,
          picture: p.picture || p.photo || null,
          email_verified: p.email_verified ?? true,
          given_name: p.given_name || p.givenName || null,
          family_name: p.family_name || p.familyName || null,
          locale: p.locale || null,
        };
      } else {
        throw new Error("Invalid Google credential/profile");
      }
      console.log(googleUser);
      setCookie(STORAGE_KEYS.USER, JSON.stringify(googleUser));
      return { success: true, user: googleUser };
    } catch (error) {
      console.error("Google auth error:", error);
      return { success: false, error: error.message };
    }
  },

  // Logout
  logout: () => {
    eraseCookie(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN); // Assuming TOKEN is still in localStorage
    return { success: true };
  },

  // Get current user
  getCurrentUser: () => {
    try {
      const userCookie = getCookie(STORAGE_KEYS.USER);
      return userCookie ? JSON.parse(userCookie) : null;
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  },
};
