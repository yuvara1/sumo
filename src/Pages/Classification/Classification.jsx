"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "../../Components/sidebar/Sidbar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { Tent, User } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "./utils";
import { authService } from "../../services/auth.js"; // Import the auth service

export default function Classification() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Use the service to get the current user
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      console.log(currentUser.picture);
    } else {
      // Optional: if no user is logged in, redirect to the login page
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Profile",
      href: "#",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      onClick: handleLogout, // Add the onClick handler for logout
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "mx-auto flex h-screen w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800 bg:black"
      )}
      style={{ background: "black" }}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? (
              <Tent style={{ color: "white" }} />
            ) : (
              <Tent style={{ color: "white" }} />
            )}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            {user && ( // Render only when user data is available
              <SidebarLink
                key={user.id || user.name} // Add a key to force re-render when user changes
                link={{
                  label: user.name, // Use user's name from cookie
                  href: "#",
                  icon: (
                    <img
                      // src={

                      //   `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      //     user.name || "User"
                      //   )}&background=random`
                      // }
                      src={user.picture}
                      className="h-7 w-7 shrink-0 rounded-full"
                      // It's better to rely on CSS classes for sizing
                      width={50}
                      height={50}
                      alt="Avatar"
                    />
                  ),
                }}
              />
            )}
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard />
    </div>
  );
}
export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        Acet Labs
      </motion.span>
    </a>
  );
};
export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};

// Dummy dashboard component with content
const Dashboard = () => {
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        <div className="flex gap-2">
          {[...new Array(4)].map((i, idx) => (
            <div
              key={"first-array-demo-1" + idx}
              className="h-20 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"
            ></div>
          ))}
        </div>
        <div className="flex flex-1 gap-2">
          {[...new Array(2)].map((i, idx) => (
            <div
              key={"second-array-demo-1" + idx}
              className="h-full w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};
