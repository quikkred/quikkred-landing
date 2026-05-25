'use client';

/**
 * Live Support Chat Widget
 * Appears as human support agent - AI powers responses seamlessly
 * Agent assigned from backend API
 *
 * MOBILE OPTIMIZED:
 * - Full screen on mobile devices
 * - Safe area support for notched phones
 * - Touch-friendly buttons
 * - Keyboard-aware input
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, X, Send, Minimize2,
  User, Loader2, ChevronDown
} from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';
import getToken from '@/lib/getToken';
import ChatPortal from './ChatPortal';

interface SupportAgent {
  id: string;
  name: string;
  greeting: string;
  avatar: string | null;
  status: string;
}

// Fetch agent from backend (cached in session)
const fetchSupportAgent = async (): Promise<SupportAgent | null> => {
  if (typeof window !== 'undefined') {
    // Check session cache first
    const stored = sessionStorage.getItem('supportAgent');
    if (stored) {
      return JSON.parse(stored);
    }

    // Fetch from backend. Endpoint may be 404 on environments where the
    // AI service isn't deployed (Best Practices audit flagged a console
    // error here). Treat any non-2xx as "use fallback" without logging.
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/support-agent`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.agent) {
          sessionStorage.setItem('supportAgent', JSON.stringify(result.agent));
          return result.agent;
        }
      }
    } catch {
      // Network failure — fall through to the static fallback agent.
    }

    // Fallback if API fails
    return {
      id: 'fallback',
      name: 'Support',
      greeting: "Hi! How can I help you today?",
      avatar: null,
      status: 'online'
    };
  }
  return null;
};

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  agentName?: string;
  isTyping?: boolean;
}

interface LiveSupportChatProps {
  autoResponseDelay?: number;
}

export default function LiveSupportChat({
  autoResponseDelay = 60000
}: LiveSupportChatProps) {
  const [agent, setAgent] = useState<SupportAgent | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<{ role: string, content: string }[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autoResponseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle keyboard visibility on mobile
  useEffect(() => {
    if (typeof window !== 'undefined' && 'visualViewport' in window) {
      const viewport = window.visualViewport;

      const handleResize = () => {
        if (viewport) {
          const keyboardHeight = window.innerHeight - viewport.height;
          setKeyboardVisible(keyboardHeight > 150);
        }
      };

      viewport?.addEventListener('resize', handleResize);
      return () => viewport?.removeEventListener('resize', handleResize);
    }
  }, []);

  // Prevent body scroll when chat is open on mobile
  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isOpen, isMobile]);

  // Initialize agent on mount (fetch from backend)
  useEffect(() => {
    const initAgent = async () => {
      const agentData = await fetchSupportAgent();
      if (agentData) {
        setAgent(agentData);
      }
    };
    initAgent();
  }, []);

  // Scroll to bottom when new messages arrive (use parent scrollTop to avoid page scroll)
  const scrollToBottom = useCallback(() => {
    const container = messagesEndRef.current?.parentElement;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Add welcome message when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0 && agent) {
      setTimeout(() => {
        setMessages([{
          id: 'welcome',
          content: agent.greeting,
          sender: 'agent',
          timestamp: new Date(),
          agentName: agent.name
        }]);
      }, 500);
    }
  }, [isOpen, messages.length, agent]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 300);
    }
  }, [isOpen, isMinimized]);

  // Clear auto-response timer
  const clearAutoResponseTimer = useCallback(() => {
    if (autoResponseTimerRef.current) {
      clearTimeout(autoResponseTimerRef.current);
      autoResponseTimerRef.current = null;
    }
  }, []);

  // Get AI response (appears as human agent)
  const getAIResponse = useCallback(async (userMessage: string) => {
    try {
      const token = await getToken();
      const customerId = localStorage.getItem('userId');

      const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          message: userMessage,
          customerId,
          conversationHistory,
          agentName: agent?.name // Pass agent name so AI responds as this person
        })
      });

      const result = await response.json();

      if (result.success && result.response) {
        // Update conversation history
        setConversationHistory(prev => [
          ...prev,
          { role: 'user', content: userMessage },
          { role: 'assistant', content: result.response }
        ]);

        return result.response;
      }

      return null;
    } catch (error) {
      console.error('Support chat error:', error);
      return null;
    }
  }, [conversationHistory, agent]);

  // Simulate human typing delay
  const simulateTyping = useCallback((response: string, callback: (text: string) => void) => {
    setIsAgentTyping(true);

    // Calculate typing time based on message length (human-like)
    const baseDelay = 1000; // 1 second minimum
    const perCharDelay = 20; // 20ms per character
    const typingTime = Math.min(baseDelay + (response.length * perCharDelay), 4000); // max 4 seconds

    setTimeout(() => {
      setIsAgentTyping(false);
      callback(response);
    }, typingTime);
  }, []);

  // Handle sending message
  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    clearAutoResponseTimer();

    // Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      content: userMessage,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);

    // Scroll after adding message
    setTimeout(scrollToBottom, 100);

    // Get AI response (appears as human agent response)
    const aiResponse = await getAIResponse(userMessage);

    if (aiResponse) {
      simulateTyping(aiResponse, (text) => {
        const agentMsg: Message = {
          id: `agent-${Date.now()}`,
          content: text,
          sender: 'agent',
          timestamp: new Date(),
          agentName: agent?.name
        };
        setMessages(prev => [...prev, agentMsg]);

        if (!isOpen || isMinimized) {
          setHasUnread(true);
        }
      });
    } else {
      // Fallback response if AI fails
      simulateTyping("I'm looking into this for you. Could you please provide more details?", (text) => {
        const agentMsg: Message = {
          id: `agent-${Date.now()}`,
          content: text,
          sender: 'agent',
          timestamp: new Date(),
          agentName: agent?.name
        };
        setMessages(prev => [...prev, agentMsg]);
      });
    }
  }, [inputValue, clearAutoResponseTimer, getAIResponse, simulateTyping, agent, isOpen, isMinimized, scrollToBottom]);

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Toggle chat
  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
    setHasUnread(false);
  };

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <>
      {/* Chat Button - Responsive positioning */}
      <ChatPortal>
        <motion.button
          onClick={toggleChat}
          className={`fixed z-50 bg-gradient-to-r from-[#25B181] to-[#1F8F68] rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow
          ${isMobile
              ? 'bottom-4 right-4 w-12 h-12'
              : 'bottom-6 right-6 w-14 h-14'
            }
          ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}
        `}
          style={{
            paddingBottom: isMobile ? 'env(safe-area-inset-bottom, 0px)' : '0',
            transition: 'transform 0.2s, opacity 0.2s'
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Open support chat"
        >
          <MessageCircle className={`text-white ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
          {hasUnread && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </span>
          )}
        </motion.button>
      </ChatPortal>

      {/* Chat Window - Full screen on mobile, floating on desktop */}
      <ChatPortal>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={chatContainerRef}
              initial={{ opacity: 0, y: isMobile ? '100%' : 20, scale: isMobile ? 1 : 0.95 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                height: isMinimized ? 'auto' : (isMobile ? '100%' : '500px')
              }}
              exit={{ opacity: 0, y: isMobile ? '100%' : 20, scale: isMobile ? 1 : 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`fixed z-50 bg-white overflow-hidden flex flex-col
              ${isMobile
                  ? 'inset-0 rounded-none'
                  : 'bottom-24 right-6 w-[380px] max-w-[calc(100vw-3rem)] rounded-2xl shadow-2xl'
                }
            `}
              style={{
                paddingTop: isMobile ? 'env(safe-area-inset-top, 0px)' : '0',
                paddingBottom: isMobile ? 'env(safe-area-inset-bottom, 0px)' : '0',
              }}
            >
              {/* Header */}
              <div className={`bg-gradient-to-r from-[#25B181] to-[#1F8F68] ${isMobile ? 'p-4 pt-2' : 'p-4'}`}
                style={{ paddingTop: isMobile ? 'calc(env(safe-area-inset-top, 0px) + 8px)' : '16px' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Agent Avatar */}
                    <div className="relative">
                      <div className={`bg-white/20 rounded-full flex items-center justify-center ${isMobile ? 'w-10 h-10' : 'w-10 h-10'}`}>
                        <User className={`text-white ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
                    </div>
                    <div>
                      <h3 className={`text-white font-semibold ${isMobile ? 'text-base' : 'text-base'}`}>
                        {agent?.name || 'Support'}
                      </h3>
                      <p className="text-white/80 text-xs flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        Online • Support Agent
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {!isMobile && (
                      <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        aria-label="Minimize chat"
                      >
                        <Minimize2 className="w-5 h-5 text-white" />
                      </button>
                    )}
                    <button
                      onClick={() => setIsOpen(false)}
                      className={`hover:bg-white/20 rounded-lg transition-colors ${isMobile ? 'p-2' : 'p-2'}`}
                      aria-label="Close chat"
                    >
                      {isMobile ? (
                        <ChevronDown className="w-6 h-6 text-white" />
                      ) : (
                        <X className="w-5 h-5 text-white" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              {!isMinimized && (
                <>
                  <div
                    className={`flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 ${isMobile ? 'pb-4' : ''}`}
                    style={{
                      WebkitOverflowScrolling: 'touch',
                      minHeight: isMobile ? '0' : 'auto'
                    }}
                  >
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[85%] sm:max-w-[80%] ${message.sender === 'user' ? 'order-1' : ''}`}>
                          {message.sender === 'agent' && (
                            <p className="text-xs text-gray-500 mb-1 ml-1">{message.agentName}</p>
                          )}
                          <div
                            className={`rounded-2xl px-4 py-3 ${message.sender === 'user'
                              ? 'bg-gradient-to-r from-[#25B181] to-[#1F8F68] text-white rounded-br-md'
                              : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md'
                              }`}
                          >
                            <p className={`leading-relaxed whitespace-pre-wrap ${isMobile ? 'text-[15px]' : 'text-sm'}`}>
                              {message.content}
                            </p>
                          </div>
                          <p className={`text-[10px] text-gray-400 mt-1 ${message.sender === 'user' ? 'text-right mr-1' : 'ml-1'}`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Typing Indicator */}
                    {isAgentTyping && (
                      <div className="flex justify-start">
                        <div className="max-w-[85%] sm:max-w-[80%]">
                          <p className="text-xs text-gray-500 mb-1 ml-1">{agent?.name || 'Support'}</p>
                          <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area - Keyboard aware */}
                  <div
                    className={`bg-white border-t border-gray-100 ${isMobile ? 'p-3' : 'p-4'}`}
                    style={{
                      paddingBottom: isMobile
                        ? `calc(env(safe-area-inset-bottom, 0px) + ${keyboardVisible ? '8px' : '12px'})`
                        : '16px'
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className={`flex-1 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-[#25B181]/50 focus:bg-white transition-all
                        ${isMobile ? 'px-4 py-3 text-[16px]' : 'px-4 py-2.5 text-sm'}
                      `}
                        style={{ fontSize: isMobile ? '16px' : '14px' }} // Prevent zoom on iOS
                        autoComplete="off"
                        autoCorrect="on"
                        spellCheck="true"
                      />
                      <motion.button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isAgentTyping}
                        className={`bg-gradient-to-r from-[#25B181] to-[#1F8F68] rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed
                        ${isMobile ? 'w-12 h-12 min-w-[48px]' : 'w-10 h-10'}
                      `}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Send message"
                      >
                        {isAgentTyping ? (
                          <Loader2 className={`animate-spin ${isMobile ? 'w-5 h-5' : 'w-5 h-5'}`} />
                        ) : (
                          <Send className={`${isMobile ? 'w-5 h-5' : 'w-5 h-5'}`} />
                        )}
                      </motion.button>
                    </div>
                    {!isMobile && (
                      <p className="text-[10px] text-gray-400 text-center mt-2">
                        Typically replies within a minute
                      </p>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </ChatPortal>
    </>
  );
}