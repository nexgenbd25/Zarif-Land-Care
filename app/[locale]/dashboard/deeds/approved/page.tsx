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
  MapPin,
  Calendar,
  Phone,
  Hash,
  Filter,
  Inbox,
  Loader2,
  MessageSquare,
  CheckCircle2,
  Download,
} from 'lucide-react';
import { getDemoUser, clearDemoUser, DemoUser } from '@/lib/auth';
import DashboardLayout from '../../DashboardLayout';

interface Deed {
  id: number;
  serialNo: string;
  deedNo: string;
  date: string;
  donorName: string;
  donorFatherName: string;
  recipientName: string;
  recipientFatherName: string;
  mouzaName: string;
  deedType: string;
  value: number;
  mobile: string;
  remarks: string;
  pdfUrl?: string;
}

const APPROVED_DEEDS: Deed[] = [
  {
    id: 1,
    serialNo: '01',
    deedNo: '1101/2024',
    date: '2024-01-10',
    donorName: 'মোঃ আব্দুল কাদির',
    donorFatherName: 'মোঃ আব্দুল মজিদ',
    recipientName: 'মোঃ রফিকুল ইসলাম',
    recipientFatherName: 'মোঃ নুরুল ইসলাম',
    mouzaName: 'বড়াইল',
    deedType: 'বিক্রয় দলিল',
    value: 750000,
    mobile: '01788766735',
    remarks: 'সফলভাবে সম্পন্ন',
    pdfUrl: '#',
  },
  {
    id: 2,
    serialNo: '02',
    deedNo: '1102/2024',
    date: '2024-02-15',
    donorName: 'মোঃ সাইফুল ইসলাম',
    donorFatherName: 'মোঃ রুহুল আমিন',
    recipientName: 'মোঃ মামুন',
    recipientFatherName: 'মোঃ শফিকুল ইসলাম',
    mouzaName: 'হাসাইল',
    deedType: 'দানপত্র',
    value: 450000,
    mobile: '01829784457',
    remarks: '',
    pdfUrl: '#',
  },
  {
    id: 3,
    serialNo: '03',
    deedNo: '1103/2024',
    date: '2024-03-20',
    donorName: 'মোঃ শাহাদাত হোসেন',
    donorFatherName: 'মোঃ আনোয়ার হোসেন',
    recipientName: 'মোঃ ইব্রাহিম',
    recipientFatherName: 'মোঃ হাসান আলী',
    mouzaName: 'টঙ্গীবাড়ি',
    deedType: 'হেবা দলিল',
    value: 1200000,
    mobile: '01531568468',
    remarks: 'পরিবারিক দলিল',
    pdfUrl: '#',
  },
  {
    id: 4,
    serialNo: '04',
    deedNo: '1104/2024',
    date: '2024-04-05',
    donorName: 'মোঃ ইসমাইল হোসেন',
    donorFatherName: 'মোঃ ইদ্রিস হোসেন',
    recipientName: 'মোঃ সবুজ হোসেন',
    recipientFatherName: 'মোঃ কামাল হোসেন',
    mouzaName: 'কামারখাড়া',
    deedType: 'বাটোয়ারা দলিল',
    value: 1800000,
    mobile: '01712345678',
    remarks: '',
    pdfUrl: '#',
  },
  {
    id: 5,
    serialNo: '05',
    deedNo: '1105/2024',
    date: '2024-05-18',
    donorName: 'মোঃ মোস্তফা আলী',
    donorFatherName: 'মোঃ হাসেম আলী',
    recipientName: 'মোঃ সাইফুল ইসলাম',
    recipientFatherName: 'মোঃ রুহুল আমিন',
    mouzaName: 'পাঁচগাঁও',
    deedType: 'বিক্রয় দলিল',
    value: 900000,
    mobile: '01788766735',
    remarks: 'জমি বিক্রয় সম্পন্ন',
    pdfUrl: '#',
  },
  {
    id: 6,
    serialNo: '06',
    deedNo: '1106/2024',
    date: '2024-06-22',
    donorName: 'মোঃ মজিবর রহমান',
    donorFatherName: 'মোঃ আব্দুল জলিল',
    recipientName: 'মোঃ মামুন',
    recipientFatherName: 'মোঃ শফিকুল ইসলাম',
    mouzaName: 'শিমুলিয়া',
    deedType: 'দানপত্র',
    value: 550000,
    mobile: '01627890841',
    remarks: '',
    pdfUrl: '#',
  },
  {
    id: 7,
    serialNo: '07',
    deedNo: '1107/2024',
    date: '2024-07-14',
    donorName: 'মোঃ জামাল হোসেন',
    donorFatherName: 'মোঃ ইসমাইল হোসেন',
    recipientName: 'মোঃ সবুজ হোসেন',
    recipientFatherName: 'মোঃ কামাল হোসেন',
    mouzaName: 'বানারী',
    deedType: 'বিনিময় দলিল',
    value: 700000,
    mobile: '01829784457',
    remarks: 'বিনিময় সম্পন্ন',
    pdfUrl: '#',
  },
  {
    id: 8,
    serialNo: '08',
    deedNo: '1108/2024',
    date: '2024-08-30',
    donorName: 'মোঃ কামাল হোসেন',
    donorFatherName: 'মোঃ জামাল হোসেন',
    recipientName: 'মোঃ ফরহাদ',
    recipientFatherName: 'মোঃ মোস্তাফিজুর রহমান',
    mouzaName: 'রহিমগঞ্জ',
    deedType: 'বিক্রয় দলিল',
    value: 1100000,
    mobile: '01302555723',
    remarks: 'সফলভাবে সম্পন্ন',
    pdfUrl: '#',
  },
];

