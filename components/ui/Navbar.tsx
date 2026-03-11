"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Button from "./Button";
import Cookies from "js-cookie";
import { authService } from "@/lib/services/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";

const AuthLinks = ({ handleLogout }: { handleLogout: () => void }) => (
  <>
    <Link href={"/dashboard"} className="text-gray-700 hover:text-primary">
      Dashboard
    </Link>
    <Link href={"/profile"} className="text-gray-700 hover:text-primary">
      Profile
    </Link>
    <button
      onClick={handleLogout}
      className="text-secondary bg-primary p-2 rounded-full "
    >
      <LogOut size={18} />
    </button>
  </>
);

const GuestLinks = () => (
  <>
    <Link href={"/login"} className="text-gray-700 hover:text-primary">
      Login
    </Link>

    <Button type="button" className="hover:animate-pulse">
      <Link href={"/register"} className="">
        Sign Up
      </Link>
    </Button>
  </>
);
const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { loggedIn, setLoggedIn } = useAuthStore();

  const handleLogout = async () => {
    Cookies.remove("access_token");
    setLoggedIn(false);
    const res = await authService.logout();
    toast.success(res.data.message);
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-md border-b px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href={"/"} className="text-xl font-bold text-gray-800">
          <div className="relative  md:h-12 md:w-48 h-10 w-32 flex items-start text-gray-800 dark:text-zinc-100">
            <Image
              src="/TaskPulse.png"
              alt="TaskPulse Logo"
              fill
              className="h-auto w-auto object-contain object-left"
            />
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center font-semibold text-sm ">
          <Link href={"/"} className="text-gray-700 hover:text-gray-600">
            Home
          </Link>

          {loggedIn ? (
            <AuthLinks handleLogout={handleLogout} />
          ) : (
            <GuestLinks />
          )}
        </div>

        {/* Mobile Menu Button*/}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-800 focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-2 space-y-2 pb-4 font-semibold">
          <Link href={"/"} className="block text-gray-700 hover:text-gray-600">
            Home
          </Link>

          {loggedIn ? (
            <>
              <Link
                href={"/dashboard"}
                className="block text-gray-700 hover:text-gray-600"
              >
                Dashboard
              </Link>
              <Link
                href={"/profile"}
                className="block text-gray-700 hover:text-gray-600"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-secondary bg-primary p-2 rounded-full "
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link
                href={"/login"}
                className="block text-gray-700 hover:text-gray-600"
              >
                Login
              </Link>
              <Link
                href={"/register"}
                className="block text-gray-700 hover:text-gray-600"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
