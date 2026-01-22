"use client"

import Image from "next/image"

const KeepReadingSection = () => {
    const Card = () => {
        return <div className="w-full flex justify-start items-center gap-x-8 gap-y-4">
            <div className="relative w-1/2 h-48 rounded-lg overflow-hidden">
                <Image
                    src="/blog-image.jpg"
                    alt="blog-image"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                />
            </div>
            <div className="flex justify-center items-start gap-4 flex-col">
                <h3 className="font-semibold text-2xl">Smart Use of Emergency Loans</h3>
                <p className="text-neutral-900">Learn the do's and don'ts of emergency loans and how to manage unexpected financial situations.</p>
            </div>
        </div>
    }

    return (
        <section className="container mx-auto max-w-6xl flex flex-col gap-6 justify-center items-center">
            <div className="flex justify-start w-full">
                <h2 className="text-2xl md:text-3xl font-semibold">Keep reading</h2>
            </div>

            {
                Array(2).fill(0).map((_, index) => (
                    <Card key={index} />
                ))
            }
        </section>
    )
}

export default KeepReadingSection