const ITEMS_PER_PAGE = 8;

export default function ApprovedDeedsPage() {
  const locale = useLocale();
  const router = useRouter();
  const isBn = locale === 'bn';

  const [user, setUser] = useState<DemoUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewDeed, setViewDeed] = useState<Deed | null>(null);

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
    pageTitle_bn: 'অনুমোদিত দলিল',
    pageTitle_en: 'Approved Deeds',
    pageSub_bn: 'আপনার অনুমোদিত দলিলের তালিকা',
    pageSub_en: 'List of your approved deeds',
    search_bn: 'খুঁজুন (দলিল নং, দাতা, গ্রহীতা, মৌজা)',
    search_en: 'Search (deed no, donor, recipient, mouza)',
    all_bn: 'সব',
    all_en: 'All',
    total_bn: 'মোট',
    total_en: 'Total',
    showing_bn: 'দেখানো হচ্ছে',
    showing_en: 'Showing',
    noData_bn: 'কোনো অনুমোদিত দলিল নেই',
    noData_en: 'No approved deeds found',
    noDataSub_bn: 'অনুমোদিত দলিল এখানে দেখা যাবে',
    noDataSub_en: 'Approved deeds will appear here',
    serial_bn: 'ক্রমিক',
    serial_en: 'SL',
    deedNo_bn: 'দলিল নং',
    deedNo_en: 'Deed No',
    date_bn: 'তারিখ',
    date_en: 'Date',
    donor_bn: 'দাতা',
    donor_en: 'Donor',
    recipient_bn: 'গ্রহীতা',
    recipient_en: 'Recipient',
    mouza_bn: 'মৌজা',
    mouza_en: 'Mouza',
    value_bn: 'মূল্য',
    value_en: 'Value',
    actions_bn: 'অ্যাকশন',
    actions_en: 'Actions',
    view_bn: 'দেখুন',
    view_en: 'View',
    download_bn: 'ডাউনলোড',
    download_en: 'Download',
    prev_bn: 'পূর্ববর্তী',
    prev_en: 'Prev',
    next_bn: 'পরবর্তী',
    next_en: 'Next',
    viewTitle_bn: 'দলিলের বিস্তারিত',
    viewTitle_en: 'Deed Details',
    donorFather_bn: 'দাতার পিতা',
    donorFather_en: "Donor's Father",
    recipientFather_bn: 'গ্রহীতার পিতা',
    recipientFather_en: "Recipient's Father",
    deedType_bn: 'দলিলের রকম',
    deedType_en: 'Deed Type',
    mobile_bn: 'মোবাইল',
    mobile_en: 'Mobile',
    remarks_bn: 'মন্তব্য',
    remarks_en: 'Remarks',
    close_bn: 'বন্ধ করুন',
    close_en: 'Close',
    loading_bn: 'লোড হচ্ছে...',
    loading_en: 'Loading...',
    filterBy_bn: 'দলিলের রকম',
    filterBy_en: 'Filter by Type',
    status_bn: 'অনুমোদিত',
    status_en: 'Approved',
  };

  const t = (key: string) =>
    isBn ? (content as any)[`${key}_bn`] : (content as any)[`${key}_en`];

  const filteredDeeds = useMemo(() => {
    return APPROVED_DEEDS.filter((deed) => {
      const matchesFilter =
        activeFilter === 'all' || deed.deedType === activeFilter;

      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        deed.deedNo.toLowerCase().includes(searchLower) ||
        deed.donorName.toLowerCase().includes(searchLower) ||
        deed.recipientName.toLowerCase().includes(searchLower) ||
        deed.mouzaName.toLowerCase().includes(searchLower) ||
        deed.mobile.includes(search);

      return matchesFilter && matchesSearch;
    });
  }, [search, activeFilter]);

  const totalPages = Math.ceil(filteredDeeds.length / ITEMS_PER_PAGE);
  const paginatedDeeds = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDeeds.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredDeeds, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeFilter]);

  const availableTypes = useMemo(() => {
    const types = new Set(APPROVED_DEEDS.map((d) => d.deedType));
    return ['all', ...Array.from(types)];
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(isBn ? 'bn-BD' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatValue = (value: number) => {
    return `৳ ${value.toLocaleString(isBn ? 'bn-BD' : 'en-US')}`;
  };

  const getFilterLabel = (type: string) => {
    if (type === 'all') return t('all');
    return type;
  };

  const handleDownload = (deed: Deed) => {
    // TODO: API call
    alert(
      isBn
        ? `দলিল ${deed.deedNo} ডাউনলোড হচ্ছে...`
        : `Downloading deed ${deed.deedNo}...`
    );
  };

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
        {/* Header */}
        <div className="mb-5 sm:mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#1F7A3F]/10 border border-[#1F7A3F]/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 size={20} className="text-[#1F7A3F]" />
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

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs font-semibold text-[#6B7280] uppercase tracking-wider text-bangla-safe mb-1">
              {t('total')}
            </p>
            <p className="text-xl sm:text-2xl font-bold text-[#1F2937] leading-tight">
              {APPROVED_DEEDS.length}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs font-semibold text-[#6B7280] uppercase tracking-wider text-bangla-safe mb-1">
              {t('showing')}
            </p>
            <p className="text-xl sm:text-2xl font-bold text-[#1F7A3F] leading-tight">
              {filteredDeeds.length}
            </p>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-3 sm:p-4 mb-4">
          <div className="relative mb-3">
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

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <div className="flex items-center gap-1 text-[#6B7280] pr-2 flex-shrink-0">
              <Filter size={14} />
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-bangla-safe">
                {t('filterBy')}
              </span>
            </div>
            {availableTypes.map((type) => {
              const isActive = activeFilter === type;
              const label = getFilterLabel(type);
              return (
                <button
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-all duration-200 text-bangla-safe ${
                    isActive
                      ? 'bg-[#1F7A3F] text-white shadow-sm'
                      : 'bg-[#F8FAF9] text-[#4B5563] border border-[#E5E7EB] hover:border-[#1F7A3F]/30 hover:text-[#1F7A3F]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
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
            <p className="text-xs sm:text-sm text-[#6B7280] text-bangla-safe">
              {t('noDataSub')}
            </p>
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
                        {t('date')}
                      </th>
                      <th className="px-4 py-3 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                        {t('donor')}
                      </th>
                      <th className="px-4 py-3 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                        {t('recipient')}
                      </th>
                      <th className="px-4 py-3 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                        {t('mouza')}
                      </th>
                      <th className="px-4 py-3 text-right text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                        {t('value')}
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
                            {deed.serialNo}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-semibold text-[#1F2937]">
                            {deed.deedNo}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-[#4B5563]">
                            {formatDate(deed.date)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-[#1F2937] text-bangla-safe">
                            {deed.donorName}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-[#1F2937] text-bangla-safe">
                            {deed.recipientName}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-[#4B5563] text-bangla-safe">
                            {deed.mouzaName}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-xs font-bold text-[#1F7A3F]">
                            {formatValue(deed.value)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setViewDeed(deed)}
                              className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors"
                              title={t('view')}
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => handleDownload(deed)}
                              className="w-8 h-8 rounded-lg bg-[#1F7A3F]/10 hover:bg-[#1F7A3F]/20 text-[#1F7A3F] flex items-center justify-center transition-colors"
                              title={t('download')}
                            >
                              <Download size={14} />
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
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider">
                      <CheckCircle2 size={10} />#{deed.serialNo}
                    </span>
                    <span className="text-sm font-bold text-[#1F7A3F]">
                      {formatValue(deed.value)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#F3F4F6]">
                    <div className="flex items-center gap-2">
                      <Hash size={14} className="text-[#1F7A3F]" />
                      <span className="text-sm font-bold text-[#1F2937]">
                        {deed.deedNo}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#6B7280]">
                      <Calendar size={12} />
                      {formatDate(deed.date)}
                    </div>
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
                          {deed.donorName}
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
                          {deed.recipientName}
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
                          {deed.mouzaName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone
                        size={14}
                        className="text-[#1F7A3F] mt-0.5 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold mb-0.5">
                          {t('mobile')}
                        </p>
                        <p className="text-xs text-[#1F2937] break-words">
                          {deed.mobile}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3 flex items-center gap-2 flex-wrap">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-[#1F7A3F]/10 text-[#1F7A3F] text-[10px] font-bold text-bangla-safe">
                      {deed.deedType}
                    </span>
                    <span className="inline-block px-2 py-0.5 rounded-md bg-green-100 text-green-700 text-[10px] font-bold text-bangla-safe">
                      {t('status')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-[#F3F4F6]">
                    <button
                      onClick={() => setViewDeed(deed)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors text-bangla-safe"
                    >
                      <Eye size={12} />
                      {t('view')}
                    </button>
                    <button
                      onClick={() => handleDownload(deed)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#1F7A3F]/10 text-[#1F7A3F] text-xs font-semibold hover:bg-[#1F7A3F]/20 transition-colors text-bangla-safe"
                    >
                      <Download size={12} />
                      {t('download')}
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
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-x-3 top-1/2 -translate-y-1/2 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:max-w-2xl sm:w-full z-[101] max-h-[92vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
              >
                <div className="sticky top-0 bg-white border-b border-[#E5E7EB] px-4 sm:px-5 py-3.5 flex items-center justify-between z-10 rounded-t-2xl">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#1F7A3F]/10 flex items-center justify-center flex-shrink-0">
                      <FileText size={18} className="text-[#1F7A3F]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-[#1F2937] text-bangla-heading pt-0.5 pb-0.5 truncate">
                        {t('viewTitle')}
                      </h3>
                      <p className="text-[10px] sm:text-[11px] text-[#6B7280] truncate">
                        #{viewDeed.serialNo} • {viewDeed.deedNo}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setViewDeed(null)}
                    className="w-9 h-9 rounded-lg bg-[#F8FAF9] hover:bg-[#E5E7EB] flex items-center justify-center text-[#4B5563] transition-colors flex-shrink-0"
                    aria-label={t('close')}
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="p-4 sm:p-5 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <DetailRow
                      icon={Hash}
                      label={t('deedNo')}
                      value={viewDeed.deedNo}
                    />
                    <DetailRow
                      icon={Calendar}
                      label={t('date')}
                      value={formatDate(viewDeed.date)}
                    />
                    <DetailRow
                      icon={User}
                      label={t('donor')}
                      value={viewDeed.donorName}
                    />
                    <DetailRow
                      icon={User}
                      label={t('donorFather')}
                      value={viewDeed.donorFatherName || '—'}
                    />
                    <DetailRow
                      icon={User}
                      label={t('recipient')}
                      value={viewDeed.recipientName}
                    />
                    <DetailRow
                      icon={User}
                      label={t('recipientFather')}
                      value={viewDeed.recipientFatherName || '—'}
                    />
                    <DetailRow
                      icon={MapPin}
                      label={t('mouza')}
                      value={viewDeed.mouzaName}
                    />
                    <DetailRow
                      icon={FileText}
                      label={t('deedType')}
                      value={viewDeed.deedType}
                    />
                    <DetailRow
                      icon={Phone}
                      label={t('mobile')}
                      value={viewDeed.mobile}
                    />
                    <DetailRow
                      icon={FileText}
                      label={t('value')}
                      value={formatValue(viewDeed.value)}
                    />
                  </div>

                  {viewDeed.remarks && (
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB]">
                      <MessageSquare
                        size={16}
                        className="text-[#1F7A3F] flex-shrink-0 mt-0.5"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase tracking-wider text-[#6B7280] font-bold mb-1">
                          {t('remarks')}
                        </p>
                        <p className="text-sm text-[#1F2937] text-bangla-safe break-words">
                          {viewDeed.remarks}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col-reverse sm:flex-row gap-2 pt-3 border-t border-[#F3F4F6]">
                    <button
                      type="button"
                      onClick={() => setViewDeed(null)}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-lg font-semibold text-sm text-[#4B5563] bg-white border border-[#E5E7EB] hover:bg-[#F8FAF9] transition-all text-bangla-safe"
                    >
                      {t('close')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleDownload(viewDeed);
                        setViewDeed(null);
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-bold text-white text-sm bg-[#1F7A3F] hover:bg-[#155E30] shadow-md transition-all active:scale-[0.98]"
                    >
                      <Download size={16} />
                      <span className="text-bangla-safe">
                        {t('download')}
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

// ===== Detail Row Component =====
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
