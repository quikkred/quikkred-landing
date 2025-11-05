"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield, Server, Database, Activity, Wifi, HardDrive,
  Cpu, AlertTriangle, CheckCircle, XCircle, Clock,
  RefreshCw, TrendingUp, TrendingDown, Zap, Globe
} from "lucide-react";

interface ServiceStatus {
  name: string;
  status: 'healthy' | 'warning' | 'critical' | 'down';
  responseTime: number;
  uptime: number;
  lastChecked: string;
  icon: any;
}

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

const SERVICES: ServiceStatus[] = [
  {
    name: 'Web Server',
    status: 'healthy',
    responseTime: 42,
    uptime: 99.98,
    lastChecked: '1 min ago',
    icon: Server
  },
  {
    name: 'Database',
    status: 'healthy',
    responseTime: 15,
    uptime: 99.95,
    lastChecked: '1 min ago',
    icon: Database
  },
  {
    name: 'API Gateway',
    status: 'healthy',
    responseTime: 28,
    uptime: 99.99,
    lastChecked: '1 min ago',
    icon: Globe
  },
  {
    name: 'Authentication',
    status: 'warning',
    responseTime: 156,
    uptime: 99.85,
    lastChecked: '1 min ago',
    icon: Shield
  },
  {
    name: 'Payment Gateway',
    status: 'healthy',
    responseTime: 89,
    uptime: 99.92,
    lastChecked: '1 min ago',
    icon: Zap
  },
  {
    name: 'Email Service',
    status: 'healthy',
    responseTime: 234,
    uptime: 99.88,
    lastChecked: '2 min ago',
    icon: Activity
  }
];

