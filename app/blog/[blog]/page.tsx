import Image from "next/image"
import KeepReadingSection from "../_components/KeepReadingSection"

const BlogDetails = () => {
    return (
        <div className="w-full flex py-16 gap-8 flex-col items-center">
            <section className="container mx-auto max-w-6xl flex flex-col gap-3 justify-start items-start">
                <p className="bg-[var(--brand-green)] text-white rounded-lg px-4 py-1 text-sm">Credit Score</p>
                <h1 className="text-5xl font-semibold">10 Smart Ways to Improve Your Credit Score in 2025</h1>
                <p className="text-sm text-neutral-900">28 Sept 2025</p>

                <div className="relative w-full h-96 rounded-lg overflow-hidden">
                    <Image
                        src="/blog-image.jpg"
                        alt="blog-image"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                    />
                </div>

                <div className="flex justify-start items-center gap-3">
                    <Image
                        src="/Aboutus_hero_image.png"
                        alt="blog-image-profile"
                        width={38}
                        height={38}
                        className="rounded-full"
                    />
                    <div className="flex flex-col text-sm justify-center items-start">
                        <p className="font-semibold">Rajesh Kumar</p>
                        <p>28 Sept 2025</p>
                    </div>
                </div>
            </section>
            
            <section className="container mx-auto max-w-6xl">
                <p>Amet aliquet at a aliquam ac suspendisse euismod. Lectus sit in ut erat in. Et nulla a magna amet, amet. Sodales malesuada laoreet bibendum neque amet turpis non. Ac arcu lacus turpis elementum imperdiet. Euismod purus, libero scelerisque vitae, libero fermentum urna, nunc.</p>
            </section>

            <KeepReadingSection />
        </div>
    )
}

export default BlogDetails