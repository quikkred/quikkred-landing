export default function Loading() {
    return <>
        <div className="min-h-screen bg-gradient-to-br from-white via-[#F0FDF4] to-white flex items-center justify-center">
            <div className="text-center">
                {/* Animated Logo with rotating ring */}
                <div className="relative mb-8">
                    {/* Rotating outer ring */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 border-4 border-[#25B181]/20 border-t-[#25B181] rounded-full animate-spin"></div>
                    </div>

                    {/* Logo icon with pulse animation */}
                    <div className="relative z-10 animate-pulse">
                        <img
                            src="/quikkred-logo.png"
                            alt="Quikkred Logo"
                            className="w-24 h-auto mx-auto"
                            style={{
                                filter: 'drop-shadow(0 4px 6px rgba(37, 177, 129, 0.2))',
                                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                            }}
                        />
                    </div>
                </div>

                {/* Loading dots and text */}
                <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-2.5 h-2.5 bg-[#25B181] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2.5 h-2.5 bg-[#25B181] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2.5 h-2.5 bg-[#25B181] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <p className="text-gray-700 font-semibold text-lg">Quikkred</p>
                    <p className="text-gray-500 text-sm">Loading your experience...</p>
                </div>
            </div>
        </div>
    </>
}