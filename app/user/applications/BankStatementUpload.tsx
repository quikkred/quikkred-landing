'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud, FileText, X, Loader2, CheckCircle2,
  ShieldCheck, AlertCircle, RefreshCw,
} from 'lucide-react';
import useAxios from '@/hooks/useAxios';
import { toast } from '@/components/ui/toast';

// Manual bank-statement upload for analyst-led verification. Rendered inside the
// application-details modal ONLY when the application carries
// `isActivebankStatementUpload === true` (i.e. the backend has opened a manual
// verification window). Posts multipart/form-data to:
//   {API_BASE_URL}/api/application/upload-bank-statement

const ACCEPTED = ['application/pdf', 'image/jpeg', 'image/png'];
const ACCEPT_ATTR = '.pdf,.jpg,.jpeg,.png';
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

interface BankStatementUploadProps {
  applicationNumber: string;
  applicationId?: string;
  /** Called after a successful upload so the parent can refresh the details. */
  onUploaded?: () => void;
  /** Optional subtitle override (e.g. "Please upload your last 6 months bank statement"). */
  description?: string;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function BankStatementUpload({
  applicationNumber,
  applicationId,
  onUploaded,
  description,
}: BankStatementUploadProps) {
  const axios = useAxios();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback((f: File): string | null => {
    if (!ACCEPTED.includes(f.type)) return 'Only PDF, JPG or PNG files are allowed.';
    if (f.size > MAX_BYTES) return 'File is too large. Maximum size is 10 MB.';
    return null;
  }, []);

  const pickFile = useCallback((f: File | undefined | null) => {
    if (!f) return;
    const msg = validate(f);
    if (msg) {
      setError(msg);
      setFile(null);
      return;
    }
    setError(null);
    setFile(f);
  }, [validate]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    pickFile(e.dataTransfer.files?.[0]);
  }, [pickFile]);

  const handleUpload = async () => {
    if (!file || uploading) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('documentValue', file);
      formData.append('applicationNumber', applicationNumber);
      if (applicationId) formData.append('applicationId', applicationId);
      // Password for protected PDFs — only sent when provided.
      if (password.trim()) formData.append('password', password.trim());

      const res = await axios.postForm('/api/application/upload-bank-statement', formData);

      if (res.status === 200 || res.status === 201) {
        setUploaded(true);
        toast({
          variant: 'success',
          title: 'Statement uploaded',
          description: 'Your bank statement has been submitted for manual verification.',
        });
        onUploaded?.();
      } else {
        throw new Error(res.data?.message || 'Upload failed. Please try again.');
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Something went wrong while uploading. Please try again.';
      setError(message);
      toast({ variant: 'error', title: 'Upload failed', description: message });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-emerald-200">
      <div className="flex items-start gap-2 mb-3 sm:mb-4">
        <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 mt-0.5 shrink-0" />
        <div>
          <h4 className="text-base sm:text-lg font-bold text-gray-800">
            Bank Statement Verification
          </h4>
          <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
            {description || 'Upload your latest bank statement for manual verification by our team.'}
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {uploaded ? (
          /* ---------- Success state ---------- */
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 rounded-lg bg-white border border-emerald-200 px-4 py-4"
          >
            <span className="grid place-items-center w-9 h-9 rounded-full bg-emerald-100 shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-emerald-800 text-sm">
                Submitted for verification
              </p>
              <p className="text-xs text-gray-500 truncate">
                {file?.name} • We&apos;ll review it shortly.
              </p>
            </div>
          </motion.div>
        ) : (
          /* ---------- Upload state ---------- */
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT_ATTR}
              className="hidden"
              onChange={(e) => pickFile(e.target.files?.[0])}
            />

            {!file ? (
              /* Drop zone */
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`w-full rounded-xl border-2 border-dashed px-4 py-7 sm:py-9 flex flex-col items-center justify-center gap-2 transition-all ${
                  isDragging
                    ? 'border-emerald-500 bg-emerald-100/60 scale-[1.01]'
                    : 'border-emerald-300 bg-white/60 hover:border-emerald-400 hover:bg-white'
                }`}
              >
                <span className={`grid place-items-center w-11 h-11 rounded-full transition-colors ${
                  isDragging ? 'bg-emerald-200' : 'bg-emerald-100'
                }`}>
                  <UploadCloud className="w-5 h-5 text-emerald-600" />
                </span>
                <span className="text-sm font-semibold text-gray-700">
                  <span className="text-emerald-700">Click to browse</span> or drag & drop
                </span>
                <span className="text-[11px] text-gray-400">PDF, JPG or PNG • up to 10 MB</span>
              </button>
            ) : (
              /* Selected file chip */
              <div className="flex items-center gap-3 rounded-xl bg-white border border-emerald-200 px-4 py-3">
                <span className="grid place-items-center w-9 h-9 rounded-lg bg-emerald-50 shrink-0">
                  <FileText className="w-5 h-5 text-emerald-600" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-800 truncate">{file.name}</p>
                  <p className="text-xs text-gray-400">{formatSize(file.size)}</p>
                </div>
                {!uploading && (
                  <button
                    type="button"
                    onClick={() => { setFile(null); setError(null); }}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Password for protected statements (optional) — always visible */}
            <div className="mt-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Statement password <span className="text-gray-400">(if PDF is protected)</span>
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password if your statement is locked"
                autoComplete="off"
                className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none"
              />
            </div>

            {error && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
              </p>
            )}

            {file && (
              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading}
                className="mt-3 w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#25B181] via-[#51C9AF] to-[#1F8F68] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {uploading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</>
                ) : error ? (
                  <><RefreshCw className="w-4 h-4" /> Retry Upload</>
                ) : (
                  <><UploadCloud className="w-4 h-4" /> Upload for Verification</>
                )}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
