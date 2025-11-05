"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell, Send, Mail, MessageSquare, Phone, Calendar, Users,
  CheckCircle, Clock, XCircle, TrendingUp, BarChart3, Filter,
  Search, Eye, Edit, Trash2, Plus, FileText, Zap, Target,
  Activity, AlertCircle, Download, Upload, Settings, RefreshCw
} from "lucide-react";

interface NotificationTemplate {
  id: string;
  name: string;
  channel: 'SMS' | 'EMAIL' | 'WHATSAPP' | 'IVR' | 'PUSH';
  category: 'TRANSACTIONAL' | 'PROMOTIONAL' | 'REMINDER' | 'ALERT';
  subject?: string;
  content: string;
  variables: string[];
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  sentCount: number;
  openRate?: number;
  clickRate?: number;
}

interface NotificationCampaign {
  id: string;
  name: string;
  templateId: string;
  channel: 'SMS' | 'EMAIL' | 'WHATSAPP' | 'IVR' | 'PUSH';
  targetAudience: string;
  scheduledDate: string;
  status: 'SCHEDULED' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  sent: number;
  delivered: number;
  failed: number;
  opened?: number;
  clicked?: number;
}

export default function NotificationEnginePage() {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: 'TPL001',
      name: 'Loan Approval Notification',
      channel: 'SMS',
      category: 'TRANSACTIONAL',
      content: 'Dear {{name}}, your loan of ₹{{amount}} has been approved! Ref: {{loanId}}',
      variables: ['name', 'amount', 'loanId'],
      status: 'ACTIVE',
      sentCount: 1245,
      openRate: 98.5
    },
    {
      id: 'TPL002',
      name: 'EMI Reminder Email',
      channel: 'EMAIL',
      category: 'REMINDER',
      subject: 'Your EMI is due on {{dueDate}}',
      content: 'Dear {{name}}, your EMI of ₹{{amount}} is due on {{dueDate}}. Please ensure payment.',
      variables: ['name', 'amount', 'dueDate'],
      status: 'ACTIVE',
      sentCount: 3456,
      openRate: 76.3,
      clickRate: 45.2
    },
    {
      id: 'TPL003',
      name: 'KYC Verification WhatsApp',
      channel: 'WHATSAPP',
      category: 'TRANSACTIONAL',
      content: 'Hi {{name}}! Your KYC has been verified successfully  Ref: {{kycId}}',
      variables: ['name', 'kycId'],
      status: 'ACTIVE',
      sentCount: 892,
      openRate: 99.1
    },
    {
      id: 'TPL004',
      name: 'Overdue Payment IVR',
      channel: 'IVR',
      category: 'ALERT',
      content: 'Your loan payment is overdue. Loan ID: {{loanId}}. Amount: {{amount}}',
      variables: ['loanId', 'amount'],
      status: 'ACTIVE',
      sentCount: 234
    }
  ]);

  const [campaigns, setCampaigns] = useState<NotificationCampaign[]>([
    {
      id: 'CMP001',
      name: 'January EMI Reminders',
      templateId: 'TPL002',
      channel: 'EMAIL',
      targetAudience: 'Active Borrowers',
      scheduledDate: '2024-01-25T09:00:00Z',
      status: 'COMPLETED',
      sent: 5678,
      delivered: 5543,
      failed: 135,
      opened: 4234,
      clicked: 2567
    },
    {
      id: 'CMP002',
      name: 'New Year Offers',
      templateId: 'TPL001',
      channel: 'SMS',
      targetAudience: 'All Customers',
      scheduledDate: '2024-02-01T10:00:00Z',
      status: 'SCHEDULED',
      sent: 0,
      delivered: 0,
      failed: 0
    },
    {
      id: 'CMP003',
      name: 'Overdue Accounts Follow-up',
      templateId: 'TPL004',
      channel: 'IVR',
      targetAudience: '30+ DPD Customers',
      scheduledDate: '2024-01-28T15:00:00Z',
      status: 'RUNNING',
      sent: 1245,
      delivered: 1198,
      failed: 47
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('ALL');
  const [viewMode, setViewMode] = useState<'templates' | 'campaigns' | 'analytics'>('templates');

  const stats = {
    totalSent: 156789,
    deliveryRate: 96.8,
    openRate: 78.3,
    clickRate: 34.7,
    activeTemplates: 45,
    activeCampaigns: 8,
    failedToday: 234,
    costThisMonth: 45678
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'SMS': return 'bg-blue-500/20 text-blue-400';
      case 'EMAIL': return 'bg-purple-500/20 text-purple-400';
      case 'WHATSAPP': return 'bg-emerald-500/20 text-emerald-400';
      case 'IVR': return 'bg-orange-500/20 text-orange-400';
      case 'PUSH': return 'bg-pink-500/20 text-pink-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': case 'COMPLETED': return 'bg-emerald-500/20 text-emerald-400';
      case 'RUNNING': return 'bg-blue-500/20 text-blue-400';
      case 'SCHEDULED': return 'bg-purple-500/20 text-purple-400';
      case 'DRAFT': return 'bg-yellow-500/20 text-yellow-400';
      case 'FAILED': case 'ARCHIVED': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'TRANSACTIONAL': return 'bg-blue-500/20 text-blue-400';
      case 'PROMOTIONAL': return 'bg-purple-500/20 text-purple-400';
      case 'REMINDER': return 'bg-yellow-500/20 text-yellow-400';
      case 'ALERT': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const filteredTemplates = templates.filter(t => {
    const matchesChannel = selectedChannel === 'ALL' || t.channel === selectedChannel;
    const matchesSearch = searchTerm === '' ||
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesChannel && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <Bell className="w-8 h-8 text-blue-400" />
            Notification Engine & Templates
          </h1>
          <p className="text-slate-400 mt-1">SMS, Email, WhatsApp, IVR & Push notification management</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 rounded-lg hover:shadow-glow transition-all border border-slate-700"
          >
            <Settings className="w-4 h-4" />
            Configure Channels
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 gradient-primary text-white rounded-lg hover:shadow-glow transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Template
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-2">
            <Send className="w-6 h-6 text-blue-400" />
          </div>
          <p className="text-sm text-slate-400">Total Sent</p>
          <p className="text-2xl font-bold text-white">{stats.totalSent.toLocaleString()}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
          </div>
          <p className="text-sm text-slate-400">Delivery Rate</p>
          <p className="text-2xl font-bold text-emerald-400">{stats.deliveryRate}%</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-2">
            <Eye className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-sm text-slate-400">Open Rate</p>
          <p className="text-2xl font-bold text-purple-400">{stats.openRate}%</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-2">
            <Target className="w-6 h-6 text-yellow-400" />
          </div>
          <p className="text-sm text-slate-400">Click Rate</p>
          <p className="text-2xl font-bold text-yellow-400">{stats.clickRate}%</p>
        </motion.div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode('templates')}
          className={`px-6 py-2 rounded-lg transition-colors ${
            viewMode === 'templates' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400'
          }`}
        >
          Templates
        </button>
        <button
          onClick={() => setViewMode('campaigns')}
          className={`px-6 py-2 rounded-lg transition-colors ${
            viewMode === 'campaigns' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-400'
          }`}
        >
          Campaigns
        </button>
        <button
          onClick={() => setViewMode('analytics')}
          className={`px-6 py-2 rounded-lg transition-colors ${
            viewMode === 'analytics' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
          }`}
        >
          Analytics
        </button>
      </div>

      {viewMode === 'templates' && (
        <>
          {/* Filters */}
          <div className="glass rounded-2xl p-6 border border-slate-700">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <select
                  value={selectedChannel}
                  onChange={(e) => setSelectedChannel(e.target.value)}
                  className="px-4 py-2 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All Channels</option>
                  <option value="SMS">SMS</option>
                  <option value="EMAIL">Email</option>
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="IVR">IVR</option>
                  <option value="PUSH">Push</option>
                </select>
              </div>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-6 border border-slate-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-200 mb-2">{template.name}</h3>
                    <div className="flex gap-2 flex-wrap">
                      <span className={`inline-block px-2 py-1 rounded text-xs ${getChannelColor(template.channel)}`}>
                        {template.channel}
                      </span>
                      <span className={`inline-block px-2 py-1 rounded text-xs ${getCategoryColor(template.category)}`}>
                        {template.category}
                      </span>
                      <span className={`inline-block px-2 py-1 rounded text-xs ${getStatusColor(template.status)}`}>
                        {template.status}
                      </span>
                    </div>
                  </div>
                </div>

                {template.subject && (
                  <div className="mb-3">
                    <p className="text-xs text-slate-500 mb-1">Subject:</p>
                    <p className="text-sm text-slate-300">{template.subject}</p>
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-xs text-slate-500 mb-1">Content:</p>
                  <p className="text-sm text-slate-300 line-clamp-3">{template.content}</p>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-slate-500 mb-2">Variables:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.variables.map((v, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-800 text-blue-400 rounded text-xs font-mono">
                        {`{{${v}}}`}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-4 mb-4">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-lg font-bold text-white">{template.sentCount}</p>
                      <p className="text-xs text-slate-400">Sent</p>
                    </div>
                    {template.openRate && (
                      <div>
                        <p className="text-lg font-bold text-purple-400">{template.openRate}%</p>
                        <p className="text-xs text-slate-400">Opens</p>
                      </div>
                    )}
                    {template.clickRate && (
                      <div>
                        <p className="text-lg font-bold text-emerald-400">{template.clickRate}%</p>
                        <p className="text-xs text-slate-400">Clicks</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm">
                    <Eye className="w-4 h-4 mx-auto" />
                  </button>
                  <button className="flex-1 p-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors text-sm">
                    <Edit className="w-4 h-4 mx-auto" />
                  </button>
                  <button className="flex-1 p-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors text-sm">
                    <Send className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {viewMode === 'campaigns' && (
        <div className="glass rounded-2xl border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Campaign</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Channel</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Audience</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Scheduled</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Performance</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {campaigns.map((campaign, index) => (
                <motion.tr
                  key={campaign.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-slate-200">{campaign.name}</p>
                      <p className="text-xs text-slate-500">{campaign.targetAudience}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs ${getChannelColor(campaign.channel)}`}>
                      {campaign.channel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">{campaign.targetAudience}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">
                    {new Date(campaign.scheduledDate).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Sent:</span>
                        <span className="text-white font-medium">{campaign.sent}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Delivered:</span>
                        <span className="text-emerald-400 font-medium">{campaign.delivered}</span>
                      </div>
                      {campaign.failed > 0 && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Failed:</span>
                          <span className="text-red-400 font-medium">{campaign.failed}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewMode === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Channel Performance
            </h3>
            <div className="space-y-4">
              {['SMS', 'EMAIL', 'WHATSAPP', 'IVR'].map((channel) => {
                const rate = Math.floor(Math.random() * 30) + 70;
                return (
                  <div key={channel}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-300">{channel}</span>
                      <span className="text-sm font-medium text-white">{rate}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                        style={{ width: `${rate}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass rounded-2xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Weekly Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                <span className="text-sm text-slate-300">Messages Sent</span>
                <span className="text-lg font-bold text-white">45,678</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                <span className="text-sm text-slate-300">Delivery Rate</span>
                <span className="text-lg font-bold text-emerald-400">96.8%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                <span className="text-sm text-slate-300">Cost</span>
                <span className="text-lg font-bold text-white">₹{stats.costThisMonth.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                <span className="text-sm text-slate-300">Failed</span>
                <span className="text-lg font-bold text-red-400">{stats.failedToday}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}