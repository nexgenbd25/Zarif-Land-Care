'use client';

export const dynamic = 'force-dynamic';

import { useState, useMemo, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
  User,
  Hash,
  Inbox,
  Loader2,
  MessageSquare,
  Clock,
  Calendar,
  MapPin,
  Phone,
  Users,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Deed {
  id: string;
  serial_no: string;
  deed_no: string;
  deed_date: string;
  donor_name: string;
  donor_father_name: string;
  recipient_name: string;
  recipient_father_name: string;
  mouza_name: string;
  deed_type: string;
  deed_value: number;
  mobile: string;
  remarks: string;
  pdf_url: string | null;
  status: string;
  created_at: string;
}

const ITEMS_PER_PAGE = 8;

export default function PendingDeedsPage() {
  const locale = useLocale();
  const isBn = locale === 'bn';

  const [loading, setLoading] = useState(true);
  const [deeds, setDeeds] = useState<Deed[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewDeed, setViewDeed] = useState<Deed | null>(null);

  // 🎯 Load pending deeds from Supabase
  useEffect(() => {
    let cancelled = false;

    async function loadDeeds() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('deeds')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        if (!error && data && !cancelled) {
          setDeeds(data as Deed[]);
        }
      } catch (err) {
        console.error('Load pending deeds error:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDeeds();

    return () => {
      cancelled = true;
    };
  }, []);

  const content = {
    pageTitle_bn: 'অপেক্ষমাণ দলিল',
    pageTitle_en: 'Pending Deeds',
    search_bn: 'খুঁজুন...',
    search_en: 'Search...',
    noData_bn: 'কোনো অপেক্ষমাণ দলিল নেই',
    noData_en: 'No pending deeds found',
    serial_bn: 'ক্রমিক নং',
    serial_en: 'SL',
    deedNo_bn: 'দলিল নং',
    deedNo_en: 'Deed No',
    donor_bn: 'দাতার নাম',
    donor_en: 'Donor Name',
    recipient_bn: 'গ্রহীতার নাম',
    recipient_en: 'Recipient Name',
    value_bn: 'মূল্য',
    value_en: 'Value',
    status_bn: 'স্টেটাস',
    status_en: 'Status',
    actions_bn: 'অ্যাকশন',
    actions_en: 'Actions',
    view_bn: 'দেখুন',
    view_en: 'View',
    prev_bn: 'পূর্ববর্তী',
    prev_en: 'Prev',
    next_bn: 'পরবর্তী',
    next_en: 'Next',
    pendingStatus_bn: 'অপেক্ষমাণ',
    pendingStatus_en: 'Pending',
    viewTitle_bn: 'দলিলের বিস্তারিত',
    viewTitle_en: 'Deed Details',
    dateLabel_bn: 'তারিখ',
    dateLabel_en: 'Date',
    donorFather_bn: 'দাতার পিতার নাম',
    donorFather_en: "Donor's Father Name",
    recipientFather_bn: 'গ্রহীতার পিতার নাম',
    recipientFather_en: "Recipient's Father Name",
    mouza_bn: 'মৌজার নাম',
    mouza_en: 'Mouza Name',
    deedType_bn: 'দলিলের রকম',
    deedType_en: 'Deed Type',
    valueLabel_bn: 'মূল্য',
    valueLabel_en: 'Value',
    mobileLabel_bn: 'মোবাইল নম্বর',
    mobileLabel_en: 'Mobile Number',
    remarks_bn: 'মন্তব্য',
    remarks_en: 'Remarks',
    pdfLabel_bn: 'PDF ফাইল',
    pdfLabel_en: 'PDF File',
    loading_bn: 'লোড হচ্ছে...',
    loading_en: 'Loading...',
  };

  const t = (key: string) =>
    isBn ? (content as any)[`${key}_bn`] : (content as any)[`${key}_en`];

  const filteredDeeds = useMemo(() => {
    return deeds.filter((deed) => {
      const searchLower = search.toLowerCase();
      return (
        !search ||
        deed.deed_no?.toLowerCase().includes(searchLower) ||
        deed.donor_name?.toLowerCase().includes(searchLower) ||
        deed.recipient_name?.toLowerCase().includes(searchLower) ||
        deed.mouza_name?.toLowerCase().includes(searchLower) ||
        deed.mobile?.includes(search)
      );
    });
  }, [deeds, search]);

  const totalPages = Math.ceil(filteredDeeds.length / ITEMS_PER_PAGE);
  const paginatedDeeds = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDeeds.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredDeeds, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString(isBn ? 'bn-BD' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatValue = (value: number) => {
    if (!value) return '৳ 0';
    return `৳ ${value.toLocaleString(isBn ? 'bn-BD' : 'en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={40}
            className="animate-spin text-[#1F7A3F] mx-auto mb-4"
          />
          <p className="text-sm text-[#6B7280] text-bangla-safe">
            {t('loading')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-4 sm:mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
            <FileText size={20} className="text-orange-500" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-[#1F2937] text-bangla-heading pt-1 pb-0.5 leading-tight">
              {t('pageTitle')}
            </h1>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-3 sm:p-4 mb-4">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('search')}
            className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-[#E5E7EB] bg-[#F8FAF9] text-sm text-[#1F2937] placeholder-[#9CA3AF] text-bangla-safe focus:outline-none focus:ring-2 focus:border-[#1F7A3F] focus:ring-[#1F7A3F]/20 focus:bg-white transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1F7A3F] transition-colors p-1"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {filteredDeeds.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-8 sm:p-12 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#F8FAF9] flex items-center justify-center mb-4">
            <Inbox size={28} className="text-[#9CA3AF]" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[#1F2937] text-bangla-heading pt-1 pb-1 mb-1">
            {t('noData')}
          </h3>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F8FAF9] border-b border-[#E5E7EB]">
                    <th className="px-4 py-3 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                      {t('serial')}
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                      {t('deedNo')}
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                      {t('donor')}
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                      {t('recipient')}
                    </th>
                    <th className="px-4 py-3 text-right text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                      {t('value')}
                    </th>
                    <th className="px-4 py-3 text-center text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                      {t('status')}
                    </th>
                    <th className="px-4 py-3 text-center text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                      {t('actions')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedDeeds.map((deed, idx) => (
                    <motion.tr
                      key={deed.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.03 }}
                      className="border-b border-[#F3F4F6] last:border-0 hover:bg-[#1F7A3F]/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="text-xs font-bold text-[#1F7A3F]">
                          {deed.serial_no}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-[#1F2937]">
                          {deed.deed_no}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-[#1F2937] text-bangla-safe">
                          {deed.donor_name}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-[#1F2937] text-bangla-safe">
                          {deed.recipient_name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-xs font-bold text-[#1F7A3F]">
                          {formatValue(deed.deed_value)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wider">
                          <Clock size={10} />
                          {t('pendingStatus')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => setViewDeed(deed)}
                            className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors"
                            title={t('view')}
                          >
                            <Eye size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-3">
            {paginatedDeeds.map((deed, idx) => (
              <motion.div
                key={deed.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
                className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wider">
                    <FileText size={10} />#{deed.serial_no}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wider">
                    <Clock size={10} />
                    {t('pendingStatus')}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#F3F4F6]">
                  <div className="flex items-center gap-2">
                    <Hash size={14} className="text-[#1F7A3F]" />
                    <span className="text-sm font-bold text-[#1F2937]">
                      {deed.deed_no}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-[#1F7A3F]">
                    {formatValue(deed.deed_value)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 mb-3">
                  <div className="flex items-start gap-2">
                    <User
                      size={14}
                      className="text-[#1F7A3F] mt-0.5 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold mb-0.5">
                        {t('donor')}
                      </p>
                      <p className="text-xs text-[#1F2937] text-bangla-safe break-words">
                        {deed.donor_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <User
                      size={14}
                      className="text-[#1F7A3F] mt-0.5 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold mb-0.5">
                        {t('recipient')}
                      </p>
                      <p className="text-xs text-[#1F2937] text-bangla-safe break-words">
                        {deed.recipient_name}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F3F4F6]">
                  <button
                    onClick={() => setViewDeed(deed)}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors text-bangla-safe"
                  >
                    <Eye size={12} />
                    {t('view')}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#E5E7EB]">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#4B5563] bg-white border border-[#E5E7EB] hover:bg-[#F8FAF9] disabled:opacity-40 disabled:cursor-not-allowed transition-all text-bangla-safe"
              >
                <ChevronLeft size={14} />
                <span className="hidden sm:inline">{t('prev')}</span>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                        currentPage === page
                          ? 'bg-[#1F7A3F] text-white shadow-sm'
                          : 'text-[#4B5563] hover:bg-[#F8FAF9]'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#4B5563] bg-white border border-[#E5E7EB] hover:bg-[#F8FAF9] disabled:opacity-40 disabled:cursor-not-allowed transition-all text-bangla-safe"
              >
                <span className="hidden sm:inline">{t('next')}</span>
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </>
      )}

      {/* View Modal */}
      <AnimatePresence>
        {viewDeed && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewDeed(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            />

            <div className="fixed inset-0 z-[101] flex items-center justify-center p-3 sm:p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.25 }}
                className="pointer-events-auto w-full max-w-3xl max-h-[92vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
              >
                <div className="bg-white border-b border-[#E5E7EB] px-4 sm:px-5 py-3.5 flex-shrink-0">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#1F7A3F]/10 flex items-center justify-center flex-shrink-0">
                        <FileText size={18} className="text-[#1F7A3F]" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm sm:text-base font-bold text-[#1F2937] text-bangla-heading truncate">
                          {t('viewTitle')}
                        </h3>
                        <p className="text-[10px] sm:text-[11px] text-[#6B7280] truncate">
                          {t('serial')}: {viewDeed.serial_no} • {t('deedNo')}:{' '}
                          {viewDeed.deed_no}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setViewDeed(null)}
                      className="w-9 h-9 rounded-lg bg-[#F8FAF9] hover:bg-[#E5E7EB] flex items-center justify-center text-[#4B5563] transition-colors flex-shrink-0"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                <div className="p-4 sm:p-5 overflow-y-auto flex-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <DetailRow
                      icon={Hash}
                      label={t('serial')}
                      value={viewDeed.serial_no}
                    />
                    <DetailRow
                      icon={FileText}
                      label={t('deedNo')}
                      value={viewDeed.deed_no}
                    />
                    <DetailRow
                      icon={Calendar}
                      label={t('dateLabel')}
                      value={formatDate(viewDeed.deed_date)}
                    />
                    <DetailRow
                      icon={FileText}
                      label={t('deedType')}
                      value={viewDeed.deed_type}
                    />
                    <DetailRow
                      icon={User}
                      label={t('donor')}
                      value={viewDeed.donor_name}
                    />
                    <DetailRow
                      icon={Users}
                      label={t('donorFather')}
                      value={viewDeed.donor_father_name || '—'}
                    />
                    <DetailRow
                      icon={User}
                      label={t('recipient')}
                      value={viewDeed.recipient_name}
                    />
                    <DetailRow
                      icon={Users}
                      label={t('recipientFather')}
                      value={viewDeed.recipient_father_name || '—'}
                    />
                    <DetailRow
                      icon={MapPin}
                      label={t('mouza')}
                      value={viewDeed.mouza_name}
                    />
                    <DetailRow
                      icon={FileText}
                      label={t('valueLabel')}
                      value={formatValue(viewDeed.deed_value)}
                    />
                    <DetailRow
                      icon={Phone}
                      label={t('mobileLabel')}
                      value={viewDeed.mobile || '—'}
                    />
                    <DetailRow
                      icon={FileText}
                      label={t('pdfLabel')}
                      value={viewDeed.pdf_url ? 'Available' : 'N/A'}
                    />
                  </div>

                  <div className="mt-2.5 flex items-center gap-2.5 p-3 rounded-xl bg-orange-50 border border-orange-200">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                      <Clock size={14} className="text-orange-600" />
                    </div>
                    <div className="min-w-0 flex-1 flex items-center justify-between gap-2">
                      <p className="text-[10px] uppercase tracking-wider text-orange-700 font-bold">
                        {t('status')}
                      </p>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider">
                        <Clock size={10} />
                        {t('pendingStatus')}
                      </span>
                    </div>
                  </div>

                  {viewDeed.remarks && (
                    <div className="mt-2.5 flex items-start gap-2.5 p-3 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB]">
                      <div className="w-8 h-8 rounded-lg bg-[#1F7A3F]/10 flex items-center justify-center flex-shrink-0">
                        <MessageSquare size={14} className="text-[#1F7A3F]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase tracking-wider text-[#6B7280] font-bold mb-0.5">
                          {t('remarks')}
                        </p>
                        <p className="text-sm text-[#1F2937] text-bangla-safe break-words">
                          {viewDeed.remarks}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB]">
      <div className="w-8 h-8 rounded-lg bg-[#1F7A3F]/10 flex items-center justify-center flex-shrink-0">
        <Icon size={14} className="text-[#1F7A3F]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-wider text-[#6B7280] font-bold mb-0.5">
          {label}
        </p>
        <p className="text-sm text-[#1F2937] text-bangla-safe break-words">
          {value}
        </p>
      </div>
    </div>
  );
}
