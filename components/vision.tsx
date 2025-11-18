export default function Vision() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="rounded-lg overflow-hidden order-2 md:order-1">
          <img
            src="/people-brainstorming-ideas.jpg"
            alt="Our Vision"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="order-1 md:order-2">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Our Vision
          </h2>
          <p className="text-gray-600 text-lg">
            We envision a future where financial services are accessible,
            transparent, and empowering for everyone. Our goal is to create an
            ecosystem where businesses and individuals can thrive without
            financial constraints, supported by technology that adapts to their
            needs and aspirations.
          </p>
        </div>
      </div>
    </section>
  )
}
