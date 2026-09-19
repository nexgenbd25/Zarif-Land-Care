'use client';

export const dynamic = 'force-dynamic';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ticket,
  Send,
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface FormData {
  subject: string;
  priority: 'low' | 'medium' | 'high';
  message: string;
}

interface FormErrors {
  subject?: string;
  priority?: string;
  message?: string;
}

const MAX_FILES = 5;
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export default function NewTicketPage() {
  const locale = useLocale();
  const router = useRouter();
  const isBn = locale === 'bn';
  const prefix = isBn ? '' : `/${locale}`;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState('');

  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const [formData, setFormData] = useState<FormData>({
    subject: '',
    priority: 'medium',
    message: '',
  });

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const content = {
    pageTitle_bn: 'নতুন টিকেট খুলুন',
    pageTitle_en: 'Open Ticket',
    sectionInfo_bn: 'টিকেটের তথ্য',
    sectionInfo_en: 'Ticket Information',
    sectionAttach_bn: 'সংযুক্তি',
    sectionAttach_en: 'Attachments',
    subjectLabel_bn: 'বিষয়',
    subjectLabel_en: 'Subject',
    subjectPh_bn: 'সংক্ষেপে বিষয় লিখুন',
    subjectPh_en: 'Enter subject briefly',
    priorityLabel_bn: 'প্রাথমিকতা',
    priorityLabel_en: 'Priority',
    low_bn: 'কম',
    low_en: 'Low',
    medium_bn: 'মাঝারি',
    medium_en: 'Medium',
    high_bn: 'জরুরি',
    high_en: 'High',
    messageLabel_bn: 'বার্তা',
    messageLabel_en: 'Message',
    messagePh_bn: 'আপনার সমস্যা বা প্রশ্ন বিস্তারিত লিখুন',
    messagePh_en: 'Describe your issue or question in detail',
    attachHint_bn: 'সর্বোচ্চ ৫টি ফাইল, প্রতিটি ২MB',
    attachHint_en: 'Max 5 files, 2MB each',
    attachAllowed_bn: 'অনুমোদিত: jpg, jpeg, png, pdf, doc, docx',
    attachAllowed_en: 'Allowed: jpg, jpeg, png, pdf, doc, docx',
    chooseFile_bn: 'ফাইল নির্বাচন করুন',
    chooseFile_en: 'Choose File',
    maxFiles_bn: 'সর্বোচ্চ ৫টি ফাইল',
    maxFiles_en: 'Maximum 5 files',
    fileTooLarge_bn: 'ফাইল ২MB এর চেয়ে ছোট হতে হবে',
    fileTooLarge_en: 'File must be under 2MB',
    fileInvalid_bn: 'শুধুমাত্র jpg, png, pdf, doc, docx অনুমোদিত',
    fileInvalid_en: 'Only jpg, png, pdf, doc, docx allowed',
    submit_bn: 'টিকেট জমা দিন',
    submit_en: 'Submit Ticket',
    submitting_bn: 'জমা হচ্ছে...',
    submitting_en: 'Submitting...',
    cancel_bn: 'বাতিল',
    cancel_en: 'Cancel',
    required_bn: 'এই ঘরটি পূরণ করুন',
    required_en: 'This field is required',
    subjectShort_bn: 'বিষয় কমপক্ষে ৩ অক্ষর',
    subjectShort_en: 'Subject must be at least 3 characters',
    messageShort_bn: 'বার্তা কমপক্ষে ১০ অক্ষর',
    messageShort_en: 'Message must be at least 10 characters',
    success_bn: 'টিকেট সফলভাবে জমা হয়েছে!',
    success_en: 'Ticket submitted successfully!',
    saveFailed_bn: 'টিকেট জমা ব্যর্থ হয়েছে',
    saveFailed_en: 'Failed to submit ticket',
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
    setFileError('');
    const selectedFiles = Array.from(e.target.files || []);

    if (files.length + selectedFiles.length > MAX_FILES) {
      setFileError(t('maxFiles'));
      return;
    }

    const validFiles: File[] = [];

    for (const file of selectedFiles) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setFileError(t('fileInvalid'));
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setFileError(t('fileTooLarge'));
        return;
      }
      validFiles.push(file);
    }

    setFiles((prev) => [...prev, ...validFiles]);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileError('');
  };

  const validate = () => {
    const newErrors: FormErrors = {};

    if (!formData.subject.trim()) {
      newErrors.subject = t('required');
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = t('subjectShort');
    }

    if (!formData.priority) {
      newErrors.priority = t('required');
    }

    if (!formData.message.trim()) {
      newErrors.message = t('required');
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t('messageShort');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateTicketNo = async (
    supabase: ReturnType<typeof createClient>
  ) => {
    const { data: existing } = await supabase
      .from('support_tickets')
      .select('ticket_no')
      .order('created_at', { ascending: false })
      .limit(1);

    let nextNum = 1;
    if (existing && existing.length > 0) {
      const lastNo = existing[0].ticket_no;
      const match = lastNo.match(/(\d+)$/);
      if (match) {
        nextNum = parseInt(match[1], 10) + 1;
      }
    }

    return `TKT-${nextNum.toString().padStart(5, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast(null);
    setFileError('');

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

      const ticketNo = await generateTicketNo(supabase);

      const { data: ticket, error: ticketError } = await supabase
        .from('support_tickets')
        .insert({
          ticket_no: ticketNo,
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          priority: formData.priority,
          status: 'pending',
          user_id: user.id,
        })
        .select()
        .single();

      if (ticketError || !ticket) {
        console.error('Insert error:', ticketError);
        setToast({
          type: 'error',
          message: `${t('saveFailed')}: ${ticketError?.message || ''}`,
        });
        setIsLoading(false);
        return;
      }

      if (files.length > 0) {
        for (const file of files) {
          try {
            const fileName = `${user.id}/${ticket.id}/${Date.now()}-${file.name.replace(/[^\w.-]/g, '_')}`;

            const { data: uploadData, error: uploadError } =
              await supabase.storage
                .from('support-tickets')
                .upload(fileName, file, {
                  cacheControl: '3600',
                  upsert: false,
                  contentType: file.type,
                });

            if (!uploadError && uploadData) {
              const { data: urlData } = supabase.storage
                .from('support-tickets')
                .getPublicUrl(uploadData.path);

              await supabase.from('ticket_attachments').insert({
                ticket_id: ticket.id,
                file_name: file.name,
                file_url: urlData.publicUrl,
                file_size: file.size,
                file_type: file.type,
              });
            }
          } catch (err) {
            console.error('Upload error:', err);
          }
        }
      }

      setToast({ type: 'success', message: t('success') });
      setIsLoading(false);

      setTimeout(() => {
        window.location.href = `${prefix}/dashboard/support`;
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-3xl mx-auto"
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

      <div className="mb-5 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#1F7A3F]/10 border border-[#1F7A3F]/20 flex items-center justify-center flex-shrink-0">
            <Ticket size={20} className="text-[#1F7A3F]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-[#1F2937] text-bangla-heading pt-1 pb-0.5 leading-tight">
              {t('pageTitle')}
            </h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-4 sm:p-5 lg:p-6">
          <h2 className="text-sm sm:text-base font-bold text-[#1F2937] text-bangla-heading pt-1 pb-2 mb-4 flex items-center gap-2 border-b border-[#F3F4F6]">
            <MessageSquare size={16} className="text-[#1F7A3F]" />
            {t('sectionInfo')}
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              <div className="w-full min-w-0 md:col-span-2">
                <label className="block text-xs sm:text-sm font-semibold text-[#1F2937] mb-1.5 text-bangla-safe">
                  {t('subjectLabel')}
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                    <MessageSquare size={16} />
                  </div>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => handleChange('subject', e.target.value)}
                    placeholder={t('subjectPh')}
                    disabled={isLoading}
                    className={`w-full pl-10 pr-3 py-2.5 rounded-lg border transition-all duration-200 bg-white text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 disabled:opacity-60 ${
                      errors.subject
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-[#E5E7EB] focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20'
                    }`}
                  />
                </div>
                {errors.subject && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 text-bangla-safe">
                    <AlertCircle size={12} />
                    {errors.subject}
                  </p>
                )}
              </div>

              <div className="w-full min-w-0">
                <label className="block text-xs sm:text-sm font-semibold text-[#1F2937] mb-1.5 text-bangla-safe">
                  {t('priorityLabel')}
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.priority}
                    onChange={(e) => handleChange('priority', e.target.value)}
                    disabled={isLoading}
                    className={`w-full pl-3 pr-10 py-2.5 rounded-lg border transition-all duration-200 bg-white text-sm text-[#1F2937] text-bangla-safe focus:outline-none focus:ring-2 appearance-none cursor-pointer font-semibold disabled:opacity-60 ${
                      errors.priority
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-[#E5E7EB] focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20'
                    }`}
                  >
                    <option value="low">🔵 {t('low')}</option>
                    <option value="medium">🟠 {t('medium')}</option>
                    <option value="high">🔴 {t('high')}</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M3 4.5L6 7.5L9 4.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full min-w-0">
              <label className="block text-xs sm:text-sm font-semibold text-[#1F2937] mb-1.5 text-bangla-safe">
                {t('messageLabel')}
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-[#9CA3AF] pointer-events-none">
                  <MessageSquare size={16} />
                </div>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  placeholder={t('messagePh')}
                  rows={6}
                  disabled={isLoading}
                  className={`w-full pl-10 pr-3 py-2.5 rounded-lg border transition-all duration-200 bg-white text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 resize-none disabled:opacity-60 ${
                    errors.message
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-[#E5E7EB] focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20'
                  }`}
                />
              </div>
              {errors.message && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1 text-bangla-safe">
                  <AlertCircle size={12} />
                  {errors.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-4 sm:p-5 lg:p-6">
          <h2 className="text-sm sm:text-base font-bold text-[#1F2937] text-bangla-heading pt-1 pb-2 mb-4 flex items-center gap-2 border-b border-[#F3F4F6]">
            <Upload size={16} className="text-[#1F7A3F]" />
            {t('sectionAttach')}
          </h2>

          <div className="flex items-start gap-2 p-3 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB] mb-3">
            <AlertCircle
              size={14}
              className="text-[#1F7A3F] flex-shrink-0 mt-0.5"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] sm:text-xs text-[#6B7280] text-bangla-safe">
                {t('attachHint')}
              </p>
              <p className="text-[10px] sm:text-[11px] text-[#9CA3AF] text-bangla-safe mt-0.5">
                {t('attachAllowed')}
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
            multiple
          />

          {files.length > 0 && (
            <div className="space-y-2 mb-3">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[#F8FAF9] border border-[#E5E7EB]"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#1F7A3F]/10 flex items-center justify-center flex-shrink-0">
                    {file.type.startsWith('image/') ? (
                      <ImageIcon size={16} className="text-[#1F7A3F]" />
                    ) : (
                      <FileText size={16} className="text-[#1F7A3F]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-[#1F2937] text-bangla-safe break-all">
                      {file.name}
                    </p>
                    <p className="text-[10px] text-[#6B7280]">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors flex-shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div
            onClick={() => {
              if (isLoading) return;
              if (files.length < MAX_FILES) {
                fileInputRef.current?.click();
              } else {
                setFileError(t('maxFiles'));
              }
            }}
            className={`cursor-pointer rounded-xl border-2 border-dashed p-5 sm:p-6 text-center transition-all duration-200 ${
              isLoading
                ? 'cursor-not-allowed opacity-60 border-[#E5E7EB] bg-[#F8FAF9]'
                : fileError
                ? 'border-red-300 bg-red-50'
                : files.length >= MAX_FILES
                ? 'border-[#E5E7EB] bg-[#F8FAF9] cursor-not-allowed opacity-60'
                : 'border-[#E5E7EB] bg-[#F8FAF9] hover:border-[#1F7A3F]/40 hover:bg-[#1F7A3F]/5'
            }`}
          >
            <div className="w-10 h-10 mx-auto rounded-xl bg-[#1F7A3F]/10 flex items-center justify-center mb-2">
              <Upload size={18} className="text-[#1F7A3F]" />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-[#1F2937] text-bangla-safe mb-1">
              {t('chooseFile')}
            </p>
            <p className="text-[11px] text-[#6B7280] text-bangla-safe">
              {files.length}/{MAX_FILES} — {t('maxFiles')}
            </p>
          </div>

          {fileError && (
            <p className="mt-2 text-xs text-red-600 flex items-center gap-1 text-bangla-safe">
              <AlertCircle size={12} />
              {fileError}
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end pt-1">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-sm text-[#4B5563] bg-white border border-[#E5E7EB] hover:bg-[#F8FAF9] transition-all duration-200 text-bangla-safe disabled:opacity-60"
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
                <span className="text-bangla-safe">{t('submitting')}</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span className="text-bangla-safe">{t('submit')}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
