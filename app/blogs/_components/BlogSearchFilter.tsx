"use client"

import { Search } from "lucide-react"

const BlogSearchFilter = () => {
    const Button = ({
        text = "",
        number = 0,
        isActive = false,
    }: {
        text?: string;
        number?: number;
        isActive?: boolean;
    }) => {
        return <>
            <button
                title={text}
                aria-label={text}
                className={`border border-solid ${isActive ? "text-white bg-[var(--brand-green-light)] border-[var(--brand-green-light)]":"text-black bg-white border-gray-400"} px-4 py-2 rounded-md text-sm font-semibold`}
            >
                {text} ({number})
            </button>
        </>
    }

    const buttons = [
        {
            text: "All Posts",
            number: 12,
            isActive: true,
        },
        {
            text: "Financial Tips",
            number: 14
        },
        {
            text: "Loan Guides",
            number: 3
        },
        {
            text: "Company News",
            number: 2
        },
        {
            text: "Success Stories",
            number: 3
        },
    ]

    return (
        <div className="container mx-auto flex flex-col gap-4 justify-center items-center px-4 max-w-6xl">
            {/* search bar */}
            <div className="w-full border px-4 flex justify-center focus-within:border-[var(--brand-green-light)] focus-within:ring-2 focus-within:ring-[var(--brand-green-light)] transition-all duration-300 items-center gap-3 rounded-md border-solid py-3 border-gray-400">
                <div className="w-auto">
                    <Search className="w-4 h-4 text-gray-600" />
                </div>
                <input type="text" placeholder="Search" className="outline-none placeholder:text-gray-500 border-none w-full" />
            </div>
            {/* filters */}
            <div className="flex gap-4 justify-center items-center">
                {
                    buttons.map((item, index) => (
                        <Button key={index} {...item} />
                    ))
                }
            </div>
        </div>
    )
}

export default BlogSearchFilter