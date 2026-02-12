"use client";

import { toast } from "@/components/ui/toast";
import useAxios from "@/hooks/useAxios";
import { QuickApplyV2FormData } from "@/lib/types/quickApplyV2";
import { useEffect, useState } from "react";

interface SelectProductProps {
    formData: QuickApplyV2FormData;
    setFormData: React.Dispatch<React.SetStateAction<QuickApplyV2FormData>>;
}

const SelectProduct = ({ formData, setFormData }: SelectProductProps) => {
    const [loanProducts, setLoanProducts] = useState<any[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const axios = useAxios();

    const setSelectedProduct = (product: any) => setFormData((prev) => ({ ...prev, selectedProduct: product }));

    useEffect(() => {
        const fetchLoanProducts = async () => {
            setLoadingProducts(true);
            try {
                const response = await axios.get(`/api/loanProduct/allLoanProductsNameOnly`);
                const result = response.data;
                const status = response.status === 200 || response.status === 201;

                if (status && result.success && result.data) {
                    setLoanProducts(result.data);

                    // Set selectedProduct if productId already exists in formData
                    if (formData.productId && result.data.length > 0) {
                        const product = result.data.find((p: any) => p._id === formData.productId);
                        if (product) {
                            setSelectedProduct(product);
                        }
                    }
                } else {
                    console.error('Failed to fetch loan products:', result.message);
                    toast({
                        title: "Error",
                        description: "Failed to load loan products. Please refresh the page.",
                        variant: "error"
                    });
                }
            } catch (error) {
                console.error('Error fetching loan products:', error);
                toast({
                    title: "Error",
                    description: "Failed to load loan products. Please refresh the page.",
                    variant: "error"
                });
            } finally {
                setLoadingProducts(false);
            }
        };

        fetchLoanProducts();
    }, []);

    const handleProductChange = (productId: string) => {
        const product = loanProducts.find(p => p._id === productId);
        setSelectedProduct(product || null);

        // Automatically set purpose based on selected product
        const purpose = product ? `${product.productName} - ${product.category}` : '';

        // Reset tenure when product changes and set default from allowedTenures or minTenure
        let defaultTenure = '';
        if (product) {
            if (product.allowedTenures && product.allowedTenures.length > 0) {
                defaultTenure = product.allowedTenures[0].toString();
            } else {
                defaultTenure = product.minTenure?.toString() || '';
            }
        }

        setFormData(prev => ({
            ...prev,
            productId: productId as string,
            purpose: purpose as string,
            tenure: parseInt(defaultTenure),
            tenureUnit: 'days' as string,
        }));
    };

    return (
        <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Loan Product *
            </label>
            <select
                name="productId"
                value={formData.productId}
                onChange={(e) => handleProductChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25B181]"
                disabled={loadingProducts}
            >
                <option value="">
                    {loadingProducts ? 'Loading products...' : 'Select a loan product'}
                </option>
                {loanProducts.map((product) => (
                    <option key={product._id} value={product._id}>
                        {product.productName} - {product.category}
                    </option>
                ))}
            </select>
            {formData?.selectedProduct && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                        <span className="font-semibold">Category:</span> {formData?.selectedProduct.category} |
                        <span className="font-semibold ml-2">Tenure:</span> {formData?.selectedProduct.category?.toLowerCase().includes('salary') ? '0 days (Pay on salary)' : '15 days'}
                    </p>
                </div>
            )}
        </div>
    )
}

export default SelectProduct