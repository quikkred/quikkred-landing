"use client"

import { motion } from "framer-motion"
import { BookOpen } from "lucide-react"

const BlogHeroSection = () => {
    return (
        <section className="relative py-16 bg-gradient-to-br from-[#25B181] via-[#51C9AF] to-[#1F8F68]">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-white"
                >
                    <BookOpen className="w-16 h-16 mx-auto mb-4" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-sora">
                        {"Financial Insights & Stories"}
                    </h1>
                    {/* <p className="text-xl">{p?.subtitle || "Your privacy is our priority"}</p>
                    <p className="text-sm mt-2 opacity-90">{t?.policies?.common?.effectiveDate || "Effective Date"}: {p?.effectiveDate || "18-02-2025"}</p> */}
                </motion.div>
            </div>
        </section>
    )
}

export default BlogHeroSection