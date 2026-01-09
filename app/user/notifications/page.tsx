"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bell, BellOff, AlertCircle, Info, CheckCircle,
  Clock, ArrowLeft, Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from '@/lib/config';
import { useNotifications } from '@/store/hooks/useNotifications';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export default function NotificationsPage() {
  const router = useRouter();

  // Redux state for notifications
  const {
    notifications,
    loading: isLoading,
    error,
    fetchNotifications: reduxFetchNotifications,
  } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const result = await reduxFetchNotifications();
    if (result?.requiresAuth) {
      router.push('/login');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'WARNING':
        return <AlertCircle className="w-6 h-6 text-yellow-600" />;
      case 'ERROR':
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      default:
        return <Info className="w-6 h-6 text-blue-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return 'bg-green-50 border-green-200';
      case 'WARNING':
        return 'bg-yellow-50 border-yellow-200';
      case 'ERROR':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#25B181] mx-auto mb-4" />
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-4 sm:py-8">
      <div className="container mx-auto px-3 sm:px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#1976D2] hover:text-[#1565C0] mb-3 sm:mb-4 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-sm sm:text-base">Back</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-[#25B181]" />
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-[#1F8F68]">Notifications</h1>
              <p className="text-gray-600 mt-0.5 sm:mt-1 text-sm sm:text-base">Stay updated with your latest notifications</p>
            </div>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </motion.div>
        )}

        {/* Notifications List */}
        <div className="space-y-3 sm:space-y-4">
          {notifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-[#E0E0E0] p-6 sm:p-12 text-center"
            >
              <BellOff className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No notifications</h3>
              <p className="text-gray-600 text-sm sm:text-base">You don't have any notifications yet.</p>
            </motion.div>
          ) : (
            notifications.map((notification, index) => (
              <motion.div
                key={notification._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-lg sm:rounded-xl shadow-sm border-2 ${
                  notification.isRead ? 'border-[#E0E0E0]' : 'border-[#2E7D32]'
                } overflow-hidden hover:shadow-md transition-all`}
              >
                <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-5">
                  {/* Icon */}
                  <div className={`p-2 sm:p-3 rounded-lg flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                    <div className="w-5 h-5 sm:w-6 sm:h-6 [&>svg]:w-full [&>svg]:h-full">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-3 mb-1 sm:mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base flex items-center gap-2">
                        {notification.title}
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-[#2E7D32] rounded-full flex-shrink-0" />
                        )}
                      </h3>
                      <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">
                        <Clock className="w-3 h-3" />
                        {formatDate(notification.createdAt)}
                      </div>
                    </div>

                    <p className="text-gray-700 text-xs sm:text-sm">{notification.message}</p>

                    {notification.link && (
                      <a
                        href={notification.link}
                        className="inline-block mt-2 sm:mt-3 text-xs sm:text-sm text-[#1976D2] hover:text-[#1565C0] font-medium"
                      >
                        View details →
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
