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
    pageSub_bn: 'নতুন দলিলের তথ্য পূরণ করুন',
    pageSub_en: 'Fill in the new deed information',

    sectionBasic_bn: 'দলিলের মূল তথ্য',
    sectionBasic_en: 'Deed Information',
    sectionParty_bn: 'দাতা ও গ্রহীতার তথ্য',
    sectionParty_en: 'Donor & Recipient Info',
    sectionContact_bn: 'যোগাযোগ ও মন্তব্য',
    sectionContact_en: 'Contact & Notes',
    sectionPdf_bn: 'দলিল PDF',
    sectionPdf_en: 'Deed PDF',

    serialNo_bn: 'ক্রমিক নং',
    serialNo_en: 'Serial No',
    serialLoading_bn: 'লোড হচ্ছে...',
    serialLoading_en: 'Loading...',

    deedNo_bn: 'দলিল নং',
    deedNo_en: 'Deed No',
    deedNoPh_bn: 'যেমন: 1234/2025',
    deedNoPh_en: 'e.g. 1234/2025',

    date_bn: 'তারিখ',
    date_en: 'Date',

    donorName_bn: 'দাতার নাম',
    donorName_en: 'Donor Name',
    donorNamePh_bn: 'দাতার পূর্ণ নাম',
    donorNamePh_en: 'Donor full name',

    donorFatherName_bn: 'দাতার পিতার নাম',
    donorFatherName_en: "Donor's Father Name",
    donorFatherNamePh_bn: 'দাতার পিতার নাম',
    donorFatherNamePh_en: "Donor's father name",

    recipientName_bn: 'গ্রহীতার নাম',
    recipientName_en: 'Recipient Name',
    recipientNamePh_bn: 'গ্রহীতার পূর্ণ নাম',
    recipientNamePh_en: 'Recipient full name',

    recipientFatherName_bn: 'গ্রহীতার পিতার নাম',
    recipientFatherName_en: "Recipient's Father Name",
    recipientFatherNamePh_bn: 'গ্রহীতার পিতার নাম',
    recipientFatherNamePh_en: "Recipient's father name",

    mouzaName_bn: 'মৌজার নাম',
    mouzaName_en: 'Mouza Name',
    mouzaNamePh_bn: 'মৌজার নাম',
    mouzaNamePh_en: 'Mouza name',

    deedType_bn: 'দলিলের রকম',
    deedType_en: 'Deed Type',
    deedTypePh_bn: 'যেমন: বিক্রয় দলিল / দানপত্র / হেবা দলিল',
    deedTypePh_en: 'e.g. Sale Deed / Gift Deed / Heba Deed',

    value_bn: 'মূল্য (টাকা)',
    value_en: 'Value (BDT)',
    valuePh_bn: 'যেমন: ৫,০০,০০০',
    valuePh_en: 'e.g. 500000',

    mobile_bn: 'মোবাইল নম্বর',
    mobile_en: 'Mobile Number',
    mobilePh_bn: 'যেমন: 01788766735',
    mobilePh_en: 'e.g. 01788766735',

    remarks_bn: 'মন্তব্য',
    remarks_en: 'Remarks',
    remarksPh_bn: 'অতিরিক্ত তথ্য (ঐচ্ছিক)',
    remarksPh_en: 'Additional notes (optional)',

    pdf_bn: 'দলিল PDF',
    pdf_en: 'Deed PDF',
    pdfUpload_bn: 'PDF আপলোড করুন',
    pdfUpload_en: 'Upload PDF',
    pdfHint_bn: 'শুধুমাত্র PDF, সর্বোচ্চ 10MB',
    pdfHint_en: 'PDF only, max 10MB',

    save_bn: 'সংরক্ষণ করুন',
    save_en: 'Save Deed',
    cancel_bn: 'বাতিল',
    cancel_en: 'Cancel',
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

  const renderField = ({
    icon: Icon,
    label,
    field,
    placeholder,
    type = 'text',
    required = false,
  }: {
    icon: any;
    label: string;
    field: keyof FormData;
    placeholder?: string;
    type?: string;
    required?: boolean;
  }) => (
    <div className="w-full min-w-0">
      <label className="block text-xs sm:text-sm font-semibold text-[#1F2937] mb-1.5 text-bangla-safe">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
          <Icon size={16} />
        </div>
        <input
          type={type}
          value={formData[field]}
          onChange={(e) => handleChange(field, e.target.value)}
          placeholder={placeholder}
          className={`w-full pl-10 pr-3 py-2.5 rounded-lg border transition-all duration-200 bg-white text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 ${
            errors[field as keyof FormErrors]
              ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
              : 'border-[#E5E7EB] focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20'
          }`}
        />
      </div>
      {errors[field as keyof FormErrors] && (
        <p className="mt-1 text-xs text-red-600 flex items-center gap-1 text-bangla-safe">
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
        className="w-full max-w-4xl mx-auto"
      >
        {/* ===== Page Header (ONLY TITLE HERE) ===== */}
        <div className="mb-5 sm:mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#1F7A3F]/10 border border-[#1F7A3F]/20 flex items-center justify-center flex-shrink-0">
              <FilePlus2 size={20} className="text-[#1F7A3F]" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-[#1F2937] text-bangla-heading pt-1 pb-0.5 leading-tight">
                {t('pageTitle')}
              </h1>
              <p className="text-[11px] sm:text-xs text-[#6B7280] text-bangla-safe">
                {t('pageSub')}
              </p>
            </div>
          </div>
        </div>

        {/* Success */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-start gap-2 p-3 rounded-lg bg-[#DCFCE7] border border-[#22C55E]/30"
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
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Section 1 */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-4 sm:p-5 lg:p-6">
            <h2 className="text-sm sm:text-base font-bold text-[#1F2937] text-bangla-heading pt-1 pb-2 mb-4 flex items-center gap-2 border-b border-[#F3F4F6]">
              <Hash size={16} className="text-[#1F7A3F]" />
              {t('sectionBasic')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {/* Serial No */}
              <div className="w-full min-w-0">
                <label className="block text-xs sm:text-sm font-semibold text-[#1F2937] mb-1.5 text-bangla-safe">
                  {t('serialNo')}
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                    <Hash size={16} />
                  </div>
                  <input
                    type="text"
                    value={
                      serialLoading ? t('serialLoading') : formData.serialNo
                    }
                    readOnly
                    disabled
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-[#E5E7EB] bg-[#F8FAF9] text-sm text-[#1F7A3F] font-bold text-bangla-safe cursor-not-allowed focus:outline-none"
                  />
                </div>
              </div>

              {renderField({
                icon: FileText,
                label: t('deedNo'),
                field: 'deedNo',
                placeholder: t('deedNoPh'),
                required: true,
              })}

              {renderField({
                icon: Calendar,
                label: t('date'),
                field: 'date',
                type: 'date',
                required: true,
              })}

              {renderField({
                icon: FileText,
                label: t('deedType'),
                field: 'deedType',
                placeholder: t('deedTypePh'),
                required: true,
              })}

              {renderField({
                icon: MapPin,
                label: t('mouzaName'),
                field: 'mouzaName',
                placeholder: t('mouzaNamePh'),
                required: true,
              })}

              {/* Value with ৳ */}
              <div className="w-full min-w-0">
                <label className="block text-xs sm:text-sm font-semibold text-[#1F2937] mb-1.5 text-bangla-safe">
                  {t('value')}
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none font-bold text-base">
                    ৳
                  </div>
                  <input
                    type="text"
                    value={formData.value}
                    onChange={(e) => handleChange('value', e.target.value)}
                    placeholder={t('valuePh')}
                    className={`w-full pl-10 pr-3 py-2.5 rounded-lg border transition-all duration-200 bg-white text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 ${
                      errors.value
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-[#E5E7EB] focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20'
                    }`}
                  />
                </div>
                {errors.value && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 text-bangla-safe">
                    <AlertCircle size={12} />
                    {errors.value}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-4 sm:p-5 lg:p-6">
            <h2 className="text-sm sm:text-base font-bold text-[#1F2937] text-bangla-heading pt-1 pb-2 mb-4 flex items-center gap-2 border-b border-[#F3F4F6]">
              <Users size={16} className="text-[#1F7A3F]" />
              {t('sectionParty')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {renderField({
                icon: User,
                label: t('donorName'),
                field: 'donorName',
                placeholder: t('donorNamePh'),
                required: true,
              })}
              {renderField({
                icon: User,
                label: t('donorFatherName'),
                field: 'donorFatherName',
                placeholder: t('donorFatherNamePh'),
              })}
              {renderField({
                icon: User,
                label: t('recipientName'),
                field: 'recipientName',
                placeholder: t('recipientNamePh'),
                required: true,
              })}
              {renderField({
                icon: User,
                label: t('recipientFatherName'),
                field: 'recipientFatherName',
                placeholder: t('recipientFatherNamePh'),
              })}
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-4 sm:p-5 lg:p-6">
            <h2 className="text-sm sm:text-base font-bold text-[#1F2937] text-bangla-heading pt-1 pb-2 mb-4 flex items-center gap-2 border-b border-[#F3F4F6]">
              <Phone size={16} className="text-[#1F7A3F]" />
              {t('sectionContact')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {renderField({
                icon: Phone,
                label: t('mobile'),
                field: 'mobile',
                placeholder: t('mobilePh'),
                type: 'tel',
                required: true,
              })}
              <div className="w-full min-w-0">
                <label className="block text-xs sm:text-sm font-semibold text-[#1F2937] mb-1.5 text-bangla-safe">
                  {t('remarks')}
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-[#9CA3AF] pointer-events-none">
                    <MessageSquare size={16} />
                  </div>
                  <textarea
                    value={formData.remarks}
                    onChange={(e) => handleChange('remarks', e.target.value)}
                    placeholder={t('remarksPh')}
                    rows={3}
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-[#E5E7EB] transition-all duration-200 bg-white text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: PDF */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-4 sm:p-5 lg:p-6">
            <h2 className="text-sm sm:text-base font-bold text-[#1F2937] text-bangla-heading pt-1 pb-2 mb-4 flex items-center gap-2 border-b border-[#F3F4F6]">
              <FileText size={16} className="text-[#1F7A3F]" />
              {t('sectionPdf')}
            </h2>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer rounded-xl border-2 border-dashed p-5 sm:p-8 text-center transition-all duration-200 ${
                errors.pdf
                  ? 'border-red-300 bg-red-50'
                  : pdfFile
                  ? 'border-[#22C55E] bg-[#F0FDF4]'
                  : 'border-[#E5E7EB] bg-[#F8FAF9] hover:border-[#1F7A3F]/40 hover:bg-[#1F7A3F]/5'
              }`}
            >
              {pdfFile ? (
                <div className="flex items-center justify-center gap-3 flex-wrap sm:flex-nowrap">
                  <div className="w-11 h-11 rounded-xl bg-[#1F7A3F]/10 flex items-center justify-center flex-shrink-0">
                    <FileText size={20} className="text-[#1F7A3F]" />
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-[#1F2937] text-bangla-safe break-all">
                      {pdfFile.name}
                    </p>
                    <p className="text-[11px] text-[#6B7280]">
                      {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPdfFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors flex-shrink-0"
                    aria-label="Remove file"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-11 h-11 mx-auto rounded-xl bg-[#1F7A3F]/10 flex items-center justify-center mb-2">
                    <Upload size={20} className="text-[#1F7A3F]" />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-[#1F2937] text-bangla-safe mb-1">
                    {t('pdfUpload')}
                  </p>
                  <p className="text-[11px] text-[#6B7280] text-bangla-safe">
                    {t('pdfHint')}
                  </p>
                </>
              )}
            </div>

            {errors.pdf && (
              <p className="mt-2 text-xs text-red-600 flex items-center gap-1 text-bangla-safe">
                <AlertCircle size={12} />
                {errors.pdf}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end pt-1">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-sm text-[#4B5563] bg-white border border-[#E5E7EB] hover:bg-[#F8FAF9] transition-all duration-200 text-bangla-safe"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-white text-sm bg-[#1F7A3F] hover:bg-[#155E30] shadow-md shadow-[#1F7A3F]/20 hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-bangla-safe">{t('saving')}</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span className="text-bangla-safe">{t('save')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </DashboardLayout>
  );
}