export default function SystemHealthCheck() {
  const [services, setServices] = useState<ServiceStatus[]>(SERVICES);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 45,
    memory: 62,
    disk: 38,
    network: 28
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchHealthData();
    const interval = setInterval(fetchHealthData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const fetchHealthData = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simulate random metric changes
    setMetrics({
      cpu: Math.floor(Math.random() * 30) + 40,
      memory: Math.floor(Math.random() * 20) + 55,
      disk: Math.floor(Math.random() * 15) + 35,
      network: Math.floor(Math.random() * 40) + 20
    });
    setLoading(false);
    setRefreshing(false);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchHealthData();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', dot: 'bg-green-400' };
      case 'warning': return { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', dot: 'bg-yellow-400' };
      case 'critical': return { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', dot: 'bg-orange-400' };
      case 'down': return { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', dot: 'bg-red-400' };
      default: return { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20', dot: 'bg-slate-400' };
    }
  };

  const getMetricColor = (value: number) => {
    if (value < 50) return 'text-green-400';
    if (value < 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  const healthyCount = services.filter(s => s.status === 'healthy').length;
  const warningCount = services.filter(s => s.status === 'warning').length;
  const criticalCount = services.filter(s => s.status === 'critical').length;
  const downCount = services.filter(s => s.status === 'down').length;

  if (loading && services.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 border border-slate-700">
        <div className="text-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"
          />
          <p className="mt-4 text-slate-400">Checking system health...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">System Health Check</h2>
          <p className="text-slate-400 mt-1">Monitor system services and performance metrics</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Overall Status */}
      <div className="glass rounded-2xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-400" />
            Overall System Status
          </h3>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-green-400">All Systems Operational</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-2xl font-bold text-green-400">{healthyCount}</span>
            </div>
            <p className="text-sm text-slate-300">Healthy</p>
          </div>

          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <span className="text-2xl font-bold text-yellow-400">{warningCount}</span>
            </div>
            <p className="text-sm text-slate-300">Warnings</p>
          </div>

          <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-orange-400" />
              <span className="text-2xl font-bold text-orange-400">{criticalCount}</span>
            </div>
            <p className="text-sm text-slate-300">Critical</p>
          </div>

          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-5 w-5 text-red-400" />
              <span className="text-2xl font-bold text-red-400">{downCount}</span>
            </div>
            <p className="text-sm text-slate-300">Down</p>
          </div>
        </div>
      </div>

      {/* Service Status */}
      <div className="glass rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <Server className="h-5 w-5 text-blue-400" />
          Service Status
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, index) => {
            const Icon = service.icon;
            const colors = getStatusColor(service.status);

            return (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border ${colors.border} ${colors.bg}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800/50 rounded-lg">
                      <Icon className={`h-5 w-5 ${colors.text}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-100">{service.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`w-2 h-2 rounded-full ${colors.dot} animate-pulse`} />
                        <span className={`text-xs font-medium ${colors.text} capitalize`}>
                          {service.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Response Time</span>
                    <span className="text-xs font-medium text-slate-100">{service.responseTime}ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Uptime</span>
                    <span className="text-xs font-medium text-green-400">{service.uptime}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Last Checked</span>
                    <span className="text-xs font-medium text-slate-100">{service.lastChecked}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* System Metrics */}
      <div className="glass rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-purple-400" />
          System Metrics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* CPU Usage */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-blue-400" />
                <span className="text-sm font-medium text-slate-300">CPU Usage</span>
              </div>
              <span className={`text-lg font-bold ${getMetricColor(metrics.cpu)}`}>
                {metrics.cpu}%
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${metrics.cpu}%` }}
                className={`h-2 rounded-full ${
                  metrics.cpu < 50 ? 'bg-green-400' :
                  metrics.cpu < 75 ? 'bg-yellow-400' : 'bg-red-400'
                }`}
              />
            </div>
          </div>

          {/* Memory Usage */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-400" />
                <span className="text-sm font-medium text-slate-300">Memory</span>
              </div>
              <span className={`text-lg font-bold ${getMetricColor(metrics.memory)}`}>
                {metrics.memory}%
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${metrics.memory}%` }}
                className={`h-2 rounded-full ${
                  metrics.memory < 50 ? 'bg-green-400' :
                  metrics.memory < 75 ? 'bg-yellow-400' : 'bg-red-400'
                }`}
              />
            </div>
          </div>

          {/* Disk Usage */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <HardDrive className="h-5 w-5 text-purple-400" />
                <span className="text-sm font-medium text-slate-300">Disk</span>
              </div>
              <span className={`text-lg font-bold ${getMetricColor(metrics.disk)}`}>
                {metrics.disk}%
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${metrics.disk}%` }}
                className={`h-2 rounded-full ${
                  metrics.disk < 50 ? 'bg-green-400' :
                  metrics.disk < 75 ? 'bg-yellow-400' : 'bg-red-400'
                }`}
              />
            </div>
          </div>

          {/* Network Usage */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Wifi className="h-5 w-5 text-yellow-400" />
                <span className="text-sm font-medium text-slate-300">Network</span>
              </div>
              <span className={`text-lg font-bold ${getMetricColor(metrics.network)}`}>
                {metrics.network}%
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${metrics.network}%` }}
                className={`h-2 rounded-full ${
                  metrics.network < 50 ? 'bg-green-400' :
                  metrics.network < 75 ? 'bg-yellow-400' : 'bg-red-400'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Trends */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-6 border border-slate-700">
          <h4 className="text-sm font-medium text-slate-400 mb-3">Avg. Response Time</h4>
          <p className="text-3xl font-bold text-slate-100 mb-2">78ms</p>
          <p className="text-sm text-green-400 flex items-center gap-1">
            <TrendingDown className="h-4 w-4" />
            12% faster than yesterday
          </p>
        </div>

        <div className="glass rounded-2xl p-6 border border-slate-700">
          <h4 className="text-sm font-medium text-slate-400 mb-3">Request Rate</h4>
          <p className="text-3xl font-bold text-slate-100 mb-2">1,247/min</p>
          <p className="text-sm text-green-400 flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            8% increase from last hour
          </p>
        </div>

        <div className="glass rounded-2xl p-6 border border-slate-700">
          <h4 className="text-sm font-medium text-slate-400 mb-3">Error Rate</h4>
          <p className="text-3xl font-bold text-slate-100 mb-2">0.12%</p>
          <p className="text-sm text-green-400 flex items-center gap-1">
            <TrendingDown className="h-4 w-4" />
            0.05% lower than average
          </p>
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="glass rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-cyan-400" />
          Recent Incidents
        </h3>

        <div className="space-y-3">
          {[
            { type: 'warning', service: 'Authentication Service', issue: 'High response time detected', time: '5 minutes ago', resolved: false },
            { type: 'resolved', service: 'Database', issue: 'Connection pool exhausted', time: '2 hours ago', resolved: true },
            { type: 'resolved', service: 'Payment Gateway', issue: 'API timeout', time: '5 hours ago', resolved: true },
            { type: 'resolved', service: 'Email Service', issue: 'Queue processing delay', time: '1 day ago', resolved: true }
          ].map((incident, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                incident.resolved
                  ? 'bg-slate-800/50 border-slate-700'
                  : 'bg-yellow-500/10 border-yellow-500/20'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${
                  incident.resolved ? 'bg-green-400' : 'bg-yellow-400 animate-pulse'
                }`} />
                <div>
                  <p className="text-sm font-medium text-slate-100">{incident.service}</p>
                  <p className="text-xs text-slate-400">{incident.issue} • {incident.time}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                incident.resolved
                  ? 'bg-green-500/10 text-green-400'
                  : 'bg-yellow-500/10 text-yellow-400'
              }`}>
                {incident.resolved ? 'Resolved' : 'Active'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
