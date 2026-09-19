'use client';

export const dynamic = 'force-dynamic';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Upload,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Hash,
  User,
  MapPin,
  Map,
  Layers,
  Maximize2,
  MessageSquare,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const ALLOWED_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
];

const ALLOWED_EXTENSIONS = '.pdf,.png,.jpg,.jpeg';
const MAX_FILE_SIZE = 10 * 1024 * 1024;

interface FormData {
  serialNo: string;
  mouzaName: string;
  ownerName: string;
  khatianType: string;
  khatianNo: string;
  dagNo: string;
  landAmount: string;
  remarks: string;
}

interface FormErrors {
  mouzaName?: string;
  ownerName?: string;
  khatianType?: string;
  khatianNo?: string;
  dagNo?: string;
  landAmount?: string;
  pdf?: string;
}

export default function NewKhatianPage() {
  const locale = useLocale();
  const router = useRouter();
  const isBn = locale === 'bn';
  const prefix = isBn ? '' : `/${locale}`;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [serialLoading, setSerialLoading] = useState(true);

  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const [formData, setFormData] = useState<FormData>({
    serialNo: '',
    mouzaName: '',
    ownerName: '',
    khatianType: '',
    khatianNo: '',
    dagNo: '',
    landAmount: '',
    remarks: '',
  });

  // 🎯 Generate Serial Number from DB
  useEffect(() => {
    let cancelled = false;

    async function generateSerial() {
      try {
        setSerialLoading(true);
        const supabase = createClient();

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          if (!cancelled) setSerialLoading(false);
          return;
        }

        const { data: khatians } = await supabase
          .from('khatians')
          .select('serial_no')
          .eq('user_id', user.id);

        let newSerial = '01';

        if (khatians && khatians.length > 0) {
          const maxSerial = khatians
            .map((k) => parseInt(k.serial_no, 10))
            .filter((n) => !isNaN(n))
            .sort((a, b) => b - a)[0];

          newSerial = ((maxSerial || 0) + 1).toString().padStart(2, '0');
        }

        if (!cancelled) {
          setFormData((prev) => ({ ...prev, serialNo: newSerial }));
          setSerialLoading(false);
        }
      } catch (err) {
        console.error('Serial generation error:', err);
        if (!cancelled) {
          setFormData((prev) => ({ ...prev, serialNo: '01' }));
          setSerialLoading(false);
        }
      }
    }

    generateSerial();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const content = {
    pageTitle_bn: 'নতুন খতিয়ান এন্ট্রি',
    pageTitle_en: 'New Khatian Entry',
    serialNo_bn: 'ক্রমিক নং',
    serialNo_en: 'Serial No',
    serialLoading_bn: 'লোড হচ্ছে...',
    serialLoading_en: 'Loading...',
    mouzaName_bn: 'মৌজার নাম',
    mouzaName_en: 'Mouza Name',
    ownerName_bn: 'মালিকের নাম',
    ownerName_en: 'Owner Name',
    khatianType_bn: 'খতিয়ানের ধরন',
    khatianType_en: 'Khatian Type',
    khatianNo_bn: 'খতিয়ান নং',
    khatianNo_en: 'Khatian No',
    dagNo_bn: 'দাগ নং',
    dagNo_en: 'Dag No',
    landAmount_bn: 'জমির পরিমাণ',
    landAmount_en: 'Land Amount',
    remarks_bn: 'মন্তব্য',
    remarks_en: 'Remarks',
    pdf_bn: 'খতিয়ান ফাইল (PDF/ছবি)',
    pdf_en: 'Khatian File (PDF/Image)',
    save_bn: 'Save Khatian Entry',
    save_en: 'Save Khatian Entry',
    saving_bn: 'সংরক্ষণ হচ্ছে...',
    saving_en: 'Saving...',
    required_bn: 'এই ঘরটি পূরণ করুন',
    required_en: 'This field is required',
    pdfTooLarge_bn: 'ফাইল ১০MB এর চেয়ে ছোট হতে হবে',
    pdfTooLarge_en: 'File must be under 10MB',
    pdfInvalid_bn: 'শুধুমাত্র PDF, PNG, JPG, JPEG ফাইল আপলোড করুন',
    pdfInvalid_en: 'Only PDF, PNG, JPG, JPEG files allowed',
    success_bn: 'খতিয়ান সফলভাবে সংরক্ষিত হয়েছে!',
    success_en: 'Khatian saved successfully!',
    saveFailed_bn: 'খতিয়ান সংরক্ষণ ব্যর্থ হয়েছে',
    saveFailed_en: 'Failed to save khatian',
    sessionExpired_bn: 'সেশন মেয়াদোত্তীর্ণ',
    sessionExpired_en: 'Session expired',
  };

  const t = (key: string) =>
    isBn ? (content as any)[`${key}_bn`] : (content as any)[`${key}_en`];

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrors((prev) => ({ ...prev, pdf: t('pdfInvalid') }));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({ ...prev, pdf: t('pdfTooLarge') }));
      return;
    }

    setPdfFile(file);
    setErrors((prev) => ({ ...prev, pdf: undefined }));
  };

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!formData.mouzaName.trim()) newErrors.mouzaName = t('required');
    if (!formData.ownerName.trim()) newErrors.ownerName = t('required');
    if (!formData.khatianType.trim()) newErrors.khatianType = t('required');
    if (!formData.khatianNo.trim()) newErrors.khatianNo = t('required');
    if (!formData.dagNo.trim()) newErrors.dagNo = t('required');
    if (!formData.landAmount.trim()) newErrors.landAmount = t('required');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast(null);

    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setToast({ type: 'error', message: t('sessionExpired') });
        setIsLoading(false);
        window.location.href = `${prefix}/login`;
        return;
      }

      let pdfUrl: string | null = null;

      if (pdfFile) {
        const fileExt = pdfFile.name.split('.').pop() || 'pdf';
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('khatians')
          .upload(fileName, pdfFile, {
            cacheControl: '3600',
            upsert: false,
            contentType: pdfFile.type,
          });

        if (!uploadError && uploadData) {
          const { data: urlData } = supabase.storage
            .from('khatians')
            .getPublicUrl(uploadData.path);
          pdfUrl = urlData.publicUrl;
        }
      }

      const { error: insertError } = await supabase.from('khatians').insert({
        serial_no: formData.serialNo,
        mouza_name: formData.mouzaName.trim(),
        owner_name: formData.ownerName.trim(),
        khatian_type: formData.khatianType.trim(),
        khatian_no: formData.khatianNo.trim(),
        dag_no: formData.dagNo.trim(),
        land_amount: formData.landAmount.trim(),
        remarks: formData.remarks.trim() || null,
        pdf_url: pdfUrl,
        status: 'pending',
        user_id: user.id,
      });

      if (insertError) {
        console.error('Insert error:', insertError);
        setToast({
          type: 'error',
          message: `${t('saveFailed')}: ${insertError.message}`,
        });
        setIsLoading(false);
        return;
      }

      setToast({ type: 'success', message: t('success') });
      setIsLoading(false);

      setTimeout(() => {
        window.location.href = `${prefix}/dashboard/khatian/pending`;
      }, 1500);
    } catch (err: any) {
      console.error('Submit error:', err);
      setToast({
        type: 'error',
        message: err?.message || t('saveFailed'),
      });
      setIsLoading(false);
    }
  };

  const renderField = ({
    icon: Icon,
    label,
    field,
    type = 'text',
    required = false,
  }: {
    icon: any;
    label: string;
    field: keyof FormData;
    type?: string;
    required?: boolean;
  }) => (
    <div className="w-full min-w-0">
      <label className="block text-sm font-semibold text-[#1F2937] mb-2 text-bangla-safe">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative w-full">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
          <Icon size={16} />
        </div>
        <input
          type={type}
          value={formData[field]}
          onChange={(e) => handleChange(field, e.target.value)}
          disabled={isLoading}
          className={`w-full pl-11 pr-4 py-3 rounded-lg border transition-all duration-200 bg-white text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 disabled:opacity-60 ${
            errors[field as keyof FormErrors]
              ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
              : 'border-[#E5E7EB] focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20'
          }`}
        />
      </div>
      {errors[field as keyof FormErrors] && (
        <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1 text-bangla-safe">
          <AlertCircle size={12} />
          {errors[field as keyof FormErrors]}
        </p>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-full overflow-x-hidden"
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed top-3 left-3 right-3 sm:top-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-[100] sm:w-full sm:max-w-md"
          >
            <div
              className={`flex items-start gap-3 p-3 sm:p-4 rounded-xl shadow-lg border-2 backdrop-blur-sm ${
                toast.type === 'success'
                  ? 'bg-[#DCFCE7]/95 border-[#22C55E]/40'
                  : 'bg-red-50/95 border-red-300'
              }`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  toast.type === 'success' ? 'bg-[#22C55E]' : 'bg-red-500'
                }`}
              >
                {toast.type === 'success' ? (
                  <CheckCircle2 size={16} className="text-white" />
                ) : (
                  <AlertCircle size={16} className="text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0 pt-0.5 sm:pt-1">
                <p
                  className={`text-xs sm:text-sm font-semibold text-bangla-safe leading-snug ${
                    toast.type === 'success'
                      ? 'text-[#166534]'
                      : 'text-red-700'
                  }`}
                >
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => setToast(null)}
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  toast.type === 'success'
                    ? 'hover:bg-[#22C55E]/20 text-[#166534]'
                    : 'hover:bg-red-200 text-red-700'
                }`}
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-5 sm:mb-6 w-full">
        <h1 className="text-lg sm:text-xl font-bold text-[#1F2937] text-bangla-heading">
          {t('pageTitle')}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-full">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-5 sm:p-6 lg:p-7 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 w-full mb-4 sm:mb-5">
            <div className="w-full min-w-0">
              <label className="block text-sm font-semibold text-[#1F2937] mb-2 text-bangla-safe">
                {t('serialNo')}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative w-full">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                  <Hash size={16} />
                </div>
                <input
                  type="text"
                  value={serialLoading ? t('serialLoading') : formData.serialNo}
                  readOnly
                  disabled
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-[#E5E7EB] bg-[#F8FAF9] text-sm text-[#1F7A3F] font-bold text-bangla-safe cursor-not-allowed focus:outline-none"
                />
              </div>
            </div>

            {renderField({
              icon: MapPin,
              label: t('mouzaName'),
              field: 'mouzaName',
              required: true,
            })}

            {renderField({
              icon: User,
              label: t('ownerName'),
              field: 'ownerName',
              required: true,
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 w-full mb-4 sm:mb-5">
            {renderField({
              icon: Layers,
              label: t('khatianType'),
              field: 'khatianType',
              required: true,
            })}
            {renderField({
              icon: FileText,
              label: t('khatianNo'),
              field: 'khatianNo',
              required: true,
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 w-full mb-4 sm:mb-5">
            {renderField({
              icon: Map,
              label: t('dagNo'),
              field: 'dagNo',
              required: true,
            })}
            {renderField({
              icon: Maximize2,
              label: t('landAmount'),
              field: 'landAmount',
              required: true,
            })}
          </div>

          <div className="w-full min-w-0 mb-4 sm:mb-5">
            <label className="block text-sm font-semibold text-[#1F2937] mb-2 text-bangla-safe">
              {t('remarks')}
            </label>
            <div className="relative w-full">
              <div className="absolute left-3.5 top-3.5 text-[#9CA3AF] pointer-events-none">
                <MessageSquare size={16} />
              </div>
              <textarea
                value={formData.remarks}
                onChange={(e) => handleChange('remarks', e.target.value)}
                rows={4}
                disabled={isLoading}
                className="w-full pl-11 pr-4 py-3 rounded-lg border border-[#E5E7EB] transition-all duration-200 bg-white text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20 resize-none disabled:opacity-60"
              />
            </div>
          </div>

          <div className="w-full min-w-0">
            <label className="block text-sm font-semibold text-[#1F2937] mb-2 text-bangla-safe">
              {t('pdf')}
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_EXTENSIONS}
              onChange={handleFileChange}
              className="hidden"
            />

            <div
              onClick={() => !isLoading && fileInputRef.current?.click()}
              className={`relative rounded-lg border transition-all duration-200 p-3 w-full flex items-center gap-3 ${
                isLoading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
              } ${
                errors.pdf
                  ? 'border-red-300 bg-red-50'
                  : pdfFile
                  ? 'border-[#22C55E] bg-[#F0FDF4]'
                  : 'border-[#E5E7EB] bg-white hover:border-[#1F7A3F]/40'
              }`}
            >
              <div className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-[#F8FAF9] border border-[#E5E7EB] text-sm font-semibold text-[#1F7A3F] hover:bg-[#1F7A3F]/5 transition-colors shrink-0">
                <Upload size={14} className="mr-1.5" />
                Choose File
              </div>
              <span className="text-sm text-[#6B7280] text-bangla-safe truncate flex-1">
                {pdfFile ? pdfFile.name : 'No file chosen'}
              </span>
              {pdfFile && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPdfFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors shrink-0"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {errors.pdf && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1 text-bangla-safe">
                <AlertCircle size={12} />
                {errors.pdf}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-white text-base bg-[#1F7A3F] hover:bg-[#155E30] shadow-md shadow-[#1F7A3F]/20 hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span className="text-bangla-safe">{t('saving')}</span>
            </>
          ) : (
            <span className="text-bangla-safe">{t('save')}</span>
          )}
        </button>
      </form>
    </motion.div>
  );
}
