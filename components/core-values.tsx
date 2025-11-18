// core-values.tsx

const values = [
  {
    icon: '💡',
    title: 'Innovation',
    description: 'We constantly push boundaries to deliver cutting-edge financial solutions.',
  },
  {
    icon: '🤝',
    title: 'Transparency',
    description: 'We believe in open communication and honest dealings with all stakeholders.',
  },
  {
    icon: '🎯',
    title: 'Excellence',
    description: 'We are committed to delivering the highest standards in all our services.',
  },
  {
    icon: '🛡️',
    title: 'Security',
    description: 'Your trust and data security are our top priorities.',
  },
  {
    icon: '🌱',
    title: 'Growth',
    description: 'We invest in our people and partners to achieve collective success.',
  },
  {
    icon: '💚',
    title: 'Responsibility',
    description: 'We are committed to ethical practices and social impact.',
  },
]

export default function CoreValues() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
        Our Core Values
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {values.map((value, index) => (
          <div
            key={index}
            className="p-8 bg-gray-50 rounded-lg hover:shadow-lg transition"
          >
            <div className="text-4xl mb-4">{value.icon}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {value.title}
            </h3>
            <p className="text-gray-600">{value.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
