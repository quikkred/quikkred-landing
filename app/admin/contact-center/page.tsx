"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Headphones, Phone, Mail, MessageSquare, Clock, CheckCircle,
  AlertCircle, Users, TrendingUp, Activity, BarChart3, Target,
  PhoneCall, PhoneIncoming, PhoneOutgoing, PhoneMissed, Timer,
  Award, Star, UserCheck, Search, Filter, Eye, Download
} from "lucide-react";

interface Ticket {
  id: string;
  customerId: string;
  customerName: string;
  subject: string;
  channel: 'PHONE' | 'EMAIL' | 'CHAT' | 'WHATSAPP';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  assignedTo: string;
  createdAt: string;
  resolvedAt?: string;
  responseTime?: number;
  resolutionTime?: number;
}

interface AgentStats {
  id: string;
  name: string;
  status: 'AVAILABLE' | 'BUSY' | 'BREAK' | 'OFFLINE';
  callsHandled: number;
  avgHandleTime: number;
  satisfaction: number;
  ticketsResolved: number;
  activeTickets: number;
}

export default function ContactCenterPage() {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 'TKT001',
      customerId: 'CU001',
      customerName: 'Rahul Sharma',
      subject: 'EMI payment not reflecting',
      channel: 'PHONE',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      assignedTo: 'Agent 1',
      createdAt: '2024-01-28T10:30:00Z',
      responseTime: 45
    },
    {
      id: 'TKT002',
      customerId: 'CU002',
      customerName: 'Priya Patel',
      subject: 'Loan closure process query',
      channel: 'EMAIL',
      priority: 'MEDIUM',
      status: 'OPEN',
      assignedTo: 'Agent 2',
      createdAt: '2024-01-28T11:00:00Z'
    }
  ]);

  const [agents, setAgents] = useState<AgentStats[]>([
    {
      id: 'AGT001',
      name: 'Amit Kumar',
      status: 'AVAILABLE',
      callsHandled: 45,
      avgHandleTime: 4.5,
      satisfaction: 4.8,
      ticketsResolved: 32,
      activeTickets: 2
    }
  ]);

  const stats = {
    totalCalls: 1234,
    incomingCalls: 987,
    outgoingCalls: 247,
    missedCalls: 23,
    avgWaitTime: 32,
    avgHandleTime: 4.2,
    firstCallResolution: 78.5,
    customerSatisfaction: 4.6,
    activeTickets: 156,
    resolvedToday: 234,
    avgResponseTime: 45,
    avgResolutionTime: 2.3
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-blue-500/20 text-blue-400';
      case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-400';
      case 'HIGH': return 'bg-orange-500/20 text-orange-400';
      case 'URGENT': return 'bg-red-600/30 text-red-300';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-500/20 text-blue-400';
      case 'IN_PROGRESS': return 'bg-yellow-500/20 text-yellow-400';
      case 'RESOLVED': case 'CLOSED': return 'bg-emerald-500/20 text-emerald-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getAgentStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-emerald-500/20 text-emerald-400';
      case 'BUSY': return 'bg-red-500/20 text-red-400';
      case 'BREAK': return 'bg-yellow-500/20 text-yellow-400';
      case 'OFFLINE': return 'bg-slate-500/20 text-slate-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <Headphones className="w-8 h-8 text-blue-400" />
            Contact Center Dashboard
          </h1>
          <p className="text-slate-400 mt-1">Call routing, ticketing & agent performance monitoring</p>
        </div>
      </div>

      {/* Call Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: PhoneIncoming, label: 'Incoming Calls', value: stats.incomingCalls, color: 'blue' },
          { icon: PhoneOutgoing, label: 'Outgoing Calls', value: stats.outgoingCalls, color: 'emerald' },
          { icon: PhoneMissed, label: 'Missed Calls', value: stats.missedCalls, color: 'red' },
          { icon: Star, label: 'CSAT Score', value: stats.customerSatisfaction, color: 'yellow' }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-6 border border-slate-700"
          >
            <stat.icon className={`w-6 h-6 text-${stat.color}-400 mb-2`} />
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <Timer className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Response Time</h3>
          </div>
          <p className="text-3xl font-bold text-blue-400">{stats.avgResponseTime}s</p>
          <p className="text-sm text-slate-400 mt-1">Average response time</p>
        </div>

        <div className="glass rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Handle Time</h3>
          </div>
          <p className="text-3xl font-bold text-emerald-400">{stats.avgHandleTime}m</p>
          <p className="text-sm text-slate-400 mt-1">Average handle time</p>
        </div>

        <div className="glass rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">FCR Rate</h3>
          </div>
          <p className="text-3xl font-bold text-purple-400">{stats.firstCallResolution}%</p>
          <p className="text-sm text-slate-400 mt-1">First call resolution</p>
        </div>
      </div>

      {/* Agent Dashboard */}
      <div className="glass rounded-2xl border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white">Agent Performance</h3>
        </div>
        <table className="w-full">
          <thead className="bg-slate-800/50 border-b border-slate-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Agent</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Calls</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Avg Time</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Satisfaction</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Tickets</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {agents.map((agent) => (
              <tr key={agent.id} className="hover:bg-slate-800/30">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-200">{agent.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs ${getAgentStatusColor(agent.status)}`}>
                    {agent.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-300">{agent.callsHandled}</td>
                <td className="px-6 py-4 text-sm text-slate-300">{agent.avgHandleTime}m</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium text-yellow-400">{agent.satisfaction}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-300">{agent.ticketsResolved} / {agent.activeTickets}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tickets */}
      <div className="glass rounded-2xl border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white">Active Tickets</h3>
        </div>
        <table className="w-full">
          <thead className="bg-slate-800/50 border-b border-slate-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Ticket ID</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Customer</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Subject</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Channel</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Priority</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Assigned</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-slate-800/30">
                <td className="px-6 py-4 text-sm font-medium text-blue-400">{ticket.id}</td>
                <td className="px-6 py-4 text-sm text-slate-300">{ticket.customerName}</td>
                <td className="px-6 py-4 text-sm text-slate-200">{ticket.subject}</td>
                <td className="px-6 py-4">
                  <span className="text-xs text-slate-400">{ticket.channel}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-300">{ticket.assignedTo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}