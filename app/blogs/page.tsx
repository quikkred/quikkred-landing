"use client"

// components
import BlogCard from "./_components/BlogCard"
import BlogContactSection from "./_components/BlogContactSection"
import BlogHeroSection from "./_components/BlogHeroSection"
import BlogSearchFilter from "./_components/BlogSearchFilter"

const Blogs = () => {
    return <>
        <BlogHeroSection />
        <section className="w-full flex py-16 gap-16 flex-col items-center">
            <BlogSearchFilter />
            <div className="container mx-auto flex flex-col gap-4 justify-center items-center px-4 max-w-6xl">
                <div className="flex justify-start w-full">
                    <h2 className="text-2xl md:text-3xl font-semibold">Featured Articles</h2>
                </div>

                <div className="grid grid-cols-3 gap-x-6 gap-y-8 w-full">
                    {
                        Array(3).fill(0).map((_, i) => ((
                            <BlogCard
                                key={i}
                                title="10 Smart Ways to Improve Your Credit Score in 2025"
                                slug="10-smart-ways-to-imporve-your-credit-score-in-2025"
                                image="/Aboutus_hero_image.png"
                                author={{
                                    name: "Rajesh Kumar",
                                    image: "/Aboutus_hero_image.png"
                                }}
                                created_at="28 Sept 2025"
                                updated_at="28 Sept 2025"
                                content="Discover proven strategies to boost your credit score and unlock better loan opportunities with our comprehensive guide."
                                tags={["personal loans", "financial tips"]}
                                id={1}
                            />
                        )))
                    }
                </div>
            </div>
            <div className="container mx-auto flex flex-col gap-4 justify-center items-center px-4 max-w-6xl">
                <div className="flex justify-start w-full">
                    <h2 className="text-2xl md:text-3xl font-semibold">Latest Articles</h2>
                </div>

                <div className="grid grid-cols-3 gap-x-6 gap-y-8 w-full">
                    {
                        Array(6).fill(0).map((_, i) => ((
                            <BlogCard
                                key={i}
                                title="10 Smart Ways to Improve Your Credit Score in 2025"
                                slug="10-smart-ways-to-imporve-your-credit-score-in-2025"
                                image="/Aboutus_hero_image.png"
                                author={{
                                    name: "Rajesh Kumar",
                                    image: "/Aboutus_hero_image.png"
                                }}
                                created_at="28 Sept 2025"
                                updated_at="28 Sept 2025"
                                content="Discover proven strategies to boost your credit score and unlock better loan opportunities with our comprehensive guide."
                                tags={["personal loans", "financial tips"]}
                                id={1}
                            />
                        )))
                    }
                </div>
            </div>
            <BlogContactSection />
        </section>
    </>
}

export default Blogs