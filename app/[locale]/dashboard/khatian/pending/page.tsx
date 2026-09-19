'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  MapPin,
  Map,
  Layers,
  Maximize2,
} from 'lucide-react';
import { getDemoUser, clearDemoUser, DemoUser } from '@/lib/auth';
import { useBodyScrollLock } from '@/lib/useBodyScrollLock';
import DashboardLayout from '../../DashboardLayout';

interface Khatian {
  id: number;
  serialNo: string;
  mouzaName: string;
  ownerName: string;
  khatianType: string;
  khatianNo: string;
  dagNo: string;
  landAmount: string;
  remarks: string;
  pdfUrl: string;
  date: string;
}

const PENDING_KHATIANS: Khatian[] = [
  {
    id: 1,
    serialNo: '101',
    mouzaName: 'ধিপুর',
    ownerName: 'বিল্লাল হোসেন মাদবর',
    khatianType: 'সরকারি খতিয়ান',
    khatianNo: '260',
    dagNo: '1250',
    landAmount: '২.৫০ একর',
    remarks: 'সম্পূর্ণ কাগজপত্র সহ',
    pdfUrl: 'N/A',
    date: '2020-01-21',
  },
  {
    id: 2,
    serialNo: '102',
    mouzaName: 'হাসাইল',
    ownerName: 'মোঃ সাব্বির শেখ',
    khatianType: 'বেসরকারি খতিয়ান',
    khatianNo: '261',
    dagNo: '1251',
    landAmount: '১.৭৫ একর',
    remarks: '',
    pdfUrl: 'N/A',
    date: '2020-02-20',
  },
  {
    id: 3,
    serialNo: '103',
    mouzaName: 'টঙ্গীবাড়ি',
    ownerName: 'আব্দুল করিম',
    khatianType: 'সরকারি খতিয়ান',
    khatianNo: '262',
    dagNo: '1252',
    landAmount: '৩.০০ একর',
    remarks: 'জরুরি',
    pdfUrl: 'N/A',
    date: '2020-03-10',
  },
  {
    id: 4,
    serialNo: '104',
    mouzaName: 'কামারখাড়া',
    ownerName: 'মোঃ আনোয়ার হোসেন',
    khatianType: 'বেসরকারি খতিয়ান',
    khatianNo: '263',
    dagNo: '1253',
    landAmount: '০.৭৫ একর',
    remarks: 'পারিবারিক খতিয়ান',
    pdfUrl: 'N/A',
    date: '2020-04-05',
  },
  {
    id: 5,
    serialNo: '105',
    mouzaName: 'পাঁচগাঁও',
    ownerName: 'মোঃ হাসান আলী',
    khatianType: 'সরকারি খতিয়ান',
    khatianNo: '264',
    dagNo: '1254',
    landAmount: '২.২৫ একর',
    remarks: '',
    pdfUrl: 'N/A',
    date: '2020-05-18',
  },
];

const ITEMS_PER_PAGE = 8;

