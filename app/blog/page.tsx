"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  BookOpen,
  Calendar,
  Clock,
  User,
  Tag,
  TrendingUp,
  Heart,
  Share2,
  Search,
  Filter,
  Home,
  ArrowRight,
  ChevronRight,
  MessageCircle,
  Eye,
  Sparkles,
  Users
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import Image from "next/image";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  views: number;
  likes: number;
  image: string;
  tags: string[];
  featured: boolean;
}

interface Category {
  id: string;
  name: string;
  count: number;
}

export default function BlogPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories: Category[] = [
    { id: "all", name: "All Posts", count: 12 },
    { id: "financial-tips", name: "Financial Tips", count: 4 },
    { id: "loan-guides", name: "Loan Guides", count: 3 },
    { id: "company-news", name: "Company News", count: 2 },
    { id: "success-stories", name: "Success Stories", count: 3 }
  ];

  const blogPosts: BlogPost[] = [
    {
      id: "1",
      title: "10 Smart Ways to Improve Your Credit Score in 2025",
      excerpt: "Discover proven strategies to boost your credit score and unlock better loan opportunities with our comprehensive guide.",
      content: "Full blog content here...",
      category: "financial-tips",
      author: "Priya Sharma",
      date: "2025-09-28",
      readTime: "5 min",
      views: 1250,
      likes: 89,
      image: "/blog/credit-score.jpg",
      tags: ["credit score", "financial tips", "personal finance"],
      featured: true
    },
    {
      id: "2",
      title: "Understanding Personal Loans: A Complete Guide for First-Time Borrowers",
      excerpt: "Everything you need to know about personal loans, from application to repayment, explained in simple terms.",
      content: "Full blog content here...",
      category: "loan-guides",
      author: "Rajesh Kumar",
      date: "2025-09-25",
      readTime: "8 min",
      views: 2100,
      likes: 156,
      image: "/blog/personal-loan-guide.jpg",
      tags: ["personal loans", "borrowing", "financial planning"],
      featured: true
    },
    {
      id: "3",
      title: "How AI is Revolutionizing the Lending Industry",
      excerpt: "Explore how artificial intelligence is making loan approvals faster, fairer, and more accessible to everyone.",
      content: "Full blog content here...",
      category: "company-news",
      author: "Dr. Anita Desai",
      date: "2025-09-22",
      readTime: "6 min",
      views: 980,
      likes: 72,
      image: "/blog/ai-lending.jpg",
      tags: ["AI", "technology", "innovation"],
      featured: false
    },
    {
      id: "4",
      title: "From Debt to Freedom: Ramesh's Journey to Financial Independence",
      excerpt: "Read how Ramesh used smart loan management and budgeting to transform his financial situation.",
      content: "Full blog content here...",
      category: "success-stories",
      author: "Team Quikkred",
      date: "2025-09-20",
      readTime: "4 min",
      views: 1560,
      likes: 203,
      image: "/blog/success-story.jpg",
      tags: ["success story", "debt management", "inspiration"],
      featured: false
    },
    {
      id: "5",
      title: "Emergency Loans: When and How to Use Them Wisely",
      excerpt: "Learn the do's and don'ts of emergency loans and how to manage unexpected financial situations.",
      content: "Full blog content here...",
      category: "loan-guides",
      author: "Sneha Patel",
      date: "2025-09-18",
      readTime: "5 min",
      views: 1890,
      likes: 134,
      image: "/blog/emergency-loans.jpg",
      tags: ["emergency loans", "financial planning", "crisis management"],
      featured: false
    },
    {
      id: "6",
      title: "5 Common Loan Mistakes to Avoid in 2025",
      excerpt: "Protect yourself from costly errors with our expert advice on what NOT to do when taking out a loan.",
      content: "Full blog content here...",
      category: "financial-tips",
      author: "Vikram Singh",
      date: "2025-09-15",
      readTime: "7 min",
      views: 2340,
      likes: 187,
      image: "/blog/loan-mistakes.jpg",
      tags: ["mistakes", "financial advice", "loan tips"],
      featured: true
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white py-12 sm:py-16 lg:py-20">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-white/90 mb-4 sm:mb-6 text-xs sm:text-sm">
              <Link href="/" className="hover:text-white transition-colors flex items-center gap-2">
                <Home className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <ArrowRight className="w-3 h-3" />
              <Link href="/resources" className="hover:text-white transition-colors">
                Resources
              </Link>
              <ArrowRight className="w-3 h-3" />
              <span>Blog</span>
            </div>

            {/* Heading with Icon */}
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-sora">
                Financial Insights & Stories
              </h1>
            </div>

            <p className="text-sm sm:text-base lg:text-xl mb-6 sm:mb-8 opacity-90 max-w-3xl">
              Expert advice, success stories, and the latest news from the world of lending
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-4 sm:gap-6 text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>Expert Tips</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>Success Stories</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>Latest Updates</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 -mt-8">

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lucky">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                placeholder="Search articles by title, topic, or keyword..."
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-[#4A66FF] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200:bg-gray-600'
                  }`}
                >
                  {category.name}
                  <span className={`ml-2 ${selectedCategory === category.id ? 'text-white/70' : 'text-gray-400'}`}>
                    ({category.count})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Featured Posts */}
        {!searchTerm && selectedCategory === "all" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-[#4A66FF]" />
              Featured Articles
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-2xl shadow-lucky overflow-hidden hover:shadow-2xl transition-all group"
                >
                  <div className="relative h-48 bg-gradient-to-br from-[#25B181] to-[#51C9AF] overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      <BookOpen className="w-16 h-16 opacity-20" />
                    </div>
                    <div className="absolute top-4 right-4 bg-[#FF9C70]  px-3 py-1 rounded-full text-xs font-semibold">
                      Featured
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span className="mx-2">•</span>
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-[#4A66FF] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center text-sm text-gray-500">
                        <Eye className="w-4 h-4 mr-1" />
                        <span>{post.views}</span>
                        <Heart className="w-4 h-4 ml-3 mr-1" />
                        <span>{post.likes}</span>
                      </div>
                      <Link href={`/resources/blog/${post.id}`}>
                        <button className="text-[#4A66FF] font-semibold hover:underline flex items-center">
                          Read More
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-6">
            {searchTerm || selectedCategory !== "all" ? "Search Results" : "Latest Articles"}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden group"
                >
                  <div className="flex flex-col h-full">
                    <div className="relative h-40 bg-gradient-to-br from-gray-200 to-gray-300">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-gray-400 opacity-50" />
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center text-xs text-gray-500 mb-3">
                        <User className="w-3 h-3 mr-1" />
                        <span>{post.author}</span>
                        <span className="mx-2">•</span>
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                      </div>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-[#4A66FF] transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>{post.readTime} read</span>
                          <MessageCircle className="w-3 h-3 ml-3 mr-1" />
                          <span>{Math.floor(post.likes / 10)} comments</span>
                        </div>
                        <Link href={`/resources/blog/${post.id}`}>
                          <button className="text-[#4A66FF] font-semibold text-sm hover:underline flex items-center">
                            Read
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Articles Found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms or filters
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                  className="text-[#4A66FF] hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 bg-gradient-to-br from-[#25B181] to-[#1F8F68] rounded-2xl p-8  text-center relative overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>

          <MessageCircle className="w-12 h-12 mx-auto mb-4 text-white relative z-10" />
          <h2 className="text-2xl font-bold mb-4 text-white relative z-10">Stay Updated with Financial Insights</h2>
          <p className="text-xl mb-6 text-white/80 relative z-10">
            Subscribe to our newsletter for expert tips, guides, and exclusive offers
          </p>
          <div className="max-w-md mx-auto flex gap-2 relative z-10">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
            />
            <button className="px-8 py-3 bg-[#4A66FF] text-white rounded-full font-semibold hover:bg-[#3B52CC] transition-all shadow-lg hover:shadow-xl">
              Subscribe
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
