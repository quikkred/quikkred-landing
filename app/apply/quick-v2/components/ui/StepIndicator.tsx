// Compact Step Indicator Component
function StepIndicator({ currentStep }: { currentStep: number }) {
    const steps = [
        { id: 1, label: 'Register / Login' },
        { id: 2, label: 'Eligibility Check' },
        { id: 3, label: 'Bank Verification' },
        // { id: 3, label: 'Approval & Mandate' },
    ];

    return (
        <div className="flex items-center justify-center gap-1 sm:gap-2 mb-4 sm:mb-6 px-2">
            {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                    <div className="flex items-center gap-1.5">
                        <div className="w-auto">
                            <div
                                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${currentStep >= step.id
                                    ? 'bg-[#25B181] text-white'
                                    : 'bg-gray-200 text-gray-500'
                                    }`}
                            >
                                {currentStep > step.id ? '✓' : step.id}
                            </div>
                        </div>
                        <span
                            className={`text-xs sm:text-sm font-medium ${currentStep >= step.id ? 'text-[#25B181]' : 'text-gray-400'
                                }`}
                        >
                            {step.label}
                        </span>
                    </div>
                    {index < steps.length - 1 && (
                        <div
                            className={`w-6 sm:w-12 h-0.5 mx-1.5 sm:mx-2 rounded-full ${currentStep > step.id ? 'bg-[#25B181]' : 'bg-gray-200'
                                }`}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

export default StepIndicator;