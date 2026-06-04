"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Search,
  Menu,
  X,
  Phone,
  User,
  LogOut,
  PlusSquare,
  ChevronDown,
  Home,
  Shield,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const NAV_LINKS = [
  { label: "Phòng trọ", href: "/rooms?type=room" },
  { label: "Nhà nguyên căn", href: "/rooms?type=house" },
  { label: "Căn hộ mini", href: "/rooms?type=apartment" },
  { label: "Ký túc xá", href: "/rooms?type=dormitory" },
];

export default function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Đóng user menu khi click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/rooms?search=${encodeURIComponent(searchValue.trim())}`);
      setMobileOpen(false);
    }
  }

  async function handleLogout() {
    setUserMenuOpen(false);
    await logout();
  }

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      {/* ── Top bar ── */}
      <div className="bg-orange-500 text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-8">
          <a
            href="tel:0909316890"
            className="flex items-center gap-1 hover:underline"
          >
            <Phone size={12} />
            Hotline: <span className="font-semibold ml-1">0909 316 890</span>
          </a>

          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-1.5 hover:underline"
                >
                  {user.avatar_url &&
                  (user.avatar_url.startsWith("http") ||
                    user.avatar_url.startsWith("/")) ? (
                    <Image
                      src={user.avatar_url}
                      alt={user.name}
                      width={20}
                      height={20}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <User size={13} />
                  )}
                  <span className="max-w-[140px] truncate">{user.name}</span>
                  <ChevronDown size={11} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-7 w-48 bg-white text-gray-700 rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      <User size={14} /> Hồ sơ của tôi
                    </Link>
                    {(user.role === "owner" || user.role === "admin") && (
                      <Link
                        href="/my-rooms"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        <Home size={14} /> Phòng của tôi
                      </Link>
                    )}
                    {user.role === "admin" && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 text-orange-600 font-semibold"
                      >
                        <Shield size={14} /> Trang quản trị
                      </Link>
                    )}
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 text-red-500"
                    >
                      <LogOut size={14} /> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="hover:underline">
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="font-semibold hover:underline"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Main header ── */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="font-bold text-gray-800 text-lg leading-tight hidden sm:block">
              AI<span className="text-orange-500">Guesthouse</span>
            </span>
          </Link>

          {/* Search bar — desktop */}
          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-xl hidden md:flex"
          >
            <div className="flex w-full border border-gray-300 rounded-lg overflow-hidden focus-within:border-orange-400 focus-within:ring-1 focus-within:ring-orange-400 transition-shadow">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Tìm kiếm theo địa chỉ, quận, tỉnh thành..."
                className="flex-1 px-3 py-2 text-sm outline-none text-gray-700 placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 transition-colors px-4 flex items-center justify-center"
                aria-label="Tìm kiếm"
              >
                <Search size={18} className="text-white" />
              </button>
            </div>
          </form>

          {/* Đăng tin CTA */}
          {(user?.role === "owner" || user?.role === "admin") && (
            <Link
              href="/my-rooms/create"
              className="hidden md:flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors flex-shrink-0"
            >
              <PlusSquare size={16} />
              Đăng tin
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden ml-auto p-2 rounded-md hover:bg-gray-100"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* ── Nav links — desktop ── */}
        <nav className="hidden md:flex items-center gap-1 border-t border-gray-100 h-10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 h-full flex items-center text-sm text-gray-700 hover:text-orange-500 border-b-2 border-transparent hover:border-orange-500 transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-3">
            <form
              onSubmit={handleSearch}
              className="flex border border-gray-300 rounded-lg overflow-hidden"
            >
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Tìm kiếm phòng trọ..."
                className="flex-1 px-3 py-2 text-sm outline-none"
              />
              <button
                type="submit"
                className="bg-orange-500 px-4 flex items-center"
                aria-label="Tìm kiếm"
              >
                <Search size={16} className="text-white" />
              </button>
            </form>
          </div>

          <nav className="px-4 pb-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-2.5 text-sm text-gray-700 border-b border-gray-50 hover:text-orange-500"
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated && user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-sm text-gray-700 border-b border-gray-50 hover:text-orange-500"
                >
                  Hồ sơ của tôi
                </Link>
                {(user.role === "owner" || user.role === "admin") && (
                  <Link
                    href="/my-rooms/create"
                    onClick={() => setMobileOpen(false)}
                    className="mt-2 flex items-center justify-center gap-2 bg-orange-500 text-white font-semibold text-sm px-4 py-2 rounded-lg"
                  >
                    <PlusSquare size={16} />
                    Đăng tin ngay
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="mt-2 text-sm text-red-500 text-left py-2"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <div className="flex gap-2 mt-3">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center border border-orange-500 text-orange-500 font-semibold text-sm py-2 rounded-lg"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center bg-orange-500 text-white font-semibold text-sm py-2 rounded-lg"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
