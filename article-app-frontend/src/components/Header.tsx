import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { logout, getUser } from "../api/auth";
import { Bookmark, Home } from "lucide-react";

interface User {
  username: string;
  avatar: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  function checkAuth() {
    const userData = getUser();
    setUser(userData);
  }

  useEffect(() => {
    checkAuth();
    window.addEventListener("authChange", checkAuth);
    return () => window.removeEventListener("authChange", checkAuth);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    setUser(null);
    setDropdownOpen(false);
    window.dispatchEvent(new Event("authChange"));
    navigate("/");
  }

  return (
    <header className="flex justify-between items-center py-6 px-4 bg-[#272729] text-white shadow-md relative">
      <Link
        to="/"
        className="text-2xl font-extrabold tracking-widest flex space-x-1 pl-2"
      >
        <span className="text-white">Kondor</span>
        <span className="text-[#FACF16]">Post.</span>
      </Link>

      <div className="flex items-center gap-4 pr-2">
        <Link
          to="/"
          className="p-2 hover:text-white transition group cursor-pointer"
          aria-label="Home"
        >
          <Home
            size={22}
            className="stroke-current group-hover:fill-white transition"
          />
        </Link>

        <button
          className="p-2 hover:text-white transition group cursor-pointer"
          aria-label="Bookmarks"
        >
          <Bookmark
            size={22}
            className="stroke-current group-hover:fill-white transition"
          />
        </button>

        <nav className="relative" ref={dropdownRef}>
          {user ? (
            <>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="Account menu"
                className="cursor-pointer"
              >
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-10">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link
              to="/login"
              state={{ from: location }}
              className="bg-[#FACF16] text-black px-4 py-2 hover:brightness-110 transition cursor-pointer"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
