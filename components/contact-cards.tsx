import { Phone, MapPin, Mail } from "lucide-react"
import { COMPANY_EMAIL_SUPPORT, COMPANY_EMAIL_LOANS } from "@/lib/constants/companyInfo"

const contactCards = [
  {
    icon: Mail,
    title: "Email Us",
    description: COMPANY_EMAIL_SUPPORT,
    subtext: COMPANY_EMAIL_LOANS,
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: "Peninsula Office",
    subtext: "Bangkok, Thailand",
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "Coming Soon",
    subtext: "Phone support launching soon",
  },
]

export default function ContactCards() {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {contactCards.map((card, index) => {
        const Icon = card.icon
        return (
          <div
            key={index}
            className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <Icon className="w-6 h-6 text-teal-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
            <p className="text-gray-600 text-sm text-center mb-1">{card.description}</p>
            {card.subtext && <p className="text-gray-600 text-sm text-center">{card.subtext}</p>}
          </div>
        )
      })}
    </div>
  )
}
