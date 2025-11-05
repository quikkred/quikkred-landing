"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, Users, Clock, MapPin, Smartphone,
  Monitor, Globe, Activity, Eye, Filter, Calendar
} from "lucide-react";

interface UserActivity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  ipAddress: string;
  device: string;
  browser: string;
  location: string;
  duration: number;
}

interface ActivityStats {
  totalUsers: number;
  activeNow: number;
  avgSessionTime: number;
  topAction: string;
}

const mockActivities: UserActivity[] = [
  {
    id: "ACT001",
    userId: "USR001",
    userName: "Rajesh Kumar",
    action: "Loan Application Submitted",
    timestamp: "2024-12-01T14:30:00Z",
    ipAddress: "103.15.67.89",
    device: "Mobile",
    browser: "Chrome Mobile",
    location: "Mumbai, Maharashtra",
    duration: 15
  },
  {
    id: "ACT002",
    userId: "USR002",
    userName: "Priya Sharma",
    action: "Profile Updated",
    timestamp: "2024-12-01T14:25:00Z",
    ipAddress: "157.32.45.12",
    device: "Desktop",
    browser: "Firefox",
    location: "Delhi, Delhi",
    duration: 8
  },
  {
    id: "ACT003",
    userId: "USR003",
    userName: "Amit Patel",
    action: "EMI Calculator Used",
    timestamp: "2024-12-01T14:20:00Z",
    ipAddress: "202.88.14.56",
    device: "Tablet",
    browser: "Safari",
    location: "Bangalore, Karnataka",
    duration: 5
  },
  {
    id: "ACT004",
    userId: "USR004",
    userName: "Sneha Reddy",
    action: "Document Uploaded",
    timestamp: "2024-12-01T14:15:00Z",
    ipAddress: "122.45.78.90",
    device: "Mobile",
    browser: "Chrome Mobile",
    location: "Hyderabad, Telangana",
    duration: 12
  },
  {
    id: "ACT005",
    userId: "USR005",
    userName: "Vikram Singh",
    action: "Loan Status Checked",
    timestamp: "2024-12-01T14:10:00Z",
    ipAddress: "49.207.123.45",
    device: "Desktop",
    browser: "Edge",
    location: "Pune, Maharashtra",
    duration: 3
  }
];

export default function UserActivityMonitor() {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ActivityStats>({
    totalUsers: 0,
    activeNow: 0,
    avgSessionTime: 0,
    topAction: ""
  });
  const [timeFilter, setTimeFilter] = useState('today');
  const [deviceFilter, setDeviceFilter] = useState('all');

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      setActivities(mockActivities);
      setStats({
        totalUsers: 1284,
        activeNow: 47,
        avgSessionTime: 8.5,
        topAction: "Loan Application Submitted"
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'desktop':
        return <Monitor className="h-4 w-4" />;
      case 'tablet':
        return <Smartphone className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const getDeviceColor = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile':
        return 'text-blue-400 bg-blue-500/10';
      case 'desktop':
        return 'text-green-400 bg-green-500/10';
      case 'tablet':
        return 'text-purple-400 bg-purple-500/10';
      default:
        return 'text-slate-400 bg-slate-500/10';
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (loading) {
    return (
      <div className="glass rounded-2xl p-8 border border-slate-700">
        <div className="text-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"
          />
          <p className="mt-4 text-slate-400">Loading activities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100">User Activity Monitor</h2>
        <p className="text-slate-400 mt-1">Real-time user activity and engagement tracking</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-slate-400 mb-1">Total Users</h3>
          <p className="text-2xl font-bold text-slate-100">{stats.totalUsers}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-500/10">
              <Activity className="h-6 w-6 text-green-400" />
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-slate-400 mb-1">Active Now</h3>
          <p className="text-2xl font-bold text-slate-100">{stats.activeNow}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-500/10">
              <Clock className="h-6 w-6 text-purple-400" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-slate-400 mb-1">Avg. Session Time</h3>
          <p className="text-2xl font-bold text-slate-100">{stats.avgSessionTime} min</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-yellow-500/10">
              <TrendingUp className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-slate-400 mb-1">Top Action</h3>
          <p className="text-sm font-bold text-slate-100">{stats.topAction}</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-6 border border-slate-700">
        <div className="flex items-center gap-4">
          <Filter className="h-5 w-5 text-slate-400" />
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-100"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>

          <select
            value={deviceFilter}
            onChange={(e) => setDeviceFilter(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-100"
          >
            <option value="all">All Devices</option>
            <option value="mobile">Mobile</option>
            <option value="desktop">Desktop</option>
            <option value="tablet">Tablet</option>
          </select>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="glass rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-400" />
          Recent Activity
        </h3>

        <div className="space-y-3">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {activity.userName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-medium text-slate-100">{activity.userName}</h4>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-500">{getTimeAgo(activity.timestamp)}</span>
                </div>

                <p className="text-sm text-slate-300 mb-2">{activity.action}</p>

                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className={`flex items-center gap-1 px-2 py-1 rounded ${getDeviceColor(activity.device)}`}>
                    {getDeviceIcon(activity.device)}
                    {activity.device}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {activity.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {activity.duration}m
                  </span>
                  <span className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {activity.ipAddress}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Device Distribution */}
      <div className="glass rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <Monitor className="h-5 w-5 text-green-400" />
          Device Distribution
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Smartphone className="h-6 w-6 text-blue-400" />
              <span className="text-2xl font-bold text-blue-400">62%</span>
            </div>
            <p className="text-sm text-slate-300">Mobile Users</p>
            <p className="text-xs text-slate-500 mt-1">796 active users</p>
          </div>

          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Monitor className="h-6 w-6 text-green-400" />
              <span className="text-2xl font-bold text-green-400">28%</span>
            </div>
            <p className="text-sm text-slate-300">Desktop Users</p>
            <p className="text-xs text-slate-500 mt-1">359 active users</p>
          </div>

          <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Smartphone className="h-6 w-6 text-purple-400" />
              <span className="text-2xl font-bold text-purple-400">10%</span>
            </div>
            <p className="text-sm text-slate-300">Tablet Users</p>
            <p className="text-xs text-slate-500 mt-1">129 active users</p>
          </div>
        </div>
      </div>

      {/* Top Actions */}
      <div className="glass rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-yellow-400" />
          Top Actions (Today)
        </h3>

        <div className="space-y-3">
          {[
            { action: "Loan Application Submitted", count: 247, percentage: 45 },
            { action: "EMI Calculator Used", count: 189, percentage: 35 },
            { action: "Profile Updated", count: 124, percentage: 23 },
            { action: "Document Uploaded", count: 98, percentage: 18 },
            { action: "Loan Status Checked", count: 76, percentage: 14 }
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-300">{item.action}</span>
                  <span className="text-sm font-medium text-slate-100">{item.count}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
