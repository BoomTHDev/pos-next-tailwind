"use client";

import { useState, useEffect } from "react";
import {
  FaClipboardList,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaPen,
  FaHouseUser
} from "react-icons/fa";
import Link from "next/link";
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Swal from "sweetalert2";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/home')
    }
  }, [status, router])

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };


  return (
    status === "authenticated" &&
    session.user && (
      <div
      className={`bg-gray-800 text-white h-screen ${
        isOpen ? "w-64" : "w-20"
      } transition-all duration-300 flex flex-col`}
    >
      <div className="p-4 flex justify-between items-center">
        <h1 className={`${isOpen ? "block" : "hidden"} text-xl`}>Admin</h1>
        <button onClick={toggleSidebar} className="focus:outline-none">
          <FaBars />
        </button>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <ul>
          <li className="py-2 flex items-center hover:bg-gray-700 rounded-md px-2">
            <FaClipboardList />
            <Link
              className={`${isOpen ? "block" : "hidden"} ml-2`}
              href="/dashboard/product"
            >
              Product Manage
            </Link>
          </li>
          <li className="py-2 flex items-center hover:bg-gray-700 rounded-md px-2">
            <FaUser />
            <Link
              className={`${isOpen ? "block" : "hidden"} ml-2`}
              href="/dashboard/user"
            >
              User Manage
            </Link>
          </li>
          <li className="py-2 flex items-center hover:bg-gray-700 rounded-md px-2">
            <FaPen />
            <Link
              className={`${isOpen ? "block" : "hidden"} ml-2`}
              href="/dashboard/webedit"
            >
              Web Manage
            </Link>
          </li>
          <li className="py-2 flex items-center hover:bg-gray-700 rounded-md px-2">
            <FaSignOutAlt />
            <button
              className={`${isOpen ? "block" : "hidden"} ml-2`}
              onClick={() => {
                Swal.fire({
                  title: "Sign Out",
                  text: "You want ot sign out?",
                  icon: "question",
                  showCancelButton: true,
                  showConfirmButton: true,
                  confirmButtonText: "Yes! Do it.",
                  cancelButtonText: "No! Cancel it.",
                  dangerMode: true
                }).then((click) => {
                  if (click.isConfirmed) {
                    signOut({ callbackUrl: '/signin'})
                  }
                })
              }}>Logout</button>
          </li>
          <li className="py-2 flex items-center hover:bg-gray-700 rounded-md px-2">
            <FaHouseUser />
            <Link
              className={`${isOpen ? "block" : "hidden"} ml-2`}
              href="/home"
            >
              Go to home page
            </Link>
          </li>
        </ul>
      </div>
    </div>
    )
  );
}