export default function PendingKhatianPage() {
  const locale = useLocale();
  const router = useRouter();
  const isBn = locale === 'bn';

  const [user, setUser] = useState<DemoUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewKhatian, setViewKhatian] = useState<Khatian | null>(null);

  useBodyScrollLock(!!viewKhatian);

  useEffect(() => {
    const currentUser = getDemoUser();
    if (!currentUser) {
      router.push(`/${isBn ? '' : locale + '/'}login`);
      return;
    }
    setUser(currentUser);
    setAuthChecked(true);
  }, [router, isBn, locale]);

  const handleLogout = () => {
    clearDemoUser();
    router.push(`/${isBn ? '' : locale + '/'}login`);
  };

  const content = {
    pageTitle_bn: 'অপেক্ষমাণ খতিয়ান',
    pageTitle_en: 'Pending Khatian',
    search_bn: 'খুঁজুন...',
    search_en: 'Search...',
    noData_bn: 'কোনো অপেক্ষমাণ খতিয়ান নেই',
    noData_en: 'No pending khatian found',
    serial_bn: 'ক্রমিক নং',
    serial_en: 'SL',
    khatianNo_bn: 'খতিয়ান নং',
    khatianNo_en: 'Khatian No',
    owner_bn: 'মালিকের নাম',
    owner_en: 'Owner Name',
    mouza_bn: 'মৌজা',
    mouza_en: 'Mouza',
    dagNo_bn: 'দাগ নং',
    dagNo_en: 'Dag No',
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
    viewTitle_bn: 'খতিয়ানের বিস্তারিত',
    viewTitle_en: 'Khatian Details',
    khatianType_bn: 'খতিয়ানের ধরন',
    khatianType_en: 'Khatian Type',
    landAmount_bn: 'জমির পরিমাণ',
    landAmount_en: 'Land Amount',
    remarks_bn: 'মন্তব্য',
    remarks_en: 'Remarks',
    pdfLabel_bn: 'PDF ফাইল',
    pdfLabel_en: 'PDF File',
    loading_bn: 'লোড হচ্ছে...',
    loading_en: 'Loading...',
  };

  const t = (key: string) =>
    isBn ? (content as any)[`${key}_bn`] : (content as any)[`${key}_en`];

  const filteredKhatians = useMemo(() => {
    return PENDING_KHATIANS.filter((k) => {
      const searchLower = search.toLowerCase();
      return (
        !search ||
        k.khatianNo.toLowerCase().includes(searchLower) ||
        k.ownerName.toLowerCase().includes(searchLower) ||
        k.mouzaName.toLowerCase().includes(searchLower) ||
        k.dagNo.toLowerCase().includes(searchLower)
      );
    });
  }, [search]);

  const totalPages = Math.ceil(filteredKhatians.length / ITEMS_PER_PAGE);
  const paginatedKhatians = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredKhatians.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredKhatians, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  if (!authChecked || !user) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#F8FAF9]">
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
    <DashboardLayout user={user} onLogout={handleLogout}>
      <div className="w-full max-w-7xl mx-auto">
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
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {filteredKhatians.length === 0 ? (
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
            <div className="hidden lg:block bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#F8FAF9] border-b border-[#E5E7EB]">
                      <th className="px-4 py-3 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                        {t('serial')}
                      </th>
                      <th className="px-4 py-3 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                        {t('khatianNo')}
                      </th>
                      <th className="px-4 py-3 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                        {t('owner')}
                      </th>
                      <th className="px-4 py-3 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                        {t('mouza')}
                      </th>
                      <th className="px-4 py-3 text-center text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                        {t('dagNo')}
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
                    {paginatedKhatians.map((k, idx) => (
                      <motion.tr
                        key={k.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.03 }}
                        className="border-b border-[#F3F4F6] last:border-0 hover:bg-[#1F7A3F]/[0.02] transition-colors"
                      >
                        <td className="px-4 py-3">
                          <span className="text-xs font-bold text-[#1F7A3F]">
                            {k.serialNo}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-semibold text-[#1F2937]">
                            {k.khatianNo}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-[#1F2937] text-bangla-safe">
                            {k.ownerName}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-[#4B5563] text-bangla-safe">
                            {k.mouzaName}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-xs text-[#4B5563]">
                            {k.dagNo}
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
                              onClick={() => setViewKhatian(k)}
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

            <div className="lg:hidden space-y-3">
              {paginatedKhatians.map((k, idx) => (
                <motion.div
                  key={k.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wider">
                      <FileText size={10} />#{k.serialNo}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wider">
                      <Clock size={10} />
                      {t('pendingStatus')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#F3F4F6]">
                    <Hash size={14} className="text-[#1F7A3F]" />
                    <span className="text-sm font-bold text-[#1F2937]">
                      {k.khatianNo}
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
                          {t('owner')}
                        </p>
                        <p className="text-xs text-[#1F2937] text-bangla-safe break-words">
                          {k.ownerName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin
                        size={14}
                        className="text-[#1F7A3F] mt-0.5 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold mb-0.5">
                          {t('mouza')}
                        </p>
                        <p className="text-xs text-[#1F2937] text-bangla-safe break-words">
                          {k.mouzaName}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#F3F4F6]">
                    <button
                      onClick={() => setViewKhatian(k)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors text-bangla-safe"
                    >
                      <Eye size={12} />
                      {t('view')}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

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

        <AnimatePresence>
          {viewKhatian && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setViewKhatian(null)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
              />

              <div
                className="fixed inset-0 z-[101] flex items-center justify-center p-3 sm:p-4 pointer-events-none"
                style={{ overflowAnchor: 'none' }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.25 }}
                  className="pointer-events-auto w-full max-w-3xl max-h-[92vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                  style={{
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <div className="bg-white border-b border-[#E5E7EB] px-4 sm:px-5 py-3.5 flex-shrink-0">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-[#1F7A3F]/10 flex items-center justify-center flex-shrink-0">
                          <FileText size={18} className="text-[#1F7A3F]" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm sm:text-base font-bold text-[#1F2937] text-bangla-heading pt-0.5 pb-0.5 truncate">
                            {t('viewTitle')}
                          </h3>
                          <p className="text-[10px] sm:text-[11px] text-[#6B7280] truncate">
                            {t('serial')}: {viewKhatian.serialNo} •{' '}
                            {t('khatianNo')}: {viewKhatian.khatianNo}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setViewKhatian(null)}
                        className="w-9 h-9 rounded-lg bg-[#F8FAF9] hover:bg-[#E5E7EB] flex items-center justify-center text-[#4B5563] transition-colors flex-shrink-0"
                        aria-label="Close"
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
                        value={viewKhatian.serialNo}
                      />
                      <DetailRow
                        icon={FileText}
                        label={t('khatianNo')}
                        value={viewKhatian.khatianNo}
                      />
                      <DetailRow
                        icon={MapPin}
                        label={t('mouza')}
                        value={viewKhatian.mouzaName}
                      />
                      <DetailRow
                        icon={Layers}
                        label={t('khatianType')}
                        value={viewKhatian.khatianType}
                      />
                      <DetailRow
                        icon={User}
                        label={t('owner')}
                        value={viewKhatian.ownerName}
                      />
                      <DetailRow
                        icon={Map}
                        label={t('dagNo')}
                        value={viewKhatian.dagNo}
                      />
                      <DetailRow
                        icon={Maximize2}
                        label={t('landAmount')}
                        value={viewKhatian.landAmount}
                      />
                      <DetailRow
                        icon={FileText}
                        label={t('pdfLabel')}
                        value={viewKhatian.pdfUrl || 'N/A'}
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

                    {viewKhatian.remarks && (
                      <div className="mt-2.5 flex items-start gap-2.5 p-3 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB]">
                        <div className="w-8 h-8 rounded-lg bg-[#1F7A3F]/10 flex items-center justify-center flex-shrink-0">
                          <MessageSquare size={14} className="text-[#1F7A3F]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] uppercase tracking-wider text-[#6B7280] font-bold mb-0.5">
                            {t('remarks')}
                          </p>
                          <p className="text-sm text-[#1F2937] text-bangla-safe break-words">
                            {viewKhatian.remarks || '—'}
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
    </DashboardLayout>
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
