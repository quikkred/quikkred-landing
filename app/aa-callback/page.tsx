'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE_URL } from '@/lib/config';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function AccountAggregatorCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Processing your bank statement data...');

    useEffect(() => {
        const processCallback = async () => {
            try {
                // Get customerId from user context
                const customerId = user?.id;

                // Get applicationId from localStorage
                let applicationId = localStorage.getItem('applicationId');

                // If not in localStorage, try to get from URL params (if CRIF sends it back)
                if (!applicationId) {
                    const urlApplicationId = searchParams.get('applicationId');
                    if (urlApplicationId) {
                        applicationId = urlApplicationId;
                        localStorage.setItem('applicationId', urlApplicationId);
                    }
                }

                // If still not found, try to fetch from API
                if (!applicationId && customerId) {
                    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
                    if (token) {
                        try {
                            const response = await fetch(`${API_BASE_URL}/api/application/loan/latest`, {
                                method: 'GET',
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            });
                            const result = await response.json();
                            if (result.success && result.data?._id) {
                                const fetchedId = result.data._id;
                                applicationId = fetchedId;
                                localStorage.setItem('applicationId', fetchedId);
                            }
                        } catch (apiError) {
                            console.error('Failed to fetch applicationId from API:', apiError);
                        }
                    }
                }

                if (!customerId || !applicationId) {
                    throw new Error('Missing required information. Please try again from the application page.');
                }

                // Get token for authentication
                const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

                if (!token) {
                    throw new Error('Authentication required. Please login again.');
                }

                // Call POST /api/surepassAA/storeData
                const response = await fetch(`${API_BASE_URL}/api/surepassAA/storeData`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        customerId,
                        applicationId
                    })
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    setStatus('success');
                    setMessage(result.message || 'Bank statement data saved successfully!');

                    // Redirect to application page after 2 seconds
                    setTimeout(() => {
                        router.push('/apply/quick?step=4&aa-success=true');
                    }, 2000);
                } else {
                    throw new Error(result.message || 'Failed to save bank statement data');
                }
            } catch (error: any) {
                console.error('❌ Account Aggregator Callback Error:', error);
                setStatus('error');
                setMessage(error.message || 'Something went wrong. Please try again.');

                // Redirect back after 3 seconds
                setTimeout(() => {
                    router.push('/apply/quick?step=4&aa-error=true');
                }, 3000);
            }
        };

        // Wait for user to be loaded
        if (user) {
            processCallback();
        }
    }, [user, router, searchParams]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                {status === 'loading' && (
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            Processing...
                        </h2>
                        <p className="text-gray-600 mb-4">
                            {message}
                        </p>
                        <div className="bg-blue-50 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                                Please wait while we securely save your bank statement data.
                            </p>
                        </div>
                    </div>
                )}

                {status === 'success' && (
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            Success!
                        </h2>
                        <p className="text-gray-600 mb-4">
                            {message}
                        </p>
                        <div className="bg-green-50 rounded-lg p-4 mb-4">
                            <p className="text-sm text-green-800">
                                Your bank statement has been securely saved. Redirecting you back to your application...
                            </p>
                        </div>
                        <div className="flex justify-center">
                            <div className="animate-pulse flex gap-1">
                                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                <div className="w-2 h-2 bg-green-600 rounded-full animation-delay-200"></div>
                                <div className="w-2 h-2 bg-green-600 rounded-full animation-delay-400"></div>
                            </div>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                <XCircle className="w-10 h-10 text-red-600" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            Something Went Wrong
                        </h2>
                        <p className="text-gray-600 mb-4">
                            {message}
                        </p>
                        <div className="bg-red-50 rounded-lg p-4 mb-4">
                            <p className="text-sm text-red-800">
                                Don't worry! You can try again or contact support for assistance.
                            </p>
                        </div>
                        <div className="flex justify-center">
                            <button
                                onClick={() => router.push('/apply/quick?step=4')}
                                className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
