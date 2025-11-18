export default function Story() {
  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
          Our Story
        </h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-gray-600 text-lg mb-6">
              Founded in 2020, QuickKred emerged from a vision to revolutionize
              the financial services industry. Our team of industry experts and
              tech pioneers came together to create a platform that combines
              innovation with trust.
            </p>
            <p className="text-gray-600 text-lg">
              Through dedication and continuous improvement, we have served
              thousands of clients, helping them navigate their financial
              journey with confidence and clarity.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden">
            <img
              src="/diverse-team-collaboration.png"
              alt="Our Story"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
