'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';

interface DashboardHookOptions {
  refreshInterval?: number;
  enabled?: boolean;
}

interface DashboardHookReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

// Generic dashboard data fetcher
export function useDashboardData<T = any>(
  role: UserRole,
  options: DashboardHookOptions = {}
): DashboardHookReturn<T> {
  const { refreshInterval = 30000, enabled = true } = options;
  const { user } = useAuth();

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled || !user || user.role !== role) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const endpoint = `/api/dashboard/${role.toLowerCase().replace('_', '-')}`;
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [role, enabled, user]);

  useEffect(() => {
    fetchData();

    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, refreshInterval]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    lastUpdated
  };
}

// Specific hooks for each role
export function useUserDashboard(options?: DashboardHookOptions) {
  return useDashboardData<{
    profile: any;
    loans: any;
    financials: any;
    rewards: any;
    notifications: any;
    quickActions: any;
    recentTransactions: any;
  }>('USER', options);
}

export function useUnderwriterDashboard(options?: DashboardHookOptions) {
  return useDashboardData<{
    overview: any;
    applications: any;
    riskMetrics: any;
    workload: any;
  }>('UNDERWRITER', options);
}

export function useCollectionAgentDashboard(options?: DashboardHookOptions) {
  return useDashboardData<{
    overview: any;
    collectionQueue: any;
    bucketDistribution: any;
    performance: any;
    fieldVisits: any;
  }>('COLLECTION_AGENT', options);
}

export function useFinanceManagerDashboard(options?: DashboardHookOptions) {
  return useDashboardData<{
    overview: any;
    pnlSummary: any;
    portfolioBreakdown: any;
    compliance: any;
    riskMetrics: any;
    monthlyTrends: any;
  }>('FINANCE_MANAGER', options);
}

export function useRiskAnalystDashboard(options?: DashboardHookOptions) {
  return useDashboardData<{
    overview: any;
    modelPerformance: any;
    riskAlerts: any;
    stressTestResults: any;
    riskTrends: any;
    portfolioMetrics: any;
  }>('RISK_ANALYST', options);
}

export function useSupportAgentDashboard(options?: DashboardHookOptions) {
  return useDashboardData<{
    overview: any;
    tickets: any;
    categoryStats: any;
    channelStats: any;
    performance: any;
    knowledgeBase: any;
    recentCalls: any;
    dailyMetrics: any;
  }>('SUPPORT_AGENT', options);
}

// Real-time updates hook
export function useRealtimeDashboard<T>(
  role: UserRole,
  pollingInterval: number = 5000
) {
  const [isRealtime, setIsRealtime] = useState(false);
  const [updateCount, setUpdateCount] = useState(0);

  const dashboardData = useDashboardData<T>(role, {
    refreshInterval: isRealtime ? pollingInterval : 0,
    enabled: true
  });

  useEffect(() => {
    if (isRealtime && dashboardData.data) {
      setUpdateCount(prev => prev + 1);
    }
  }, [isRealtime, dashboardData.data]);

  const toggleRealtime = useCallback(() => {
    setIsRealtime(prev => !prev);
  }, []);

  return {
    ...dashboardData,
    isRealtime,
    updateCount,
    toggleRealtime
  };
}

// Performance monitoring hook
export function useDashboardPerformance() {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    apiResponseTime: 0,
    errorRate: 0,
    lastError: null as string | null
  });

  const recordLoadTime = useCallback((time: number) => {
    setMetrics(prev => ({ ...prev, loadTime: time }));
  }, []);

  const recordApiTime = useCallback((time: number) => {
    setMetrics(prev => ({ ...prev, apiResponseTime: time }));
  }, []);

  const recordError = useCallback((error: string) => {
    setMetrics(prev => ({
      ...prev,
      errorRate: prev.errorRate + 1,
      lastError: error
    }));
  }, []);

  return {
    metrics,
    recordLoadTime,
    recordApiTime,
    recordError
  };
}