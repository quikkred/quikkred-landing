// Quick Apply Helper Functions

import { getSession } from "next-auth/react";

/**
 * Convert ISO date string to YYYY-MM-DD format for input fields
 */
export const formatDateForInput = (isoDate: string): string => {
  if (!isoDate) return '';
  try {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Format date string for display (DD/MM/YYYY)
 */
export const formatDateForDisplay = (dateStr: string): string => {
  if (!dateStr || dateStr === 'N/A') return 'N/A';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return 'N/A';
  }
};

/**
 * Format date for API (DD/MM/YYYY)
 */
export const formatDOBForAPI = (dateStr: string): string => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`; // Convert to DD/MM/YYYY
  }
  return dateStr;
};

/**
 * Format date from API response (YYYY-MM-DD)
 */
export const formatDOBFromAPI = (dateStr: string): string => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert to YYYY-MM-DD
  }
  return dateStr;
};

/**
 * Safely convert any value to boolean
 * Handles: true, "true", "TRUE", 1, "1", false, "false", undefined, null
 */
export const toBoolean = (value: unknown): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value?.toLowerCase() === 'true';
  if (typeof value === 'number') return value === 1;
  return false;
};

/**
 * Mask Aadhaar number (show only last 4 digits)
 */
export const maskAadhaar = (aadhaar: string): string => {
  if (!aadhaar || aadhaar.length < 4) return 'N/A';
  return `XXXX-XXXX-${aadhaar.slice(-4)}`;
};

/**
 * Format Aadhaar number with dashes
 */
export const formatAadhaar = (aadhaar: string): string => {
  if (!aadhaar) return '';
  const cleaned = aadhaar.replace(/\D/g, '');
  if (cleaned.length <= 4) return cleaned;
  if (cleaned.length <= 8) return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
  return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8, 12)}`;
};

/**
 * Get value or return 'N/A' if empty
 */
export const getValue = (value: any): string => {
  if (value === null || value === undefined || value === '') return 'N/A';
  return String(value);
};

/**
 * Format currency in Indian format
 */
export const formatCurrency = (amount: number | string): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0';
  return num.toLocaleString('en-IN');
};

/**
 * Calculate EMI
 */
export const calculateEMI = (principal: number, rate: number, tenure: number): number => {
  const monthlyRate = rate / 100 / 12;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
              (Math.pow(1 + monthlyRate, tenure) - 1);
  return Math.round(emi);
};

/**
 * Get auth token from localStorage
 */
export const getAuthToken = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null;
  const session = await getSession();
  return (session as any)?.accessToken;
};

/**
 * Validate PAN format
 */
export const isValidPAN = (pan: string): boolean => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan.toUpperCase());
};

/**
 * Validate Aadhaar format
 */
export const isValidAadhaar = (aadhaar: string): boolean => {
  const aadhaarRegex = /^\d{12}$/;
  return aadhaarRegex.test(aadhaar);
};

/**
 * Validate Mobile format
 */
export const isValidMobile = (mobile: string): boolean => {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile);
};

/**
 * Validate Email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate IFSC format
 */
export const isValidIFSC = (ifsc: string): boolean => {
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifscRegex.test(ifsc.toUpperCase());
};

/**
 * Generate document number
 */
export const generateDocumentNumber = (): string => {
  return `DOC${new Date().getFullYear()}${Date.now()}`;
};
