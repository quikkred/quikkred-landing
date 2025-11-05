"use client"

import type React from "react"

import { useState } from "react"

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => (
  <button
    {...props}
    className={[
      "inline-flex items-center justify-center",
      className ?? "",
    ].filter(Boolean).join(" ")}
  >
    {children}
  </button>
)

export default function Hero() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    loanAmount: "",
    email: "",
  })
  const [currentStep, setCurrentStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNext = () => {
    const currentField = Object.keys(formData)[currentStep - 1]
    if (formData[currentField as keyof typeof formData]) {
      if (currentStep === 4) {
        // Submit on last step
        handleSubmit()
      } else {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handleSubmit = () => {
    console.log("Form submitted:", formData)
    setSubmitted(true)
    // Here you can send the data to your backend
  }

  const steps = [
    { question: "What's your name?", placeholder: "Enter your name", field: "name" },
    { question: "Enter your Mobile number?", placeholder: "Enter your mobile number", field: "mobile" },
    { question: "How much do you need?", placeholder: "Enter Amount in ₹", field: "loanAmount" },
    { question: "Enter email address?", placeholder: "Enter your email", field: "email" },
  ]

  const currentStepData = steps[currentStep - 1]

  if (submitted) {
    return (
      <section className="bg-white py-16 md:py-32 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
              Get <span className="text-teal-500">Instant</span>
              <br />
              Personal Loans
            </h1>
            <p className="text-base text-slate-700 leading-relaxed max-w-md">
              Quick approval, minimal documentation, transparent process. Your trusted partner for all financial needs
            </p>
            <Button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 text-base font-semibold rounded">
              Get Started
            </Button>
          </div>

          <div className="relative flex justify-center items-start pt-8">
            <div className="absolute -top-8 -right-12 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              $
            </div>

            <div className="w-full max-w-sm bg-white rounded-lg shadow-xl border border-slate-100 p-8">
              <div className="text-center space-y-4">
                <div className="text-5xl">✓</div>
                <h2 className="text-2xl font-bold text-slate-900">Thank You!</h2>
                <p className="text-slate-600">
                  Your application has been submitted successfully. We'll contact you soon.
                </p>
                <Button
                  onClick={() => {
                    setCurrentStep(1)
                    setSubmitted(false)
                    setFormData({ name: "", mobile: "", loanAmount: "", email: "" })
                  }}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 font-semibold rounded-lg"
                >
                  Submit Another
                </Button>
              </div>
            </div>

            <div className="absolute bottom-32 -left-8 w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white text-xl">
              ⏱
            </div>

            <div className="absolute bottom-12 -right-8 w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              $
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white py-16 md:py-32 px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
            Get <span className="text-teal-500">Instant</span>
            <br />
            Personal Loans
          </h1>
          <p className="text-base text-slate-700 leading-relaxed max-w-md">
            Quick approval, minimal documentation, transparent process. Your trusted partner for all financial needs
          </p>
          <Button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 text-base font-semibold rounded">
            Get Started
          </Button>
        </div>

        {/* Right - Form Card with Decorative Elements */}
        <div className="relative flex justify-center items-start pt-8">
          <div className="absolute -top-8 -right-12 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            $
          </div>

          <div className="w-full max-w-sm bg-white rounded-lg shadow-xl border border-slate-100 p-8">
            {/* Progress Indicators */}
            <div className="flex gap-2 mb-8">
              <div className={`h-1 flex-1 rounded ${currentStep >= 1 ? "bg-teal-500" : "bg-slate-300"}`}></div>
              <div className={`h-1 flex-1 rounded ${currentStep >= 2 ? "bg-teal-500" : "bg-slate-300"}`}></div>
              <div className={`h-1 flex-1 rounded ${currentStep >= 3 ? "bg-teal-500" : "bg-slate-300"}`}></div>
              <div className={`h-1 flex-1 rounded ${currentStep >= 4 ? "bg-teal-500" : "bg-slate-300"}`}></div>
            </div>

            {/* Form Content */}
            <label className="block text-slate-900 font-semibold mb-4">{currentStepData.question}</label>
            <input
              type={currentStepData.field === "email" ? "email" : "text"}
              name={currentStepData.field}
              placeholder={currentStepData.placeholder}
              value={formData[currentStepData.field as keyof typeof formData]}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
            />
            <Button
              onClick={handleNext}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 font-semibold rounded-lg"
            >
              {currentStep === 4 ? "Submit" : "Next"}
            </Button>
          </div>

          <div className="absolute bottom-32 -left-8 w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white text-xl">
            ⏱
          </div>

          <div className="absolute bottom-12 -right-8 w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            $
          </div>
        </div>
      </div>
    </section>
  )
}
