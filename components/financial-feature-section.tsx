import type { ReactNode } from "react"

interface FeatureItem {
  icon: ReactNode
  title: string
  description: string
}

interface FinancialFeatureSectionProps {
  image: string
  imageAlt: string
  badge?: {
    percentage: string
    label: string
  }
  heading: string
  description: string
  features: FeatureItem[]
}

export function FinancialFeatureSection({
  image,
  imageAlt,
  badge,
  heading,
  description,
  features,
}: FinancialFeatureSectionProps) {
  return (
    <section className="bg-[#F6F6F6] py-8 sm:py-10 lg:py-12">
      <div className="container mx-auto sm:px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 items-center md:grid-cols-2 md:gap-12 lg:gap-16">
          {/* Left side - Image with badge */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-sm">
              <img
                src={image || "/placeholder.svg"}
                alt={imageAlt}
                className="w-full h-auto rounded-2xl object-cover"
              />

              {badge && (
                <div className="absolute bottom-4 right-4 bg-teal-500 text-white rounded-xl px-4 py-3 flex flex-col items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold">{badge.percentage}</span>
                  <span className="text-xs font-medium">{badge.label}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Content */}
          <div className="flex flex-col gap-4">
            {/* Heading and description */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-balance">{heading}</h1>
              <p className="text-gray-600 leading-relaxed max-w-md text-sm sm:text-base">{description}</p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-shrink-0 flex items-start pt-1">
                    <div className="flex items-center justify-center w-4 h-4 text-teal-500">{feature.icon}</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
