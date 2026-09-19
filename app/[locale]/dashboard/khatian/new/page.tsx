'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import {
  Save,
  X,
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  Hash,
  User,
  MapPin,
  Map,
  Layers,
  Maximize2,
  MessageSquare,
  FilePlus2,
  FileType,
} from 'lucide-react';
import { getDemoUser, clearDemoUser, DemoUser } from '@/lib/auth';
import DashboardLayout from '../../DashboardLayout';

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

function generateSerialNo(existingSerials: string[]): string {
  if (!existingSerials || existingSerials.length === 0) return '01';

  const lastSerial = existingSerials
    .map((s) => parseInt(s, 10))
    .filter((n) => !isNaN(n))
    .sort((a, b) => b - a)[0];

  const nextSerial = (lastSerial || 0) + 1;
  return nextSerial.toString().padStart(2, '0');
}

export default function NewKhatianPage() {
  const locale = useLocale();
  const router = useRouter();
  const isBn = locale === 'bn';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<DemoUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [serialLoading, setSerialLoading] = useState(true);

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

  useEffect(() => {
    const currentUser = getDemoUser();
    if (!currentUser) {
      router.push(`/${isBn ? '' : locale + '/'}login`);
      return;
    }
    setUser(currentUser);
    setAuthChecked(true);
  }, [router, isBn, locale]);

  useEffect(() => {
    if (!authChecked) return;

    const fetchAndGenerateSerial = async () => {
      setSerialLoading(true);
      const existingSerials = ['01', '02', '03', '04', '05'];

      setTimeout(() => {
        const newSerial = generateSerialNo(existingSerials);
        setFormData((prev) => ({ ...prev, serialNo: newSerial }));
        setSerialLoading(false);
      }, 400);
    };

    fetchAndGenerateSerial();
  }, [authChecked]);

  const handleLogout = () => {
    clearDemoUser();
    router.push(`/${isBn ? '' : locale + '/'}login`);
  };

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

    pdf_bn: 'পি ডি এফ',
    pdf_en: 'PDF',

    save_bn: 'Save Khatian Entry',
    save_en: 'Save Khatian Entry',
    saving_bn: 'সংরক্ষণ হচ্ছে...',
    saving_en: 'Saving...',

    required_bn: 'এই ঘরটি পূরণ করুন',
    required_en: 'This field is required',
    pdfTooLarge_bn: 'PDF 10MB এর চেয়ে ছোট হতে হবে',
    pdfTooLarge_en: 'PDF must be under 10MB',
    pdfInvalid_bn: 'শুধুমাত্র PDF ফাইল আপলোড করুন',
    pdfInvalid_en: 'Only PDF files allowed',
    success_bn: 'খতিয়ান সফলভাবে সংরক্ষিত হয়েছে!',
    success_en: 'Khatian saved successfully!',
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

    if (file.type !== 'application/pdf') {
      setErrors((prev) => ({ ...prev, pdf: t('pdfInvalid') }));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
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
    setSuccess('');
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSuccess(t('success'));
      setTimeout(() => {
        router.push(`/${isBn ? '' : locale + '/'}dashboard/khatian/pending`);
      }, 1500);
    }, 1500);
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
          className={`w-full pl-11 pr-4 py-3 rounded-lg border transition-all duration-200 bg-white text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 ${
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

  if (!authChecked || !user) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#F8FAF9]">
        <div className="text-center">
          <Loader2
            size={40}
            className="animate-spin text-[#1F7A3F] mx-auto mb-4"
          />
          <p className="text-sm text-[#6B7280] text-bangla-safe">
            {isBn ? 'লোড হচ্ছে...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-full overflow-x-hidden"
      >
        {/* Page Title */}
        <div className="mb-5 sm:mb-6 w-full">
          <h1 className="text-lg sm:text-xl font-bold text-[#1F2937] text-bangla-heading">
            {t('pageTitle')}
          </h1>
        </div>

        {/* Success */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-start gap-2.5 p-3 sm:p-4 rounded-xl bg-[#DCFCE7] border border-[#22C55E]/30"
          >
            <CheckCircle
              size={18}
              className="text-[#15803D] flex-shrink-0 mt-0.5"
            />
            <p className="text-sm text-[#166534] text-bangla-safe">
              {success}
            </p>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-full">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-5 sm:p-6 lg:p-7 w-full">
            {/* Row 1: 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 w-full mb-4 sm:mb-5">
              {/* Serial No */}
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
                    value={
                      serialLoading ? t('serialLoading') : formData.serialNo
                    }
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

            {/* Row 2: 2 columns */}
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

            {/* Row 3: 2 columns */}
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

            {/* Row 4: Remarks */}
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
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-[#E5E7EB] transition-all duration-200 bg-white text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20 resize-none"
                />
              </div>
            </div>

            {/* Row 5: PDF */}
            <div className="w-full min-w-0">
              <label className="block text-sm font-semibold text-[#1F2937] mb-2 text-bangla-safe">
                {t('pdf')}
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative cursor-pointer rounded-lg border transition-all duration-200 p-3 w-full flex items-center gap-3 ${
                  errors.pdf
                    ? 'border-red-300 bg-red-50'
                    : pdfFile
                    ? 'border-[#22C55E] bg-[#F0FDF4]'
                    : 'border-[#E5E7EB] bg-white hover:border-[#1F7A3F]/40'
                }`}
              >
                <div className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-[#F8FAF9] border border-[#E5E7EB] text-sm font-semibold text-[#1F7A3F] hover:bg-[#1F7A3F]/5 transition-colors shrink-0">
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
                    aria-label="Remove file"
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

          {/* Save Button */}
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
    </DashboardLayout>
  );
}
