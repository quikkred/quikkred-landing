"use client";

import Image from "next/image";

const BlogContactSection = () => {
    return (
        <div className="container mx-auto flex flex-col gap-4 justify-center items-center px-4 max-w-6xl">
            <div className="w-full rounded-xl flex flex-col md:flex-row justify-between items-center bg-gradient-to-b from-[#6D9DFF] to-[#415E99] p-8 md:p-16 gap-8 md:gap-24">

                <div className="flex flex-col text-white justify-center gap-4 items-start md:w-1/2">
                    <h2 className="font-semibold text-3xl md:text-4xl">Stay Updated with Financial Insights</h2>
                    <p className="text-sm">
                        Subscribe to our newsletter for expert tips, guides, and exclusive offers
                    </p>

                    <div className="flex flex-col sm:flex-row justify-start items-center gap-3 w-full">
                        <input
                            type="text"
                            className="bg-white px-4 py-2 rounded-md w-full sm:w-[280px] text-black outline-none"
                            placeholder="Enter your email"
                        />
                        <button className="px-4 py-2 bg-black text-white rounded-md font-medium w-full sm:w-auto">
                            Subscribe
                        </button>
                    </div>
                </div>

                {/* ✅ give parent height + width */}
                <div className="relative w-full md:w-1/2 h-56 md:h-72 rounded-2xl overflow-hidden">
                    <Image
                        src="/blog-image.jpg"
                        alt="blog-image"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                    />
                </div>

            </div>
        </div>
    );
};

export default BlogContactSection;
