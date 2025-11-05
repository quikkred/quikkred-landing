"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare, Send, Users, Bell, Mail, Smartphone,
  CheckCircle, Clock, Target, Filter, FileText, AlertCircle
} from "lucide-react";

interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  message: string;
  type: 'email' | 'sms' | 'push' | 'all';
}

interface BroadcastStats {
  sent: number;
  delivered: number;
  opened: number;
  failed: number;
}

const NOTIFICATION_TYPES = [
  { id: 'email', label: 'Email', icon: Mail, color: 'blue', description: 'Send via email' },
  { id: 'sms', label: 'SMS', icon: Smartphone, color: 'green', description: 'Send via SMS' },
  { id: 'push', label: 'Push', icon: Bell, color: 'purple', description: 'Push notification' },
  { id: 'all', label: 'All Channels', icon: MessageSquare, color: 'yellow', description: 'Multi-channel' }
];

const TEMPLATES: NotificationTemplate[] = [
  {
    id: 'loan_approved',
    name: 'Loan Approved',
    subject: 'Your loan has been approved!',
    message: 'Congratulations! Your loan application has been approved. Please check your dashboard for details.',
    type: 'all'
  },
  {
    id: 'payment_reminder',
    name: 'Payment Reminder',
    subject: 'EMI Payment Due',
    message: 'This is a friendly reminder that your EMI payment is due in 3 days.',
    type: 'email'
  },
  {
    id: 'kyc_pending',
    name: 'KYC Pending',
    subject: 'Complete your KYC verification',
    message: 'Your KYC verification is pending. Please upload the required documents to proceed.',
    type: 'sms'
  },
  {
    id: 'document_request',
    name: 'Document Request',
    subject: 'Additional documents required',
    message: 'We need some additional documents to process your application.',
    type: 'email'
  }
];

const AUDIENCE_OPTIONS = [
  { id: 'all', label: 'All Users', count: '4,856' },
  { id: 'active', label: 'Active Users', count: '3,245' },
  { id: 'pending', label: 'Pending Applications', count: '856' },
  { id: 'overdue', label: 'Overdue Payments', count: '234' },
  { id: 'kyc_pending', label: 'KYC Pending', count: '567' },
  { id: 'custom', label: 'Custom Segment', count: 'Configure' }
];

export default function NotificationBroadcast() {
  const [selectedType, setSelectedType] = useState<string>('email');
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [audience, setAudience] = useState<string>('all');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [stats, setStats] = useState<BroadcastStats | null>(null);

  const handleSend = async () => {
    setSending(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setStats({ sent: 4856, delivered: 4823, opened: 3245, failed: 33 });
    setSending(false);
  };

  const handleTemplateSelect = (template: NotificationTemplate) => {
    setSelectedTemplate(template);
    setSubject(template.subject);
    setMessage(template.message);
    setSelectedType(template.type);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Notification Broadcast</h2>
        <p className="text-slate-400 mt-1">Send notifications to multiple users across different channels</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Send className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Sent This Month</p>
              <p className="text-lg font-bold text-slate-100">12,456</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Delivery Rate</p>
              <p className="text-lg font-bold text-slate-100">98.7%</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Target className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Open Rate</p>
              <p className="text-lg font-bold text-slate-100">67.2%</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Avg. Response Time</p>
              <p className="text-sm font-medium text-slate-100">2.4 hours</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Type Selection */}
      <div className="glass rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-400" />
          Select Channel
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {NOTIFICATION_TYPES.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  selectedType === type.id
                    ? `border-${type.color}-500 bg-${type.color}-500/10`
                    : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                }`}
              >
                <div className={`p-3 rounded-lg ${selectedType === type.id ? `bg-${type.color}-500/10` : 'bg-slate-700'} mx-auto w-fit mb-2`}>
                  <Icon className={`h-6 w-6 ${selectedType === type.id ? `text-${type.color}-400` : 'text-slate-400'}`} />
                </div>
                <p className="text-sm font-medium text-slate-100 mb-1">{type.label}</p>
                <p className="text-xs text-slate-400">{type.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Templates */}
      <div className="glass rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-green-400" />
          Quick Templates
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedTemplate?.id === template.id
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-medium text-slate-100">{template.name}</p>
                <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-300">
                  {template.type.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400">{template.subject}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Audience Selection */}
      <div className="glass rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-purple-400" />
          Select Audience
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {AUDIENCE_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => setAudience(option.id)}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                audience === option.id
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
              }`}
            >
              <p className="text-sm font-medium text-slate-100 mb-1">{option.label}</p>
              <p className={`text-xs ${audience === option.id ? 'text-purple-400' : 'text-slate-400'}`}>
                {option.count}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Message Composer */}
      <div className="glass rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-yellow-400" />
          Compose Message
        </h3>

        <div className="space-y-4">
          {/* Subject */}
          {selectedType !== 'sms' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Subject Line
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter notification subject"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-100 placeholder-slate-500"
              />
            </div>
          )}

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Message Content
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              placeholder="Enter your message here..."
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-100 placeholder-slate-500"
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-slate-400">
                {selectedType === 'sms' ? `${message.length}/160 characters` : `${message.length} characters`}
              </p>
              <div className="flex gap-2">
                <button className="text-xs text-blue-400 hover:underline">Insert Variable</button>
                <button className="text-xs text-blue-400 hover:underline">Add Link</button>
              </div>
            </div>
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Delivery Options
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-300">Send immediately</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-300">Schedule for later</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-300">Track open rates</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-300">Send test message first</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Send Button */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-slate-400">
          Will be sent to <span className="text-slate-100 font-medium">4,856 users</span> via{' '}
          <span className="text-slate-100 font-medium">{selectedType}</span>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors">
            Save as Draft
          </button>
          <button
            onClick={handleSend}
            disabled={sending || !subject || !message}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                Send Now
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-green-500/20 bg-green-500/5"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Broadcast Completed</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Total Sent</p>
                  <p className="text-2xl font-bold text-slate-100">{stats.sent}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Delivered</p>
                  <p className="text-2xl font-bold text-green-400">{stats.delivered}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Opened</p>
                  <p className="text-2xl font-bold text-blue-400">{stats.opened}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Failed</p>
                  <p className="text-2xl font-bold text-red-400">{stats.failed}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recent Broadcasts */}
      <div className="glass rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-cyan-400" />
          Recent Broadcasts
        </h3>

        <div className="space-y-3">
          {[
            { title: 'Payment Reminder - December', channel: 'Email', sent: 4856, delivered: 4823, time: '2 hours ago', status: 'completed' },
            { title: 'Loan Approval Notification', channel: 'SMS + Push', sent: 234, delivered: 234, time: '5 hours ago', status: 'completed' },
            { title: 'KYC Pending Alert', channel: 'Email', sent: 567, delivered: 556, time: '1 day ago', status: 'completed' },
            { title: 'New Feature Announcement', channel: 'Push', sent: 3245, delivered: 3198, time: '2 days ago', status: 'completed' },
            { title: 'Document Upload Request', channel: 'Email + SMS', sent: 856, delivered: 845, time: '3 days ago', status: 'completed' }
          ].map((broadcast, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-100">{broadcast.title}</p>
                  <p className="text-xs text-slate-400">
                    {broadcast.channel} • Sent: {broadcast.sent} • Delivered: {broadcast.delivered} • {broadcast.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs text-green-400">
                  <CheckCircle className="h-3 w-3" />
                  {broadcast.status}
                </span>
                <button className="text-blue-400 hover:text-blue-300 text-sm">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
