"use client"

import { useState, useEffect } from "react"
import { Link, NavLink } from "react-router-dom"
import { Menu, X, ArrowUpRight } from "lucide-react"
import { useFirebase } from "../Context/FirebaseContext"
import AvatarCom from "./AvatarCom"

const Navbar = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user } = useFirebase()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen)
  }

  return (
    <header
      className={` px-14 sticky top-0 z-50 w-full transition-colors duration-300 ${isScrolled ? "bg-black/70 backdrop-blur-sm" : " bg-gradient-to-b from-zinc-900 via-black to-zinc-900"}`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/red.svg" className="h-8 w-10" alt=" Logo" />
            <span className="text-2xl font-bold text-zinc-100 font-heading">CollabCode</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-lg font-medium ${isActive ? "text-zinc-100" : "text-zinc-400"} hover:text-zinc-100 transition-colors`
              }
            >
              Home
            </NavLink>
            {/* <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? "text-zinc-100" : "text-zinc-400"} hover:text-zinc-100 transition-colors`
              }
            >
              How to use
            </NavLink> */}
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `text-lg font-medium ${isActive ? "text-zinc-100" : "text-zinc-400"} hover:text-zinc-100 transition-colors`
              }
            >
              Get Started
            </NavLink>
          </div>

          <div className="flex items-center space-x-8">
            {user ? (
              <AvatarCom />
            ) : (
              <>
                <Link to="/signin" className="text-sm font-medium text-zinc-100 hover:text-zinc-200 transition-colors">
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="group relative px-4 py-2 text-sm font-medium text-black bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors"
                >
                  Sign Up
                  <ArrowUpRight className="inline-block ml-1 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              </>
            )}
            <button onClick={toggleMobileNav} className="md:hidden text-zinc-100 hover:text-zinc-200 transition-colors">
              {isMobileNavOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation */}
      {isMobileNavOpen && (
        <div className="md:hidden bg-zinc-900 border-t border-zinc-800">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block text-sm font-medium ${isActive ? "text-zinc-100" : "text-zinc-400"} hover:text-zinc-100 transition-colors`
              }
              onClick={toggleMobileNav}
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `block text-sm font-medium ${isActive ? "text-zinc-100" : "text-zinc-400"} hover:text-zinc-100 transition-colors`
              }
              onClick={toggleMobileNav}
            >
              How to use
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `block text-sm font-medium ${isActive ? "text-zinc-100" : "text-zinc-400"} hover:text-zinc-100 transition-colors`
              }
              onClick={toggleMobileNav}
            >
              Get Started
            </NavLink>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar

