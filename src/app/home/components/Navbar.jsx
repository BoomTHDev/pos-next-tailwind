"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Swal from "sweetalert2";
import { FaRegUser } from "react-icons/fa";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link href="/home" className="text-white text-2xl font-bold hover:text-gray-300">
              WorkShop
            </Link>
            <Link href="/home" className="text-white hover:text-gray-300">
              Home
            </Link>
            <Link href="/contact" className="text-white hover:text-gray-300">
              Contact
            </Link>
          </div>
          <button
            className="text-white focus:outline-none md:hidden"
            onClick={() =>
              document.getElementById("navbar-content").classList.toggle("hidden")
            }
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
          <div
            id="navbar-content"
            className="hidden md:flex md:items-center md:space-x-6"
          >
            <div className="relative">
              {session ? (
                <>
                  <button
                    className="text-white flex items-center focus:outline-none hover:text-gray-300"
                    onClick={() =>
                      document.getElementById("dropdown-content").classList.toggle("hidden")
                    }
                  >
                    <FaRegUser className="mr-2" />
                    {session.user.name}
                  </button>
                  <div
                    id="dropdown-content"
                    className="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10"
                  >
                    <Link href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                      Profile
                    </Link>
                    {session.user.role === "admin" && (
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                      >
                        Dashboard
                      </Link>
                    )}
                    <hr className="my-2" />
                    <button
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                      onClick={() => {
                        Swal.fire({
                          title: "Sign Out",
                          text: "Are you sure you want to sign out?",
                          icon: "question",
                          showCancelButton: true,
                          confirmButtonText: "Sign Out",
                        }).then((willSignOut) => {
                          if (willSignOut.isConfirmed) {
                            signOut({ callbackUrl: "/home" });
                          }
                        });
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <Link href="/signin" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
