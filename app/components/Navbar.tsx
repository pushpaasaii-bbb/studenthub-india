'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu, X, Search, GraduationCap,
  BookOpen, Briefcase, Calculator,
  Award, ChevronDown, User, LogOut
} from 'lucide-react'
import { supabase } from "../lib/supabase";
import type { User as SupabaseUser } from '@supabase/supabase-js'

// ============================================
// NAVIGATION LINKS — All main sections
// ============================================
const NAV_LINKS = [
  {
    label: 'Colleges',
    href: '/colleges',
    icon: GraduationCap,
    dropdown: [
      { label: 'All Colleges',        href: '/colleges' },
      { label: 'IITs',                href: '/colleges?type=iit' },
      { label: 'NITs',                href: '/colleges?type=nit' },
      { label: 'Government Colleges', href: '/colleges?type=government' },
      { label: 'Private Colleges',    href: '/colleges?type=private' },
      { label: 'College Predictor',   href: '/tools/college-predictor' },
    ],
  },
  {
    label: 'Exams',
    href: '/exams',
    icon: BookOpen,
    dropdown: [
      { label: 'AP EAMCET',  href: '/exams/ap-eamcet-2025' },
      { label: 'TS EAMCET',  href: '/exams/ts-eamcet-2025' },
      { label: 'JEE Main',   href: '/exams/jee-main-2025' },
      { label: 'GATE',       href: '/exams/gate-2025' },
      { label: 'UPSC',       href: '/exams/upsc-cse-2025' },
      { label: 'All Exams',  href: '/exams' },
    ],
  },
  {
    label: 'Jobs',
    href: '/jobs',
    icon: Briefcase,
    dropdown: [
      { label: 'All Govt Jobs', href: '/jobs' },
      { label: 'AP Jobs',       href: '/jobs?state=Andhra+Pradesh' },
      { label: 'TS Jobs',       href: '/jobs?state=Telangana' },
      { label: 'Railway Jobs',  href: '/jobs?dept=Railway' },
      { label: 'Banking Jobs',  href: '/jobs?dept=Banking' },
      { label: 'Defence Jobs',  href: '/jobs?dept=Defence' },
    ],
  },
  {
    label: 'Tools',
    href: '/tools',
    icon: Calculator,
    dropdown: [
      { label: 'CGPA Calculator',       href: '/tools/cgpa-calculator' },
      { label: 'Attendance Calculator', href: '/tools/attendance-calculator' },
      { label: 'EAMCET Rank Predictor', href: '/tools/eamcet-rank-predictor' },
      { label: 'College Predictor',     href: '/tools/college-predictor' },
      { label: 'Percentage Calculator', href: '/tools/percentage-calculator' },
      { label: 'All Tools',             href: '/tools' },
    ],
  },
  {
    label: 'Scholarships',
    href: '/scholarships',
    icon: Award,
    dropdown: null,
  },
]

