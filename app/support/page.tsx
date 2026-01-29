"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, Send, Paperclip, Search, Plus,
  Phone, Mail, Clock, CheckCircle, AlertCircle,
  User, Bot, ChevronDown, X, Filter, Star,
  HelpCircle, FileText, Loader2, Mic, MicOff
} from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { supportService } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  status: "open" | "in_progress" | "resolved" | "closed" | "reopened";
  createdAt: string;
  lastUpdate: string;
  messages: Message[];
}

interface Message {
  id: string;
  sender: "user" | "agent" | "bot";
  senderName?: string;
  message: string;
  timestamp: string;
  attachments?: string[];
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: boolean;
}

export default function SupportPage() {
  const { t } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState("tickets");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // AI Chat state
  const [aiChatMessages, setAIChatMessages] = useState<Message[]>([]);
  const [aiChatStarted, setAIChatStarted] = useState(false);
  const [isAITyping, setIsAITyping] = useState(false);
  const [aiMessage, setAIMessage] = useState("");
  const aiChatEndRef = useRef<HTMLDivElement>(null);

  const [newTicket, setNewTicket] = useState({
    subject: "",
    category: "general",
    description: ""
  });

  const categories = [
    { value: "general", label: "General Query" },
    { value: "loan", label: "Loan Related" },
    { value: "payment", label: "Payment Issues" },
    { value: "kyc", label: "KYC Verification" },
    { value: "technical", label: "Technical Support" },
    { value: "complaint", label: "Complaint" }
  ];

  const priorities = [
    { value: "low", label: "Low", color: "bg-gray-100 text-gray-800" },
    { value: "medium", label: "Medium", color: "bg-[#FF9C70]/10 text-[#FF9C70]" },
    { value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
    { value: "critical", label: "Critical", color: "bg-red-100 text-red-800" }
  ];

  useEffect(() => {
    fetchSupportData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [selectedTicket?.messages]);

  useEffect(() => {
    aiChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiChatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchSupportData = async () => {
    try {
      setIsLoading(true);

      // Fetch tickets and FAQs
      const [ticketsRes, faqsRes] = await Promise.allSettled([
        supportService.getTickets(),
        supportService.getFAQs()
      ]);

      // Process tickets
      if (ticketsRes.status === 'fulfilled' && ticketsRes.value.success && ticketsRes.value.data) {
        // Map SupportTicket to Ticket format
        const mappedTickets = ticketsRes.value.data.tickets.map((ticket: any) => ({
          id: ticket.id,
          ticketNumber: ticket.ticketNumber,
          subject: ticket.subject,
          category: ticket.category,
          status: ticket.status,
          createdAt: ticket.createdAt,
          lastUpdate: ticket.updatedAt,
          messages: []
        }));
        setTickets(mappedTickets);
      } else {
        // Mock tickets
        setTickets([
          {
            id: "1",
            ticketNumber: "TKT001",
            subject: "Unable to make payment",
            category: "payment",
            status: "open",
            createdAt: new Date().toISOString(),
            lastUpdate: new Date().toISOString(),
            messages: [
              {
                id: "1",
                sender: "user",
                message: "I'm trying to pay my EMI but the payment is failing",
                timestamp: new Date().toISOString()
              },
              {
                id: "2",
                sender: "agent",
                senderName: "Support Agent",
                message: "I understand you're having trouble with your payment. Let me help you with that. Can you please share the error message you're seeing?",
                timestamp: new Date().toISOString()
              }
            ]
          }
        ]);
      }

      // Process FAQs
      if (faqsRes.status === 'fulfilled' && faqsRes.value.success && faqsRes.value.data) {
        // Map API FAQ to page FAQ format
        const mappedFAQs = faqsRes.value.data.map((faq: any) => ({
          id: faq.id,
          question: faq.question,
          answer: faq.answer,
          category: faq.category,
          helpful: false // Initialize as false, user hasn't voted yet
        }));
        setFAQs(mappedFAQs);
      } else {
        // Mock FAQs
        setFAQs([
          {
            id: "1",
            question: "How do I apply for a loan?",
            answer: "You can apply for a loan by clicking on the 'Apply Now' button on our homepage. Fill in the application form with your personal and employment details, upload required documents, and submit. You'll receive instant approval decision.",
            category: "loan",
            helpful: true
          },
          {
            id: "2",
            question: "What documents are required for KYC?",
            answer: "For KYC verification, you need to provide: 1) PAN Card, 2) Aadhaar Card, 3) Selfie with document, 4) Bank Statement (last 3 months), 5) Salary Slip (if salaried).",
            category: "kyc",
            helpful: true
          },
          {
            id: "3",
            question: "How can I track my loan application?",
            answer: "You can track your loan application by logging into your account and visiting the 'Track Application' section. You'll see real-time status updates of your application.",
            category: "loan",
            helpful: true
          }
        ]);
      }
    } catch (error) {
      console.error("Failed to fetch support data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!newTicket.subject || !newTicket.description) return;

    setIsSending(true);
    try {
      const response = await supportService.createTicket({
        subject: newTicket.subject,
        description: newTicket.description,
        category: newTicket.category
      });

      if (response.success && response.data) {
        const ticket: Ticket = {
          id: response.data.id,
          ticketNumber: response.data.ticketNumber,
          subject: response.data.subject,
          category: response.data.category,
          status: response.data.status,
          createdAt: response.data.createdAt,
          lastUpdate: response.data.updatedAt,
          messages: [
            {
              id: "1",
              sender: "user",
              message: newTicket.description,
              timestamp: new Date().toISOString()
            }
          ]
        };
        setTickets([ticket, ...tickets]);
        setSelectedTicket(ticket);
        setIsCreatingTicket(false);
        setNewTicket({
          subject: "",
          category: "general",
          description: ""
        });
      }
    } catch (error) {
      console.error("Failed to create ticket:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedTicket) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      message: message.trim(),
      timestamp: new Date().toISOString()
    };

    // Optimistically update UI
    setSelectedTicket({
      ...selectedTicket,
      messages: [...selectedTicket.messages, newMessage]
    });
    setMessage("");
    setIsSending(true);

    try {
      await supportService.sendMessage(selectedTicket.id, message);

      // Simulate agent response after 2 seconds
      setTimeout(() => {
        const agentMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: "agent",
          senderName: "Support Agent",
          message: "Thank you for your message. I'm looking into this for you.",
          timestamp: new Date().toISOString()
        };

        setSelectedTicket(prev => prev ? {
          ...prev,
          messages: [...prev.messages, agentMessage]
        } : null);
      }, 2000);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleFAQRating = async (faqId: string, helpful: boolean) => {
    try {
      await supportService.rateFAQ(faqId, helpful);
      setFAQs(prev => prev.map(faq =>
        faq.id === faqId ? { ...faq, helpful } : faq
      ));
    } catch (error) {
      console.error("Failed to rate FAQ:", error);
    }
  };

  // AI Chat Functions
  const startAIChat = () => {
    setAIChatStarted(true);
    // Add welcome message
    const welcomeMessage: Message = {
      id: "welcome",
      sender: "bot",
      senderName: "Quikkred AI",
      message: "नमस्ते! 🙏 Welcome to Quikkred Support! I'm your AI assistant, here to help you 24/7.\n\nI can help you with:\n• Loan information & eligibility\n• Application status tracking\n• EMI calculations\n• Payment issues\n• KYC verification\n• Creating support tickets\n\nHow can I assist you today? (आप हिंदी में भी पूछ सकते हैं)",
      timestamp: new Date().toISOString()
    };
    setAIChatMessages([welcomeMessage]);
  };

  const handleAIChatSend = async () => {
    if (!aiMessage.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      message: aiMessage.trim(),
      timestamp: new Date().toISOString()
    };

    setAIChatMessages(prev => [...prev, userMsg]);
    const currentMessage = aiMessage;
    setAIMessage("");
    setIsAITyping(true);

    try {
      // Convert messages to conversation history format
      const conversationHistory = aiChatMessages
        .filter(m => m.id !== "welcome")
        .map(m => ({
          role: m.sender === "user" ? "user" as const : "assistant" as const,
          content: m.message
        }));

      const response = await supportService.sendAIChatMessage(currentMessage, conversationHistory);

      if (response.success && response.data) {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          senderName: "Quikkred AI",
          message: response.data.response,
          timestamp: new Date().toISOString()
        };
        setAIChatMessages(prev => [...prev, aiResponse]);

        // If a ticket was created, show additional info
        if (response.data.ticketCreated && response.data.ticketNumber) {
          const ticketMsg: Message = {
            id: (Date.now() + 2).toString(),
            sender: "bot",
            senderName: "System",
            message: `✅ Support ticket created: **${response.data.ticketNumber}**\nOur team will respond within 24 hours.`,
            timestamp: new Date().toISOString()
          };
          setTimeout(() => {
            setAIChatMessages(prev => [...prev, ticketMsg]);
          }, 500);
        }
      } else {
        throw new Error("Failed to get AI response");
      }
    } catch (error) {
      console.error("AI Chat error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        senderName: "System",
        message: "I apologize, but I'm having trouble processing your request. Please try again or contact us at support@quikkred.com",
        timestamp: new Date().toISOString()
      };
      setAIChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsAITyping(false);
    }
  };

  const quickQuestions = [
    "How do I apply for a loan?",
    "What documents are required?",
    "मुझे EMI कैसे calculate करें?",
    "Check my application status",
    "Interest rates क्या हैं?"
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-[#4A66FF]/10 text-[#4A66FF]";
      case "in_progress": return "bg-[#FF9C70]/10 text-[#FF9C70]";
      case "resolved": return "bg-[#25B181]/10 text-[#25B181]";
      case "closed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#4A66FF]" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Support Center</h1>
            <p className="text-gray-600 mt-2">Get help with your queries and issues</p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <button className="bg-white rounded-lg shadow p-4 flex items-center space-x-3 hover:shadow-md transition-shadow">
              <Mail className="w-8 h-8 text-[#4A66FF]" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">Email Us</p>
                <p className="text-sm text-gray-600">support@quikkred.com</p>
              </div>
            </button>

            <button className="bg-white rounded-lg shadow p-4 flex items-center space-x-3 hover:shadow-md transition-shadow">
              <Mail className="w-8 h-8 text-[#25B181]" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">Loans</p>
                <p className="text-sm text-gray-600">loans@quikkred.com</p>
              </div>
            </button>

            <button className="bg-white rounded-lg shadow p-4 flex items-center space-x-3 hover:shadow-md transition-shadow">
              <MessageSquare className="w-8 h-8 text-purple-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">WhatsApp</p>
                <p className="text-sm text-gray-600">+91 98765 43210</p>
              </div>
            </button>

            <button className="bg-white rounded-lg shadow p-4 flex items-center space-x-3 hover:shadow-md transition-shadow">
              <Clock className="w-8 h-8 text-[#FF9C70]" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">Working Hours</p>
                <p className="text-sm text-gray-600">Mon-Sat 9AM-7PM</p>
              </div>
            </button>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200">
              <div className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab("tickets")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "tickets"
                      ? "border-[#4A66FF] text-[#4A66FF]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Support Tickets
                </button>
                <button
                  onClick={() => setActiveTab("faq")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "faq"
                      ? "border-[#4A66FF] text-[#4A66FF]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  FAQs
                </button>
                <button
                  onClick={() => setActiveTab("live-chat")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "live-chat"
                      ? "border-[#4A66FF] text-[#4A66FF]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Live Chat
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Tickets Tab */}
              {activeTab === "tickets" && (
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Tickets List */}
                  <div className="lg:col-span-1">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Your Tickets</h3>
                      <button
                        onClick={() => setIsCreatingTicket(true)}
                        className="flex items-center space-x-2 text-[#4A66FF] hover:text-[#4A66FF]/80"
                      >
                        <Plus className="w-4 h-4" />
                        <span>New</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {tickets.length === 0 ? (
                        <div className="text-center py-8">
                          <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600">No support tickets yet</p>
                          <button
                            onClick={() => setIsCreatingTicket(true)}
                            className="mt-3 text-[#4A66FF] hover:text-[#4A66FF]/80"
                          >
                            Create your first ticket
                          </button>
                        </div>
                      ) : (
                        tickets.map((ticket) => (
                          <motion.div
                            key={ticket.id}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setSelectedTicket(ticket)}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedTicket?.id === ticket.id
                                ? "border-[#4A66FF] bg-[#4A66FF]/5"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-gray-900 line-clamp-1">
                                {ticket.subject}
                              </h4>
                              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                getStatusColor(ticket.status)
                              }`}>
                                {ticket.status.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">#{ticket.ticketNumber}</p>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Chat Area */}
                  <div className="lg:col-span-2">
                    {selectedTicket ? (
                      <div className="flex flex-col h-[600px]">
                        {/* Chat Header */}
                        <div className="border-b border-gray-200 pb-4 mb-4">
                          <h3 className="font-semibold text-gray-900">{selectedTicket.subject}</h3>
                          <p className="text-sm text-gray-600">Ticket #{selectedTicket.ticketNumber}</p>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                          {selectedTicket.messages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                              <div className={`max-w-[70%] ${
                                msg.sender === "user"
                                  ? "bg-[#4A66FF] text-white rounded-l-lg rounded-br-lg"
                                  : "bg-gray-100 text-gray-900 rounded-r-lg rounded-bl-lg"
                              } p-3`}>
                                {msg.sender !== "user" && (
                                  <p className="text-xs font-medium mb-1 opacity-75">
                                    {msg.senderName || "Support Agent"}
                                  </p>
                                )}
                                <p className="text-sm">{msg.message}</p>
                                <p className={`text-xs mt-1 ${
                                  msg.sender === "user" ? "text-white/70" : "text-gray-500"
                                }`}>
                                  {new Date(msg.timestamp).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-500 hover:text-gray-700">
                              <Paperclip className="w-5 h-5" />
                            </button>
                            <input
                              type="text"
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                              placeholder="Type your message..."
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A66FF] focus:border-[#4A66FF]"
                            />
                            <button
                              onClick={handleSendMessage}
                              disabled={!message.trim() || isSending}
                              className="p-2 bg-[#4A66FF] text-white rounded-lg hover:bg-[#4A66FF]/90 disabled:opacity-50"
                            >
                              {isSending ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                <Send className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-[600px] text-center">
                        <div>
                          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Select a ticket to view conversation
                          </h3>
                          <p className="text-gray-600">
                            Choose a ticket from the list or create a new one
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* FAQ Tab */}
              {activeTab === "faq" && (
                <div>
                  {/* Search */}
                  <div className="mb-6">
                    <div className="relative max-w-xl mx-auto">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search FAQs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A66FF] focus:border-[#4A66FF]"
                      />
                    </div>
                  </div>

                  {/* FAQ Items */}
                  <div className="space-y-4">
                    {faqs
                      .filter(faq =>
                        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((faq) => (
                        <motion.div
                          key={faq.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white border border-gray-200 rounded-lg p-6"
                        >
                          <div className="flex items-start space-x-3">
                            <HelpCircle className="w-6 h-6 text-[#4A66FF] flex-shrink-0 mt-1" />
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                              <p className="text-gray-600 mb-4">{faq.answer}</p>
                              <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-500">Was this helpful?</span>
                                <button
                                  onClick={() => handleFAQRating(faq.id, true)}
                                  className={`p-1 rounded ${
                                    faq.helpful ? "text-[#25B181]" : "text-gray-400 hover:text-[#25B181]"
                                  }`}
                                >
                                  <CheckCircle className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleFAQRating(faq.id, false)}
                                  className="p-1 text-gray-400 hover:text-red-600 rounded"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              )}

              {/* Live Chat Tab */}
              {activeTab === "live-chat" && (
                <div>
                  {!aiChatStarted ? (
                    // Start Chat Screen
                    <div className="text-center py-12">
                      <div className="relative inline-block mb-6">
                        <Bot className="w-20 h-20 text-[#4A66FF]" />
                        <span className="absolute bottom-0 right-0 w-6 h-6 bg-[#25B181] rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Quikkred AI Assistant</h2>
                      <p className="text-gray-600 mb-2">Get instant help 24/7 in Hindi, English & more</p>
                      <p className="text-sm text-gray-500 mb-6">हिंदी • English • मराठी • తెలుగు • தமிழ்</p>

                      <button
                        onClick={startAIChat}
                        className="px-8 py-4 bg-gradient-to-r from-[#4A66FF] to-[#6B7FFF] text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold text-lg"
                      >
                        <span className="flex items-center gap-2">
                          <MessageSquare className="w-5 h-5" />
                          Start AI Chat
                        </span>
                      </button>

                      <div className="mt-8 grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                        <div className="bg-gray-50 rounded-lg p-4 text-left">
                          <Clock className="w-6 h-6 text-[#4A66FF] mb-2" />
                          <h4 className="font-semibold text-gray-900">Instant Response</h4>
                          <p className="text-sm text-gray-600">Get answers in seconds</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-left">
                          <HelpCircle className="w-6 h-6 text-[#25B181] mb-2" />
                          <h4 className="font-semibold text-gray-900">Knows Everything</h4>
                          <p className="text-sm text-gray-600">Loans, EMI, policies & more</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-left">
                          <FileText className="w-6 h-6 text-[#FF9C70] mb-2" />
                          <h4 className="font-semibold text-gray-900">Create Tickets</h4>
                          <p className="text-sm text-gray-600">Escalate to human agents</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Active Chat Screen
                    <div className="flex flex-col h-[600px]">
                      {/* Chat Header */}
                      <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-r from-[#4A66FF] to-[#6B7FFF] rounded-full flex items-center justify-center">
                              <Bot className="w-6 h-6 text-white" />
                            </div>
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#25B181] rounded-full border-2 border-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Quikkred AI Assistant</h3>
                            <p className="text-xs text-[#25B181]">● Online - Powered by AI</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setAIChatStarted(false);
                            setAIChatMessages([]);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Messages Area */}
                      <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-2">
                        {aiChatMessages.map((msg) => (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div className={`flex items-start gap-2 max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                              {msg.sender !== "user" && (
                                <div className="w-8 h-8 bg-gradient-to-r from-[#4A66FF] to-[#6B7FFF] rounded-full flex items-center justify-center flex-shrink-0">
                                  <Bot className="w-5 h-5 text-white" />
                                </div>
                              )}
                              <div className={`${
                                msg.sender === "user"
                                  ? "bg-[#4A66FF] text-white rounded-l-xl rounded-br-xl"
                                  : "bg-gray-100 text-gray-900 rounded-r-xl rounded-bl-xl"
                              } p-3 shadow-sm`}>
                                {msg.sender !== "user" && msg.senderName && (
                                  <p className="text-xs font-medium mb-1 opacity-75">{msg.senderName}</p>
                                )}
                                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                <p className={`text-xs mt-1 ${msg.sender === "user" ? "text-white/70" : "text-gray-500"}`}>
                                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                              {msg.sender === "user" && (
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                  <User className="w-5 h-5 text-gray-600" />
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}

                        {/* Typing Indicator */}
                        {isAITyping && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-start gap-2"
                          >
                            <div className="w-8 h-8 bg-gradient-to-r from-[#4A66FF] to-[#6B7FFF] rounded-full flex items-center justify-center">
                              <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="bg-gray-100 rounded-xl p-3">
                              <div className="flex gap-1">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                              </div>
                            </div>
                          </motion.div>
                        )}
                        <div ref={aiChatEndRef} />
                      </div>

                      {/* Quick Questions */}
                      {aiChatMessages.length <= 1 && (
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
                          <div className="flex flex-wrap gap-2">
                            {quickQuestions.map((q, i) => (
                              <button
                                key={i}
                                onClick={() => {
                                  setAIMessage(q);
                                  setTimeout(() => handleAIChatSend(), 100);
                                }}
                                className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Message Input */}
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={aiMessage}
                            onChange={(e) => setAIMessage(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && !isAITyping && handleAIChatSend()}
                            placeholder="Type your message... (Hindi/English)"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4A66FF] focus:border-[#4A66FF] transition-all"
                            disabled={isAITyping}
                          />
                          <button
                            onClick={handleAIChatSend}
                            disabled={!aiMessage.trim() || isAITyping}
                            className="p-3 bg-[#4A66FF] text-white rounded-xl hover:bg-[#4A66FF]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            {isAITyping ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Send className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 text-center">
                          Powered by Quikkred AI • Available 24/7
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Create Ticket Modal */}
        <AnimatePresence>
          {isCreatingTicket && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setIsCreatingTicket(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold mb-4">Create Support Ticket</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Brief description of your issue"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={newTicket.category}
                        onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A66FF]"
                      >
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newTicket.description}
                      onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      placeholder="Describe your issue in detail..."
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setIsCreatingTicket(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateTicket}
                    disabled={!newTicket.subject || !newTicket.description || isSending}
                    className="px-4 py-2 bg-[#4A66FF] text-white rounded-lg hover:bg-[#4A66FF]/90 disabled:opacity-50"
                  >
                    {isSending ? "Creating..." : "Create Ticket"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}