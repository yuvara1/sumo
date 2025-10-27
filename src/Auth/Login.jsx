"use client";
import React from "react";
import "./Login.css";
import { Label } from "../Components/ui/label";
import { Input } from "../Components/ui/input";
import { cn } from "../utils";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth";

export function SignupFormDemo() {
  const navigate = useNavigate();
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

  // handle local form submit -> call authService.login and navigate on success
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const username = form.username?.value?.trim();
    const password = form.password?.value;

    if (!username || !password) {
      console.warn("Please fill username and password");
      return;
    }

    try {
      const result = await authService.login({ username, password });
      if (result.success) {
        navigate("/", { replace: true });
      } else {
        console.error("Login failed:", result.error);
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  // Google success handler -> fetch profile, persist via authService, then navigate
  const onGoogleSuccess = async (tokenResponse) => {
    try {
      const accessToken =
        tokenResponse?.access_token ||
        tokenResponse?.accessToken ||
        tokenResponse?.credential;
      if (!accessToken) throw new Error("No access token returned from Google");

      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch Google user profile");

      const profile = await res.json();
      const result = await authService.googleAuth(profile);

      if (result.success) {
        navigate("/", { replace: true });
      } else {
        console.error("Google login failed:", result.error);
      }
    } catch (err) {
      console.error("Google onSuccess handler error:", err);
    }
  };

  // simple GitHub flow placeholder (simulate exchange) — navigate on success
  const handleGithubLogin = async () => {
    try {
      // Replace with real OAuth flow; here we simulate an oauth code exchange
      const result = await authService.githubAuth("simulated_code");
      if (result.success) {
        navigate("/", { replace: true });
      } else {
        console.error("GitHub login failed:", result.error);
      }
    } catch (err) {
      console.error("GitHub login error:", err);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: onGoogleSuccess,
    onError: (err) => console.error("Google login error:", err),
    scope: "openid profile email",
  });

  const SocialButton = ({ children, Icon, hoverText, onClick }) => (
    <button
      type="button"
      disabled={hoverText === "Sign in with GitHub"}
      onClick={onClick}
      className="aceternity-btn group relative flex w-full items-center justify-center gap-3 rounded-lg border border-white/20 bg-black px-4 py-2 text-sm text-white transition-colors duration-150 hover:bg-white hover:text-black"
    >
      {Icon && (
        <Icon className="h-5 w-5 text-white transition-colors duration-150 group-hover:text-black" />
      )}

      <span className="aceternity-btn__label">
        <span className="inline-block transition-opacity duration-150 opacity-100 group-hover:opacity-0">
          {children}
        </span>

        {hoverText && (
          <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-150 opacity-0 pointer-events-none group-hover:opacity-100 text-black">
            {hoverText}
          </span>
        )}
      </span>

      <span className="absolute inset-x-4 -bottom-px block h-px w-auto bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 transition" />
    </button>
  );

  return (
    <div className="h-screen flex items-center justify-center p-6 bg-black text-white overflow-hidden">
      <div className="w-full max-w-md rounded-2xl bg-black p-6 shadow-lg backdrop-blur text-white border border-white/10">
        <h2 id="heading" className="text-2xl font-semibold mb-2 text-white">
          Sign in to Sumo
        </h2>
        <p id="sub-heading" className="text-sm text-white/70 mb-4">
          Place to find your AI Agents & More
        </p>

        <div className="space-y-3 mb-4">
          <SocialButton
            Icon={IconBrandGoogle}
            hoverText="Sign in with Google"
            onClick={() => loginWithGoogle()}
          >
            Continue with Google
          </SocialButton>

          <SocialButton
            Icon={IconBrandGithub}
            hoverText="Sign in with GitHub"
            onClick={handleGithubLogin}
          >
            Continue with GitHub
          </SocialButton>
        </div>

        <div className="flex items-center text-sm text-white/60 mb-4">
          <span className="flex-1 h-px bg-white/10" />
          <span className="px-2">or</span>
          <span className="flex-1 h-px bg-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="karikalan@chola.com"
                className="mt-2"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="mt-2"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2 text-white/80">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-white text-white"
              />
              <span>Remember me</span>
            </label>
            <a className="text-white/90 hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="aceternity-btn w-full rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/20 transition"
          >
            <span className="aceternity-btn__label">Sign in</span>
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-white/70">
          New to Sumo?{" "}
          <a className="text-white hover:underline">Create an account</a>
        </div>
      </div>
    </div>
  );
}

export default SignupFormDemo;
