"use client"

import { DashboardData } from "@/interfaces/dashboardInterface";
import { ChevronRight, History, RefreshCw, Building } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "nextjs-toploader/app";
import { QUICK_FORM_URL } from "@/lib/config";

const PreviousApplicationStatus = ({
    data
}: {
    data: DashboardData | null
}) => {
    const router = useRouter();
    const formatDate = (dateString: string | null) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    if (!data?.oldApplication) {
        return null;
    }

    const isProceedToBank = data?.applicationStatus === "PROCEED TO BANK";

    return <>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className={`bg-gradient-to-br rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 mb-4 sm:mb-6 ${isProceedToBank
                ? "from-emerald-50 to-teal-50 border-emerald-200"
                : "from-amber-50 to-orange-50 border-amber-200"
                }`}
        >
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${isProceedToBank ? "bg-emerald-500/20" : "bg-amber-500/20"
                    }`}>
                    {isProceedToBank ? (
                        <Building className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                    ) : (
                        <History className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                    )}
                </div>
                <div className="flex-1 w-full">
                    <h3 className={`text-base sm:text-lg font-semibold mb-2 sm:mb-3 ${isProceedToBank ? "text-emerald-900" : "text-amber-900"
                        }`}>
                        Previous Application Found
                    </h3>
                    {(data?.oldApplicationNumber || data?.oldApplicationDate) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                            {data?.oldApplicationNumber && (
                                <div>
                                    <p className={`text-sm mb-1 ${isProceedToBank ? "text-emerald-700" : "text-amber-700"
                                        }`}>Application Number</p>
                                    <p className={`text-base font-semibold ${isProceedToBank ? "text-emerald-900" : "text-amber-900"
                                        }`}>
                                        {data.oldApplicationNumber}
                                    </p>
                                </div>
                            )}

                            {data?.oldApplicationDate && (
                                <div>
                                    <p className={`text-sm mb-1 ${isProceedToBank ? "text-emerald-700" : "text-amber-700"
                                        }`}>Application Date</p>
                                    <p className={`text-base font-semibold ${isProceedToBank ? "text-emerald-900" : "text-amber-900"
                                        }`}>
                                        {formatDate(data.oldApplicationDate)}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        onClick={() => router.push(QUICK_FORM_URL as string)}
                        className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm sm:text-base ${isProceedToBank
                            ? "bg-gradient-to-r from-emerald-600 to-teal-600"
                            : "bg-gradient-to-r from-amber-600 to-orange-600"
                            }`}
                    >
                        {isProceedToBank ? <Building className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                        <span>{isProceedToBank ? "Proceed to Bank" : "Continue Application"}</span>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    </>
}

export default PreviousApplicationStatus