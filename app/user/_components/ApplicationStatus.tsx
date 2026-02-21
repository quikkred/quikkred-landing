"use client"
import { motion } from "framer-motion";
import { Building, CheckCircle, ChevronRight, Clock, FileText } from "lucide-react";
import { DashboardData } from "@/interfaces/dashboardInterface";
import { useRouter } from "nextjs-toploader/app";

const ApplicationStatus = ({
    data
}: {
    data: DashboardData | null
}) => {
    const router = useRouter();
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#E5E5E5] mb-6 sm:mb-8"
        >
            <h2 className="text-lg sm:text-xl font-semibold text-[#0A0A0A] mb-4 sm:mb-6 flex items-center gap-2">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#10B4A3]" />
                Application Status
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className={`p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all ${data?.isBasicDetailsFilled
                    ? 'bg-green-50 border-green-300 shadow-sm'
                    : 'bg-gray-50 border-gray-200'
                    }`}>
                    <div className="flex items-center gap-2 sm:gap-3">
                        {data?.isBasicDetailsFilled ? (
                            <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                        ) : (
                            <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" />
                        )}
                        <div>
                            <p className="font-semibold text-gray-900 text-sm sm:text-base">Basic Details</p>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                {data?.isBasicDetailsFilled ? 'Completed ✓' : 'Pending'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className={`p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all ${data?.isKycDetailsFilled
                    ? 'bg-green-50 border-green-300 shadow-sm'
                    : 'bg-gray-50 border-gray-200'
                    }`}>
                    <div className="flex items-center gap-2 sm:gap-3">
                        {data?.isKycDetailsFilled ? (
                            <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                        ) : (
                            <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" />
                        )}
                        <div>
                            <p className="font-semibold text-gray-900 text-sm sm:text-base">KYC Details</p>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                {data?.isKycDetailsFilled ? 'Completed ✓' : 'Pending'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className={`p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all ${data?.isBankDetailsFilled
                    ? 'bg-green-50 border-green-300 shadow-sm'
                    : 'bg-gray-50 border-gray-200'
                    }`}>
                    <div className="flex items-center gap-2 sm:gap-3">
                        {data?.isBankDetailsFilled ? (
                            <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                        ) : (
                            <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" />
                        )}
                        <div>
                            <p className="font-semibold text-gray-900 text-sm sm:text-base">Bank Details</p>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                {data?.isBankDetailsFilled ? 'Completed ✓' : 'Pending'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className={`p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all ${data?.isSubmit
                    ? 'bg-green-50 border-green-300 shadow-sm'
                    : 'bg-gray-50 border-gray-200'
                    }`}>
                    <div className="flex items-center gap-2 sm:gap-3">
                        {data?.isSubmit ? (
                            <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                        ) : (
                            <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" />
                        )}
                        <div>
                            <p className="font-semibold text-gray-900 text-sm sm:text-base">Final Submission</p>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                {data?.isSubmit ? 'Completed ✓' : 'Pending'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default ApplicationStatus