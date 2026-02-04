"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Download, Home, ArrowRight, IndianRupee, Clock, CalendarDays, Building2, Wallet } from "lucide-react";
import Link from "next/link";
import { useApplication } from "@/contexts/ApplicationContext";

const ApplicationSuccess = () => {
    const { application } = useApplication();
    // Helper to format currency
    const formatCurrency = (amount: number | null | undefined) => {
        if (amount === null || amount === undefined) return "₹0";
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Helper to format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const isDisbursed = application?.disbursementStatus === "PAID";

    return (
        <div className="w-full max-w-lg mx-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
            >
                {/* ----------------- HEADER & SUCCESS ANIMATION ----------------- */}
                <div className="bg-[#ecfdf5] pt-8 pb-10 px-6 text-center relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10"
                        style={{ backgroundImage: 'radial-gradient(#25B181 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                    </div>

                    <div className="relative z-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                            className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm"
                        >
                            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                        </motion.div>

                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Application Submitted!
                        </h1>
                        <p className="text-sm text-gray-600 max-w-xs mx-auto leading-relaxed">
                            Your application <span className="font-mono font-medium text-gray-800">#{application?.applicationNumber}</span> has been received and the loan amount is approved.
                        </p>
                    </div>
                </div>

                {/* ----------------- LOAN OFFER CARD ----------------- */}
                <div className="px-6 -mt-6 relative z-20">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-5">
                        <div className="text-center border-b border-gray-100 pb-4 mb-4">
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Approved Loan Amount</p>
                            <div className="text-3xl font-extrabold text-emerald-600 flex items-center justify-center">
                                {formatCurrency(application?.approvedLoanAmount || application?.breApprovedLoanAmount)}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                            <DetailRow
                                icon={<CalendarDays className="w-3.5 h-3.5" />}
                                label="Tenure"
                                value={`${application?.tenure} ${application?.tenureUnit}`}
                            />
                            <DetailRow
                                icon={<Wallet className="w-3.5 h-3.5" />}
                                label="EMI Amount"
                                value={formatCurrency(application?.emiAmount)}
                            />
                            <DetailRow
                                icon={<IndianRupee className="w-3.5 h-3.5" />}
                                label="Processing Fee"
                                value={formatCurrency(application?.processingFee)}
                            />
                            <DetailRow
                                icon={<Clock className="w-3.5 h-3.5" />}
                                label="Interest Rate"
                                value={`${application?.interestRate}% p.a`}
                            />
                        </div>
                    </div>
                </div>

                {/* ----------------- DISBURSEMENT STATUS ----------------- */}
                <div className="p-6 space-y-6">
                    {/* Bank Details */}
                    {application?.disbursementBankAccount && (
                        <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4 border border-gray-100">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100 shrink-0">
                                <Building2 className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-500 mb-0.5">Disbursement Account</p>
                                <p className="text-sm font-bold text-gray-900 truncate">
                                    {application.disbursementBankAccount.bankName}
                                </p>
                                <p className="text-xs text-gray-500 font-mono">
                                    •••• {application.disbursementBankAccount.accountNumber.slice(-4)}
                                </p>
                            </div>
                            {isDisbursed ? (
                                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                                    PAID
                                </span>
                            ) : (
                                <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                                    PENDING
                                </span>
                            )}
                        </div>
                    )}

                    {/* Timeline */}
                    <div className="relative pl-4 border-l-2 border-gray-100 space-y-6">
                        <TimelineItem
                            active={true}
                            title="Application Submitted"
                            date={formatDate(application?.createdAt || "")}
                        />
                        <TimelineItem
                            active={true}
                            title="Credit Verification"
                            date="Completed instantly"
                        />
                        <TimelineItem
                            active={isDisbursed}
                            title="Disbursement Initiated"
                            date={isDisbursed ? "Funds transferred" : "Estimated: 15 mins"}
                            isLast
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 gap-3 pt-2">
                        <Link
                            href="/user"
                            className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-gray-900/10"
                        >
                            <Home className="w-4 h-4" />
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// --- Sub Components for cleaner code ---

const DetailRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
    <div className="flex flex-col">
        <div className="flex items-center gap-1.5 text-gray-500 mb-1">
            {icon}
            <span className="text-[11px] font-medium uppercase tracking-wide">{label}</span>
        </div>
        <span className="text-sm font-bold text-gray-900 pl-5">{value}</span>
    </div>
);

const TimelineItem = ({ active, title, date, isLast }: { active: boolean, title: string, date: string, isLast?: boolean }) => (
    <div className="relative">
        <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 ${active ? 'bg-emerald-500 border-emerald-100 ring-4 ring-emerald-50' : 'bg-gray-200 border-white'}`} />
        <div>
            <h4 className={`text-sm font-bold ${active ? 'text-gray-900' : 'text-gray-400'}`}>{title}</h4>
            <p className="text-xs text-gray-500 mt-0.5">{date}</p>
        </div>
    </div>
);

export default ApplicationSuccess;