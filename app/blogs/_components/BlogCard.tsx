"use client"

import BlogInterface from "@/interfaces/blogInterface";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image"
import Link from "next/link";

const BlogCard = ({
    title,
    slug,
    image,
    content,
    author,
    created_at,
    tags,
}: BlogInterface) => {
    // const tags: string[] = ["personal loans", "financial tips"];

    return (
        <Link href={`/blog/${slug}`} aria-label={title}>
            <div className="p-4 rounded-lg shadow-md cursor-pointer gap-4 flex flex-col justify-start border border-solid border-white transition-all duration-300 hover:border-[var(--brand-green-light)] hover:-translate-y-2 items-start bg-white w-full">
                <div className="relative w-full h-48 overflow-hidden rounded-md">
                    <Image
                        src={image}
                        alt="blog-image"
                        fill
                        className="object-cover"
                        sizes="100vw"
                        priority={false}
                    />
                    <div className="absolute top-2 right-2 text-xs font-semibold text-[var(--brand-green)] bg-white px-2.5 py-1.5 rounded-xl shadow-md">Featured</div>
                </div>

                <div className="flex justify-start items-center gap-4">
                    {tags.map((item, index) => (
                        <p key={index} className="text-[var(--brand-green)] text-sm font-medium">#{item}</p>
                    ))}
                </div>

                <div className="flex flex-col items-start gap-2 justify-center">
                    <div className="flex justify-center items-center gap-2 w-full">
                        <h2 className="font-medium text-lg leading-6">{title}</h2>
                        <div className="h-full w-auto flex justify-center items-start">
                            <ArrowUpRight className="w-6 h-6" />
                        </div>
                    </div>

                    <p className="text-start text-sm text-neutral-900">{content}</p>
                </div>

                <div className="flex justify-start items-center gap-3">
                    <Image
                        src={author.image}
                        alt="blog-image-profile"
                        width={38}
                        height={38}
                        className="rounded-full"
                    />
                    <div className="flex flex-col text-sm justify-center items-start">
                        <p className="font-semibold">{author.name}</p>
                        <p>{created_at}</p>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default BlogCard