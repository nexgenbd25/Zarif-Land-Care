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
  Calendar,
  User,
  Users,
  MapPin,
  Phone,
  MessageSquare,
  FilePlus2,
} from 'lucide-react';
import { getDemoUser, clearDemoUser, DemoUser } from '@/lib/auth';
import DashboardLayout from '../../DashboardLayout';

interface FormData {
  serialNo: string;
  deedNo: string;
  date: string;
  donorName: string;
  donorFatherName: string;
  recipientName: string;
  recipientFatherName: string;
  mouzaName: string;
  deedType: string;
  value: string;
  mobile: string;
  remarks: string;
}

interface FormErrors {
  deedNo?: string;
  date?: string;
  donorName?: string;
  recipientName?: string;
  mouzaName?: string;
  deedType?: string;
  value?: string;
  mobile?: string;
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

export default function NewDeedPage() {
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
    deedNo: '',
    date: new Date().toISOString().split('T')[0],
    donorName: '',
    donorFatherName: '',
    recipientName: '',
    recipientFatherName: '',
    mouzaName: '',
    deedType: '',
    value: '',
    mobile: '',
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
    pageTitle_bn: 'নতুন দলিল এন্ট্রি',
    pageTitle_en: 'New Deed Entry',

    serialNo_bn: 'ক্রমিক নং',
    serialNo_en: 'Serial No',
    serialLoading_bn: 'লোড হচ্ছে...',
    serialLoading_en: 'Loading...',

    deedNo_bn: 'দলিল নং',
    deedNo_en: 'Deed No',

    date_bn: 'তারিখ',
    date_en: 'Date',

    donorName_bn: 'দাতার নাম',
    donorName_en: 'Donor Name',

    donorFatherName_bn: 'দাতার পিতার নাম',
    donorFatherName_en: "Donor's Father Name",

    recipientName_bn: 'গ্রহীতার নাম',
    recipientName_en: 'Recipient Name',

    recipientFatherName_bn: 'গ্রহীতার পিতার নাম',
    recipientFatherName_en: "Recipient's Father Name",

    mouzaName_bn: 'মৌজার নাম',
    mouzaName_en: 'Mouza Name',

    deedType_bn: 'দলিলের রকম',
    deedType_en: 'Deed Type',

    value_bn: 'মূল্য',
    value_en: 'Value',

    mobile_bn: 'মোবাইল নম্বর',
    mobile_en: 'Mobile Number',

    remarks_bn: 'মন্তব্য',
    remarks_en: 'Remarks',

    pdf_bn: 'দলিল PDF',
    pdf_en: 'Deed PDF',

    save_bn: 'Save Deed Entry',
    save_en: 'Save Deed Entry',
    saving_bn: 'সংরক্ষণ হচ্ছে...',
    saving_en: 'Saving...',

    required_bn: 'এই ঘরটি পূরণ করুন',
    required_en: 'This field is required',
    invalidMobile_bn: 'সঠিক মোবাইল নম্বর দিন',
    invalidMobile_en: 'Enter valid mobile number',
    invalidValue_bn: 'সঠিক মূল্য দিন',
    invalidValue_en: 'Enter valid value',
    pdfTooLarge_bn: 'PDF 10MB এর চেয়ে ছোট হতে হবে',
    pdfTooLarge_en: 'PDF must be under 10MB',
    pdfInvalid_bn: 'শুধুমাত্র PDF ফাইল আপলোড করুন',
    pdfInvalid_en: 'Only PDF files allowed',
    success_bn: 'দলিল সফলভাবে সংরক্ষিত হয়েছে!',
    success_en: 'Deed saved successfully!',
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
    if (!formData.deedNo.trim()) newErrors.deedNo = t('required');
    if (!formData.date) newErrors.date = t('required');
    if (!formData.donorName.trim()) newErrors.donorName = t('required');
    if (!formData.recipientName.trim()) newErrors.recipientName = t('required');
    if (!formData.mouzaName.trim()) newErrors.mouzaName = t('required');
    if (!formData.deedType.trim()) newErrors.deedType = t('required');
    if (!formData.value.trim()) newErrors.value = t('required');
    else if (isNaN(Number(formData.value.replace(/,/g, ''))))
      newErrors.value = t('invalidValue');
    if (!formData.mobile.trim()) newErrors.mobile = t('required');
    else if (!/^\d{10,15}$/.test(formData.mobile.replace(/\D/g, '')))
      newErrors.mobile = t('invalidMobile');

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
        router.push(`/${isBn ? '' : locale + '/'}dashboard/deeds/pending`);
      }, 1500);
    }, 1500);
  };

  // 🎯 Reusable Field — Green Theme
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
        {/* ===== Page Title ===== */}
        <div className="mb-5 sm:mb-6 w-full">
          <h1 className="text-lg sm:text-xl font-bold text-[#1F2937] text-bangla-heading">
            {t('pageTitle')}
          </h1>
        </div>

        {/* ===== Success ===== */}
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

        {/* ===== Form ===== */}
        <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-full">
          {/* ===== Card 1 ===== */}
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
                icon: FileText,
                label: t('deedNo'),
                field: 'deedNo',
                required: true,
              })}

              {renderField({
                icon: Calendar,
                label: t('date'),
                field: 'date',
                type: 'date',
                required: true,
              })}
            </div>

            {/* Row 2: 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 w-full mb-4 sm:mb-5">
              {renderField({
                icon: User,
                label: t('donorName'),
                field: 'donorName',
                required: true,
              })}
              {renderField({
                icon: User,
                label: t('donorFatherName'),
                field: 'donorFatherName',
              })}
            </div>

            {/* Row 3: 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 w-full mb-4 sm:mb-5">
              {renderField({
                icon: User,
                label: t('recipientName'),
                field: 'recipientName',
                required: true,
              })}
              {renderField({
                icon: User,
                label: t('recipientFatherName'),
                field: 'recipientFatherName',
              })}
            </div>

            {/* Row 4: 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 w-full mb-4 sm:mb-5">
              {renderField({
                icon: MapPin,
                label: t('mouzaName'),
                field: 'mouzaName',
                required: true,
              })}
              {renderField({
                icon: FileText,
                label: t('deedType'),
                field: 'deedType',
                required: true,
              })}
            </div>

            {/* Row 5: 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 w-full mb-4 sm:mb-5">
              {renderField({
                icon: FileText,
                label: t('value'),
                field: 'value',
                required: true,
              })}
              {renderField({
                icon: Phone,
                label: t('mobile'),
                field: 'mobile',
                type: 'tel',
                required: true,
              })}
            </div>

            {/* Row 6: Remarks — Full width */}
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

            {/* Row 7: PDF — Full width */}
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

          {/* ===== Save Button — Full Width Green ===== */}
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
