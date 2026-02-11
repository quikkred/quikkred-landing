"use client";

import { useState } from "react";
import { useToast, Toaster } from "@/components/ui/toast";

export default function ComplaintNewForm() {
    const [form, setForm] = useState({
        fullName: "",
        mobile: "",
        email: "",
        category: "",
        complaint: "",
    });
    const [file, setFile] = useState<File | null>(null);
    const { toast } = useToast();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("fullName", form.fullName);
            formData.append("mobile", form.mobile);
            formData.append("email", form.email);
            formData.append("category", form.category);
            formData.append("complaint", form.complaint);

            if (file) {
                formData.append("document", file);
            }

            const res = await fetch("", {
                method: "POST",
                body: formData, // IMPORTANT: don't set Content-Type manually
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.message || "Failed to submit complaint");
            }
            toast({
                variant: "success",
                title: "Complaint Submitted!",
                description: `Your reference id is ${data.referenceId}.`,
            });

            setForm({
                fullName: "",
                mobile: "",
                email: "",
                category: "",
                complaint: "",
            });
            setFile(null);

        } catch (err: any) {
            console.error(err);
            toast({
                variant: "error",
                title: "Unable to submit your complaint..",
                description: `Something went wrong. Please try again.`,
            });
            setForm({
                fullName: "",
                mobile: "",
                email: "",
                category: "",
                complaint: "",
            });
            setFile(null);
        }
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);
    };

    return (
        <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4">
            {/* <section>hii</section> */}
            <h2 className="text-3xl font-bold text-teal-500 mb-2">
                Grievance / Complaint Form
            </h2>
            <p className="text-sm text-gray-500 mb-6">
                Please fill in the details below. Our support team will get back to you within 24–48 hours.
            </p>
            <section className="w-full max-w-xl bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            required
                            autoComplete="off"
                            placeholder="Enter your full name"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>

                    {/* Mobile */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mobile Number
                        </label>
                        <input
                            type="tel"
                            name="mobile"
                            value={form.mobile}
                            onChange={handleChange}
                            required
                            autoComplete="off"
                            placeholder="10-digit mobile number"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            autoComplete="off"
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>


                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Complaint Category
                        </label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            required
                            autoComplete="off"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            <option value="">Select a category</option>
                            <option value="loan_disbursement">Loan Disbursement</option>
                            <option value="repayment">Repayment / EMI Issue</option>
                            <option value="interest_charges">Interest / Charges</option>
                            <option value="app_issue">App / Technical Issue</option>
                            <option value="customer_support">Customer Support</option>
                            <option value="privacy">Privacy / Data Concern</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Complaint */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Complaint Details
                        </label>
                        <textarea
                            name="complaint"
                            value={form.complaint}
                            onChange={handleChange}
                            required
                            rows={4}
                            autoComplete="off"
                            placeholder="Describe your issue in detail..."
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Upload Supporting Document (Optional)
                        </label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept=".jpg,.jpeg,.png,.pdf"
                            className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg
                         file:border-0 file:text-sm file:font-medium
                         file:bg-teal-50 file:text-teal-600
                         hover:file:bg-teal-100"
                        />
                        {file && (
                            <p className="mt-1 text-xs text-gray-500">
                                Selected file: <span className="text-teal-600">{file.name}</span>
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full mt-4 bg-teal-500 text-white py-2.5 rounded-lg font-medium hover:bg-teal-600 transition"
                    >
                        Submit Complaint
                    </button>
                </form>
            </section>
        </div>
    );
}