export default function Navbar() {
  // State management
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown]  = useState<string | null>(null)
  const [searchOpen, setSearchOpen]          = useState(false)
  const [searchQuery, setSearchQuery]        = useState('')
  const [scrolled, setScrolled]              = useState(false)
  const [user, setUser]                      = useState<SupabaseUser | null>(null)

  const pathname = usePathname()

  // ============================================
  // EFFECTS
  // ============================================

  // Add shadow to navbar when user scrolls down
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when page changes
  useEffect(() => {
    setMobileMenuOpen(false)
    setActiveDropdown(null)
  }, [pathname])

  // Check if user is logged in
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    )
    return () => listener.subscription.unsubscribe()
  }, [])

  // ============================================
  // HANDLERS
  // ============================================

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/colleges?search=${encodeURIComponent(searchQuery)}`
    }
  }

  // Check if current link is active
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/')

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50
        bg-white dark:bg-slate-900
        border-b border-gray-100 dark:border-slate-800
        transition-all duration-300
        ${scrolled ? 'shadow-nav' : ''}
      `}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">

          {/* ============ LOGO ============ */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-brand rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-primary-800 dark:text-white">
                StudentHub
              </span>
              <span className="text-lg font-bold text-accent-600">
                India
              </span>
            </div>
          </Link>

          {/* ============ DESKTOP NAVIGATION ============ */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {/* Main nav link */}
                <Link
                  href={link.href}
                  className={`
                    flex items-center gap-1 px-3 py-2 rounded-lg
                    text-sm font-medium transition-all duration-200
                    ${isActive(link.href)
                      ? 'text-primary-800 bg-primary-50 dark:text-white dark:bg-slate-800'
                      : 'text-gray-600 hover:text-primary-800 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-slate-800'
                    }
                  `}
                >
                  {link.label}
                  {link.dropdown && (
                    <ChevronDown className="w-3 h-3 opacity-60" />
                  )}
                </Link>

                {/* Dropdown menu */}
                {link.dropdown && activeDropdown === link.label && (
                  <div className="
                    absolute top-full left-0 mt-1 w-52
                    bg-white dark:bg-slate-800
                    border border-gray-100 dark:border-slate-700
                    rounded-xl shadow-lg
                    py-2 z-50
                    animate-fade-in
                  ">
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="
                          block px-4 py-2 text-sm
                          text-gray-600 dark:text-gray-300
                          hover:text-primary-800 dark:hover:text-white
                          hover:bg-gray-50 dark:hover:bg-slate-700
                          transition-colors duration-150
                        "
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ============ RIGHT SIDE ACTIONS ============ */}
          <div className="flex items-center gap-2">

            {/* Search button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="
                p-2 rounded-lg text-gray-500
                hover:text-primary-800 hover:bg-gray-100
                dark:text-gray-400 dark:hover:text-white
                dark:hover:bg-slate-800
                transition-all duration-200
              "
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Auth buttons — desktop only */}
            <div className="hidden sm:flex items-center gap-2">
              {user ? (
                // Logged in — show dashboard + logout
                <div className="flex items-center gap-2">
                  <Link
                    href="/dashboard"
                    className="
                      flex items-center gap-2 px-3 py-2
                      text-sm font-medium text-gray-600
                      dark:text-gray-300
                      hover:text-primary-800 dark:hover:text-white
                      transition-colors duration-200
                    "
                  >
                    <User className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="
                      flex items-center gap-1 px-3 py-2
                      text-sm font-medium text-gray-500
                      hover:text-red-600
                      transition-colors duration-200
                    "
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                // Not logged in — show login + register
                <>
                  <Link
                    href="/auth/login"
                    className="
                      px-4 py-2 text-sm font-medium
                      text-gray-600 dark:text-gray-300
                      hover:text-primary-800 dark:hover:text-white
                      transition-colors duration-200
                    "
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="btn-primary btn-sm"
                  >
                    Register Free
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="
                lg:hidden p-2 rounded-lg
                text-gray-500 hover:text-primary-800
                hover:bg-gray-100 dark:text-gray-400
                dark:hover:text-white dark:hover:bg-slate-800
                transition-all duration-200
              "
              aria-label="Toggle menu"
            >
              {mobileMenuOpen
                ? <X className="w-5 h-5" />
                : <Menu className="w-5 h-5" />
              }
            </button>
          </div>
        </div>

        {/* ============ SEARCH BAR (expands when clicked) ============ */}
        {searchOpen && (
          <div className="py-3 border-t border-gray-100 dark:border-slate-800 animate-slide-down">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search colleges, exams, jobs..."
                className="input flex-1"
                autoFocus
              />
              <button type="submit" className="btn-primary btn-sm">
                <Search className="w-4 h-4" />
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ============ MOBILE MENU ============ */}
      {mobileMenuOpen && (
        <div className="
          lg:hidden border-t border-gray-100
          dark:border-slate-800
          bg-white dark:bg-slate-900
          animate-slide-down
        ">
          <div className="container-custom py-4 space-y-1">

            {NAV_LINKS.map((link) => (
              <div key={link.label}>
                {/* Mobile main link */}
                <button
                  onClick={() =>
                    setActiveDropdown(
                      activeDropdown === link.label ? null : link.label
                    )
                  }
                  className="
                    w-full flex items-center justify-between
                    px-4 py-3 rounded-xl text-sm font-medium
                    text-gray-700 dark:text-gray-300
                    hover:bg-gray-50 dark:hover:bg-slate-800
                    transition-colors duration-200
                  "
                >
                  <div className="flex items-center gap-3">
                    <link.icon className="w-4 h-4 text-primary-800" />
                    {link.label}
                  </div>
                  {link.dropdown && (
                    <ChevronDown
                      className={`
                        w-4 h-4 transition-transform duration-200
                        ${activeDropdown === link.label ? 'rotate-180' : ''}
                      `}
                    />
                  )}
                </button>

                {/* Mobile dropdown */}
                {link.dropdown && activeDropdown === link.label && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-primary-100 dark:border-slate-700 pl-4">
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="
                          block px-3 py-2 text-sm
                          text-gray-600 dark:text-gray-400
                          hover:text-primary-800 dark:hover:text-white
                          transition-colors duration-150
                        "
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Mobile auth buttons */}
            <div className="pt-4 border-t border-gray-100 dark:border-slate-800 space-y-2">
              {user ? (
                <>
                  <Link href="/dashboard" className="btn-primary w-full justify-center">
                    <User className="w-4 h-4" />
                    My Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="btn-secondary w-full justify-center"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/register"
                    className="btn-primary w-full justify-center"
                  >
                    Register Free
                  </Link>
                  <Link
                    href="/auth/login"
                    className="btn-secondary w-full justify-center"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}