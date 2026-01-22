"use client";

import { useState, useEffect, useRef, memo, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import Image from "next/image";
import {
  LayoutDashboard, CreditCard, FileText, Settings, Bell,
  LogOut, Menu, User, Wallet, Calculator, HelpCircle,
  ChevronDown, Award, Gift, Receipt, Phone, Mail,
  Target, Activity, History, Download, Star,
  Sparkles, Plus, Send, Shield, UserCheck, Eye, X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE_URL } from '@/lib/config';
import getToken from "@/lib/getToken";

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout = ({ children }: UserLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isLoggingOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: user?.name || "User",
    email: user?.email || "",
    mobile: user?.mobile || "",
    customerId: user?.id || "",
    tier: "Bronze",
    creditScore: 0,
    availableCredit: 0,
    rewardPoints: 0,
    notifications: 0
  });
  const [creditScoreData, setCreditScoreData] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const navigationItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/user",
      color: "text-blue-400"
    },
    {
      title: "My Loans",
      icon: CreditCard,
      href: "/user/loans",
      color: "text-emerald-400"
    },
    {
      title: "My Applications",
      icon: FileText,
      href: "/user/applications",
      color: "text-purple-400"
    },
    // {
    //   title: "Write Review",
    //   icon: Star,
    //   href: "/user/review",
    //   color: "text-yellow-400"
    // },
    {
      title: "Support",
      icon: HelpCircle,
      href: "/user/support",
      color: "text-red-400"
    }
  ];

  // Sync user data from AuthContext (no API call - AuthContext already fetches)
  useEffect(() => {
    if (user) {
      setUserData(prevData => ({
        ...prevData,
        name: user.name || prevData.name,
        email: user.email || prevData.email,
        mobile: user.mobile || prevData.mobile,
        customerId: user.id || prevData.customerId,
      }));
    }
  }, [user]);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      try {
        const token = await getToken();
        if (!token) {
          console.log('No auth token found for notifications');
          clearTimeout(timeoutId);
          return;
        }

        // console.log('Fetching notifications...');
        const response = await fetch(`${API_BASE_URL}/api/notification/getAll`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        const result = await response.json();
        // console.log('Notifications API Response:', result);

        // Handle 403 - Access denied for CUSTOMER role
        if (result.status === 403 || response.status === 403) {
          console.log('Notifications not available for CUSTOMER role');
          setNotifications([]);
          setUserData(prevData => ({
            ...prevData,
            notifications: 0
          }));
          return;
        }

        if (result.success && result.data) {
          console.log('Notifications fetched:', result.data.length);
          setNotifications(result.data);
          setUserData(prevData => ({
            ...prevData,
            notifications: result.pagination?.total || result.data.length
          }));
        } else {
          console.log('No notifications or API error:', result.message);
          setNotifications([]);
          setUserData(prevData => ({
            ...prevData,
            notifications: 0
          }));
        }
      } catch (error: any) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
          console.log('Notification fetch timeout - request cancelled');
        } else {
          console.error('Error fetching notifications:', error);
        }

        setNotifications([]);
        setUserData(prevData => ({
          ...prevData,
          notifications: 0
        }));
      }
    };

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationDropdownOpen(false);
      }
    };

    if (profileDropdownOpen || notificationDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen, notificationDropdownOpen]);

  // Close dropdown and mobile sidebar when pathname changes (navigation)
  useEffect(() => {
    setProfileDropdownOpen(false);
    setNotificationDropdownOpen(false);
    setMobileSidebarOpen(false);
  }, [pathname]);

  const handleLogout = useCallback(() => {
    // Use the logout function from AuthContext to ensure all cleanup is done properly
    logout();
  }, [logout]);

  // Memoize navigation handler for better performance
  const handleNavigation = useCallback((href: string) => {
    if (pathname !== href) {
      router.push(href);
    }
  }, [pathname, router]);

  // Show loading screen when logging out
  if (isLoggingOut) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#25B181] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Logging out...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#FAFAFA] flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop (hidden on mobile) */}
      <motion.div
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="hidden lg:flex bg-white border-r border-[#E0E0E0] flex-col shadow-lg h-screen flex-shrink-0"
      >
        {/* Sidebar Header */}
        <div className={` border-b border-[#E0E0E0] ${!sidebarOpen ? 'px-4' : ''}`}>
          <div className={`flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center flex-col gap-4'}`}>
            {sidebarOpen ? (
              <>
                <motion.div
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center w-full py-4"
                >
                  <Image
                    src="/logo.svg"
                    alt="Quikkred Logo"
                    width={160}
                    height={80}
                    priority
                    quality={100}
                    className="h-auto max-w-[260px]"
                    style={{
                      objectFit: 'contain',
                      imageRendering: '-webkit-optimize-contrast',
                    }}
                  />
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 hover:bg-[#FAFAFA] rounded-lg transition-colors cursor-pointer"
                >
                  <Menu className="w-5 h-5 text-gray-600" />
                </motion.button>
              </>
            ) : (
              <>
                <div className="rounded-xl flex items-center justify-center">
                  <Image
                    src="/i.svg"
                    alt="Quikkred Logo"
                    width={54}
                    height={54}
                    className="object-contain"
                  />

                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 hover:bg-[#FAFAFA] rounded-lg transition-colors cursor-pointer"
                >
                  <Menu className="w-5 h-5 text-gray-600" />
                </motion.button>
              </>
            )}
          </div>
        </div>

        {/* User Info */}

        {/* Navigation */}
        <nav className={`flex-1 p-4 space-y-2 overflow-y-auto ${!sidebarOpen ? 'px-2' : ''}`}>
          {navigationItems.map((item) => (
            <button
              key={item.title}
              onClick={() => handleNavigation(item.href)}
              className={`w-full flex items-center ${sidebarOpen ? 'gap-3 justify-start' : 'justify-center'} p-3 rounded-lg transition-colors duration-150 cursor-pointer ${pathname === item.href
                  ? 'bg-gradient-to-r from-[#10B4A3] to-[#0E9D8F] text-white shadow-md'
                  : 'hover:bg-[#FAFAFA] text-[#0A0A0A]'
                }`}
            >
              <item.icon className={`w-5 h-5 ${pathname === item.href ? 'text-white' : 'text-[#4084FF]'
                }`} />
              {sidebarOpen && (
                <span className={`font-medium ${pathname === item.href ? 'text-white' : 'text-[#0A0A0A]'
                  }`}>
                  {item.title.toLowerCase()
                    .replace(/\b\w/g, char => char.toUpperCase())}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Quick Actions */}
        {sidebarOpen && (
          <div className="p-4 border-t border-[#E5E5E5]">
            <div className="space-y-2">
              {/* <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => router.push('/apply')}
                className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-[#10B4A3] to-[#0E9D8F] text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                Apply Now
              </motion.button> */}
              {/* <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => router.push('/dashboard/payments')}
                className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-[#4084FF] to-[#6BA4FF] text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <Send className="w-5 h-5" />
                Pay EMI
              </motion.button> */}
            </div>
          </div>
        )}

        {/* Sidebar Footer */}
        <div className={`p-4 border-t border-[#E5E5E5] ${!sidebarOpen ? 'px-2' : ''}`}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={handleLogout}
            className={`w-full flex items-center ${sidebarOpen ? 'gap-3 justify-start' : 'justify-center'} p-3 text-[#F44336] hover:bg-[#FFEBEE] rounded-lg transition-all cursor-pointer`}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </motion.button>
        </div>
      </motion.div>

      {/* Mobile Sidebar - Slide from left */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="fixed left-0 top-0 w-[280px] h-screen bg-white border-r border-[#E0E0E0] flex flex-col shadow-lg z-50 lg:hidden"
          >
            {/* Mobile Sidebar Header */}
            <div className="border-b border-[#E0E0E0]">
              <div className="flex items-center justify-between p-4">
                <Image
                  src="/logo.svg"
                  alt="Quikkred Logo"
                  width={140}
                  height={70}
                  priority
                  quality={100}
                  className="h-auto max-w-[140px]"
                  style={{
                    objectFit: 'contain',
                    imageRendering: '-webkit-optimize-contrast',
                  }}
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-2 hover:bg-[#FAFAFA] rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </motion.button>
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navigationItems.map((item) => (
                <button
                  key={item.title}
                  onClick={() => {
                    handleNavigation(item.href);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors duration-150 cursor-pointer ${pathname === item.href
                      ? 'bg-gradient-to-r from-[#10B4A3] to-[#0E9D8F] text-white shadow-md'
                      : 'hover:bg-[#FAFAFA] text-[#0A0A0A]'
                    }`}
                >
                  <item.icon className={`w-5 h-5 ${pathname === item.href ? 'text-white' : 'text-[#4084FF]'
                    }`} />
                  <span className={`font-medium ${pathname === item.href ? 'text-white' : 'text-[#0A0A0A]'
                    }`}>
                    {item.title.toLowerCase()
                      .replace(/\b\w/g, char => char.toUpperCase())}
                  </span>
                </button>
              ))}
            </nav>

            {/* Mobile Sidebar Footer */}
            <div className="p-4 border-t border-[#E5E5E5]">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setMobileSidebarOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 p-3 text-[#F44336] hover:bg-[#FFEBEE] rounded-lg transition-all cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header - Fixed */}
        <header className="bg-white border-b border-[#E0E0E0] px-3 py-3 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileSidebarOpen(true)}
                className="p-2 hover:bg-[#FAFAFA] rounded-lg transition-colors cursor-pointer lg:hidden"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </motion.button>

              <h2 className="text-base sm:text-xl font-semibold text-[#25B181]">
                {navigationItems.find(item => item.href === pathname)?.title || "Dashboard"}
              </h2>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {/* Quick Stats */}
              <div className="hidden md:flex items-center gap-4 text-sm">
                {/* <div className="flex items-center gap-2 bg-gradient-to-r from-[#25B181]/10 to-[#51C9AF]/10 border border-[#25B181]/20 px-3 py-1.5 rounded-lg">
                  <Award className="w-4 h-4 text-[#25B181]" />
                  <span className="text-[#1F8F68] font-semibold">CIBIL: {userData.creditScore || 'N/A'}</span>
                </div> */}
                {/* <div className="flex items-center gap-2 bg-[#FAFAFA] px-3 py-1.5 rounded-lg">
                  <Wallet className="w-4 h-4 text-[#4A66FF]" />
                  <span className="text-gray-700 font-medium">₹{(userData.availableCredit / 1000).toFixed(0)}K</span>
                </div> */}
                {/* <div className="flex items-center gap-2 bg-[#FAFAFA] px-3 py-1.5 rounded-lg">
                  <Gift className="w-4 h-4 text-[#FFD700]" />
                  <span className="text-gray-700 font-medium">{userData.rewardPoints} pts</span>
                </div> */}
              </div>

              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                  className="relative p-1.5 sm:p-2 bg-[#FAFAFA] hover:bg-[#E0E0E0] rounded-lg transition-colors cursor-pointer"
                >
                  <Bell className="w-5 h-5 text-[#4A66FF]" />
                  {userData.notifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {userData.notifications}
                    </span>
                  )}
                </motion.button>

                <AnimatePresence>
                  {notificationDropdownOpen && (
                    <>
                      {/* Mobile backdrop */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setNotificationDropdownOpen(false)}
                        className="fixed inset-0 bg-black/20 z-40 sm:hidden"
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="fixed sm:absolute left-3 right-3 sm:left-auto sm:right-0 top-16 sm:top-full sm:mt-2 sm:w-96 bg-white rounded-xl shadow-xl border border-[#E0E0E0] z-50 max-h-[70vh] sm:max-h-[500px] overflow-hidden flex flex-col"
                      >
                        {/* Notification Header */}
                        <div className="p-3 sm:p-4 border-b border-[#E0E0E0]">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-800">Recent Notifications</h3>
                            {notifications.length > 0 && (
                              <span className="text-xs text-gray-500">
                                {notifications.length > 2 ? '2 recent' : `${notifications.length} new`}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Notifications List */}
                        <div className="flex-1 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-6 sm:p-8 text-center">
                              <Bell className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
                              <p className="text-sm text-gray-600">No notifications</p>
                              <p className="text-xs text-gray-500 mt-1">You're all caught up!</p>
                            </div>
                          ) : (
                            <div className="divide-y divide-[#E0E0E0]">
                              {notifications.slice(0, 2).map((notification) => (
                                <motion.div
                                  key={notification._id}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="p-3 sm:p-4 hover:bg-[#FAFAFA] transition-colors cursor-pointer"
                                  onClick={() => setNotificationDropdownOpen(false)}
                                >
                                  <div className="flex items-start gap-2 sm:gap-3">
                                    {/* Icon based on type */}
                                    <div className={`p-2 rounded-lg ${notification.type === 'INFO' ? 'bg-blue-500/10' :
                                        notification.type === 'SUCCESS' ? 'bg-[#3AC6A0]/10' :
                                          notification.type === 'WARNING' ? 'bg-yellow-500/10' :
                                            'bg-red-500/10'
                                      }`}>
                                      <Bell className={`w-4 h-4 ${notification.type === 'INFO' ? 'text-blue-600' :
                                          notification.type === 'SUCCESS' ? 'text-[#3AC6A0]' :
                                            notification.type === 'WARNING' ? 'text-yellow-600' :
                                              'text-red-600'
                                        }`} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-2">
                                        <h4 className="text-sm font-semibold text-gray-800 line-clamp-1">
                                          {notification.title}
                                        </h4>
                                        {notification.priority === 'HIGH' && (
                                          <span className="px-2 py-0.5 bg-red-500/10 text-red-600 text-xs rounded-full font-medium whitespace-nowrap">
                                            Urgent
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                        {notification.message}
                                      </p>
                                      <div className="flex items-center gap-3 mt-2">
                                        <span className="text-xs text-gray-500">
                                          {new Date(notification.createdAt).toLocaleDateString('en-IN', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          })}
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${notification.status === 'SENT' ? 'bg-[#3AC6A0]/10 text-[#3AC6A0]' :
                                            notification.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-600' :
                                              'bg-gray-100 text-gray-600'
                                          }`}>
                                          {notification.status}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Notification Footer */}
                        {notifications.length > 0 && (
                          <div className="p-3 border-t border-[#E0E0E0]">
                            <button
                              onClick={() => {
                                setNotificationDropdownOpen(false);
                                router.push('/user/notifications');
                              }}
                              className="w-full text-center text-sm text-[#4A66FF] hover:text-[#3B52CC] font-medium transition-colors cursor-pointer"
                            >
                              {notifications.length > 2
                                ? `View All ${notifications.length} Notifications`
                                : 'View All Notifications'}
                            </button>
                          </div>
                        )}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-1 sm:gap-3 p-1.5 sm:p-2 bg-[#FAFAFA] hover:bg-[#E0E0E0] rounded-lg transition-colors cursor-pointer"
                >
                  {profileImage && !imageLoadError ? (
                    <div
                      className="w-8 h-8 rounded-full shadow-md border border-white overflow-hidden"
                      style={{
                        backgroundImage: `url(${profileImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-full h-full opacity-0"
                        referrerPolicy="no-referrer"
                        onError={() => {
                          console.error('Failed to load profile image in navbar');
                          setImageLoadError(true);
                        }}
                        onLoad={() => console.log('✅ Navbar profile image loaded')}
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#25B181] to-[#51C9AF] flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {userData.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                  <div className="text-left hidden md:block">
                    <p className="text-sm font-medium text-gray-800">{userData.name.split(' ')[0]}</p>
                    {/* <p className="text-xs text-gray-500">ID: {userData.customerId}</p> */}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-600 hidden sm:block" />
                </motion.button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-[calc(100vw-24px)] sm:w-64 max-w-[256px] bg-white rounded-xl shadow-xl border border-[#E0E0E0] p-2 z-50"
                    >
                      <div className="p-3 border-b border-[#E0E0E0]">
                        <p className="font-medium text-gray-800">{userData.name.toLowerCase()
                          .replace(/\b\w/g, char => char.toUpperCase())}</p>
                        <p className="text-sm text-gray-600">{userData.email}</p>

                        {/* <div className="flex items-center gap-2 mt-2">
                          <div className="px-2 py-1 bg-gradient-to-r from-[#FFD700] to-[#FBC02D] text-white text-xs rounded-full font-medium">
                            {userData.tier} Member
                          </div>
                          <div className="px-2 py-1 bg-[#25B181]/10 text-[#25B181] text-xs rounded-full">
                            <UserCheck className="w-3 h-3 inline mr-1" />
                            Verified
                          </div>
                        </div> */}
                      </div>
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            router.push('/profile');
                          }}
                          className="w-full flex items-center gap-3 p-3 hover:bg-[#FAFAFA] rounded-lg transition-colors text-gray-700 cursor-pointer"
                        >
                          <User className="w-4 h-4 text-[#4A66FF]" />
                          View Profile
                        </button>
                        {/* <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            router.push('/user/settings');
                          }}
                          className="w-full flex items-center gap-3 p-3 hover:bg-[#FAFAFA] rounded-lg transition-colors text-gray-700 cursor-pointer"
                        >
                          <Settings className="w-4 h-4 text-[#4A66FF]" />
                          Settings
                        </button> */}
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            router.push('/user/support');
                          }}
                          className="w-full flex items-center gap-3 p-3 hover:bg-[#FAFAFA] rounded-lg transition-colors text-gray-700 cursor-pointer"
                        >
                          <HelpCircle className="w-4 h-4 text-[#4A66FF]" />
                          Help & Support
                        </button>
                        {/* <button className="w-full flex items-center gap-3 p-3 hover:bg-[#FAFAFA] rounded-lg transition-colors text-gray-700">
                          <Download className="w-4 h-4 text-[#4A66FF]" />
                          Download App
                        </button> */}
                      </div>
                      <div className="pt-2 border-t border-[#E0E0E0]">
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content - Scrollable */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;