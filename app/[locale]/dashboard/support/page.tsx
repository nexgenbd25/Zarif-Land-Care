'use client';

export const dynamic = 'force-dynamic';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Ticket,
  Inbox,
  Loader2,
  MessageSquare,
  Calendar,
  Paperclip,
  Send,
  CheckCircle2,
  CircleDot,
  Clock,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Attachment {
  id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
}

interface TicketType {
  id: string;
  ticket_no: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'answered' | 'closed';
  created_at: string;
  ticket_attachments?: Attachment[];
}

const ITEMS_PER_PAGE = 6;

export default function SupportPage() {
  const locale = useLocale();
  const isBn = locale === 'bn';
  const prefix = isBn ? '' : `/${locale}`;

  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewTicket, setViewTicket] = useState<TicketType | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTickets() {
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
          .from('support_tickets')
          .select(`
            id,
            ticket_no,
            subject,
            message,
            priority,
            status,
            created_at,
            ticket_attachments (
              id,
              file_name,
              file_url,
              file_size,
              file_type
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!error && data && !cancelled) {
          setTickets(data as TicketType[]);
        }
      } catch (err) {
        console.error('Load tickets error:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTickets();

    return () => {
      cancelled = true;
    };
  }, []);

  const content = {
    pageTitle_bn: 'সাপোর্ট টিকেট',
    pageTitle_en: 'Support Tickets',
    newTicket_bn: 'নতুন টিকেট',
    newTicket_en: 'New Ticket',
    search_bn: 'খুঁজুন...',
    search_en: 'Search...',
    all_bn: 'সব',
    all_en: 'All',
    pending_bn: 'অপেক্ষমাণ',
    pending_en: 'Pending',
    answered_bn: 'উত্তর দেওয়া',
    answered_en: 'Answered',
    closed_bn: 'বন্ধ',
    closed_en: 'Closed',
    low_bn: 'কম',
    low_en: 'Low',
    medium_bn: 'মাঝারি',
    medium_en: 'Medium',
    high_bn: 'জরুরি',
    high_en: 'High',
    noData_bn: 'কোনো টিকেট নেই',
    noData_en: 'No tickets found',
    noDataSub_bn: 'নতুন টিকেট খুলতে উপরে ক্লিক করুন',
    noDataSub_en: 'Click above to open a new ticket',
    view_bn: 'বিস্তারিত',
    view_en: 'View',
    prev_bn: 'পূর্ববর্তী',
    prev_en: 'Prev',
    next_bn: 'পরবর্তী',
    next_en: 'Next',
    loading_bn: 'লোড হচ্ছে...',
    loading_en: 'Loading...',
    attachments_bn: 'সংযুক্তি',
    attachments_en: 'Attachments',
    details_bn: 'টিকেটের বিস্তারিত',
    details_en: 'Ticket Details',
    message_bn: 'বার্তা',
    message_en: 'Message',
    priorityLabel_bn: 'প্রাথমিকতা',
    priorityLabel_en: 'Priority',
    statusLabel_bn: 'স্টেটাস',
    statusLabel_en: 'Status',
    dateLabel_bn: 'তারিখ',
    dateLabel_en: 'Date',
    subjectLabel_bn: 'বিষয়',
    subjectLabel_en: 'Subject',
  };

  const t = (key: string) =>
    isBn ? (content as any)[`${key}_bn`] : (content as any)[`${key}_en`];

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesFilter =
        activeFilter === 'all' || ticket.status === activeFilter;

      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        ticket.subject?.toLowerCase().includes(searchLower) ||
        ticket.ticket_no?.toLowerCase().includes(searchLower) ||
        ticket.message?.toLowerCase().includes(searchLower);

      return matchesFilter && matchesSearch;
    });
  }, [tickets, search, activeFilter]);

  const totalPages = Math.ceil(filteredTickets.length / ITEMS_PER_PAGE);
  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTickets.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTickets, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeFilter]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString(isBn ? 'bn-BD' : 'en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          label: t('high'),
          color: 'text-red-600',
          bg: 'bg-red-100',
          dot: 'bg-red-500',
        };
      case 'medium':
        return {
          label: t('medium'),
          color: 'text-orange-600',
          bg: 'bg-orange-100',
          dot: 'bg-orange-500',
        };
      case 'low':
        return {
          label: t('low'),
          color: 'text-blue-600',
          bg: 'bg-blue-100',
          dot: 'bg-blue-500',
        };
      default:
        return {
          label: priority,
          color: 'text-gray-600',
          bg: 'bg-gray-100',
          dot: 'bg-gray-500',
        };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          label: t('pending'),
          color: 'text-orange-700',
          bg: 'bg-orange-100',
          icon: Clock,
        };
      case 'answered':
        return {
          label: t('answered'),
          color: 'text-blue-700',
          bg: 'bg-blue-100',
          icon: CheckCircle2,
        };
      case 'closed':
        return {
          label: t('closed'),
          color: 'text-gray-700',
          bg: 'bg-gray-200',
          icon: CheckCircle2,
        };
      default:
        return {
          label: status,
          color: 'text-gray-700',
          bg: 'bg-gray-100',
          icon: CircleDot,
        };
    }
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-5">
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

        <Link
          href={`${prefix}/dashboard/support/new`}
          className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg font-bold text-white text-xs sm:text-sm bg-[#1F7A3F] hover:bg-[#155E30] shadow-md shadow-[#1F7A3F]/20 hover:shadow-lg transition-all duration-300 active:scale-[0.98]"
        >
          <Plus size={16} />
          <span className="text-bangla-safe">{t('newTicket')}</span>
        </Link>
      </div>

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
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { key: 'all', label: t('all') },
            { key: 'pending', label: t('pending') },
            { key: 'answered', label: t('answered') },
            { key: 'closed', label: t('closed') },
          ].map((filter) => {
            const isActive = activeFilter === filter.key;
            return (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-all duration-200 text-bangla-safe ${
                  isActive
                    ? 'bg-[#1F7A3F] text-white shadow-sm'
                    : 'bg-[#F8FAF9] text-[#4B5563] border border-[#E5E7EB] hover:border-[#1F7A3F]/30 hover:text-[#1F7A3F]'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {filteredTickets.length === 0 ? (
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
          <div className="space-y-3">
            {paginatedTickets.map((ticket, idx) => {
              const priority = getPriorityConfig(ticket.priority);
              const status = getStatusConfig(ticket.status);
              const StatusIcon = status.icon;
              const attachmentsCount = ticket.ticket_attachments?.length || 0;

              return (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm hover:shadow-md hover:border-[#1F7A3F]/30 transition-all duration-300"
                >
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#1F7A3F]/10 text-[#1F7A3F] text-[11px] font-bold">
                          {ticket.ticket_no}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.bg} ${status.color}`}
                        >
                          <StatusIcon size={10} />
                          {status.label}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${priority.bg} ${priority.color}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${priority.dot}`}
                          />
                          {priority.label}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#1F2937] text-bangla-safe mb-2 leading-tight">
                      {ticket.subject}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#6B7280] text-bangla-safe line-clamp-2 mb-3">
                      {ticket.message}
                    </p>

                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#F3F4F6]">
                      <div className="flex items-center gap-3 text-[11px] text-[#6B7280]">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(ticket.created_at)}
                        </span>
                        {attachmentsCount > 0 && (
                          <span className="flex items-center gap-1">
                            <Paperclip size={12} />
                            {attachmentsCount}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => setViewTicket(ticket)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1F7A3F]/10 hover:bg-[#1F7A3F]/20 text-[#1F7A3F] text-xs font-semibold transition-all text-bangla-safe"
                      >
                        <Eye size={12} />
                        {t('view')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
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
        {viewTicket && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewTicket(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            />

            <div className="fixed inset-0 z-[101] flex items-center justify-center p-3 sm:p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.25 }}
                className="pointer-events-auto w-full max-w-2xl max-h-[92vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
              >
                <div className="bg-white border-b border-[#E5E7EB] px-4 sm:px-5 py-3.5 flex-shrink-0">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#1F7A3F]/10 flex items-center justify-center flex-shrink-0">
                        <Ticket size={18} className="text-[#1F7A3F]" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm sm:text-base font-bold text-[#1F2937] text-bangla-heading pt-0.5 pb-0.5 truncate">
                          {t('details')}
                        </h3>
                        <p className="text-[10px] sm:text-[11px] text-[#6B7280] truncate">
                          {viewTicket.ticket_no}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setViewTicket(null)}
                      className="w-9 h-9 rounded-lg bg-[#F8FAF9] hover:bg-[#E5E7EB] flex items-center justify-center text-[#4B5563] transition-colors flex-shrink-0"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                <div className="p-4 sm:p-5 space-y-3 overflow-y-auto flex-1">
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB]">
                    <div className="w-8 h-8 rounded-lg bg-[#1F7A3F]/10 flex items-center justify-center flex-shrink-0">
                      <MessageSquare size={14} className="text-[#1F7A3F]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase tracking-wider text-[#6B7280] font-bold mb-0.5">
                        {t('subjectLabel')}
                      </p>
                      <p className="text-sm font-bold text-[#1F2937] text-bangla-safe">
                        {viewTicket.subject}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB]">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          getPriorityConfig(viewTicket.priority).dot
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase tracking-wider text-[#6B7280] font-bold mb-0.5">
                          {t('priorityLabel')}
                        </p>
                        <p className="text-xs font-bold text-[#1F2937] text-bangla-safe">
                          {getPriorityConfig(viewTicket.priority).label}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB]">
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase tracking-wider text-[#6B7280] font-bold mb-0.5">
                          {t('statusLabel')}
                        </p>
                        <p
                          className={`text-xs font-bold text-bangla-safe ${
                            getStatusConfig(viewTicket.status).color
                          }`}
                        >
                          {getStatusConfig(viewTicket.status).label}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB]">
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase tracking-wider text-[#6B7280] font-bold mb-0.5">
                          {t('dateLabel')}
                        </p>
                        <p className="text-xs font-bold text-[#1F2937]">
                          {new Date(viewTicket.created_at).toLocaleDateString(
                            isBn ? 'bn-BD' : 'en-US'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB]">
                    <div className="w-8 h-8 rounded-lg bg-[#1F7A3F]/10 flex items-center justify-center flex-shrink-0">
                      <Send size={14} className="text-[#1F7A3F]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase tracking-wider text-[#6B7280] font-bold mb-1">
                        {t('message')}
                      </p>
                      <p className="text-sm text-[#1F2937] text-bangla-safe break-words whitespace-pre-wrap">
                        {viewTicket.message}
                      </p>
                    </div>
                  </div>

                  {viewTicket.ticket_attachments &&
                    viewTicket.ticket_attachments.length > 0 && (
                      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F8FAF9] border border-[#E5E7EB]">
                        <div className="w-8 h-8 rounded-lg bg-[#1F7A3F]/10 flex items-center justify-center flex-shrink-0">
                          <Paperclip size={14} className="text-[#1F7A3F]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] uppercase tracking-wider text-[#6B7280] font-bold mb-1">
                            {t('attachments')}
                          </p>
                          <ul className="space-y-1">
                            {viewTicket.ticket_attachments.map((file) => (
                              <li key={file.id}>
                                <a
                                  href={file.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-[#1F7A3F] hover:underline text-bangla-safe break-all inline-flex items-center gap-1"
                                >
                                  <Paperclip size={10} />
                                  {file.file_name}
                                </a>
                              </li>
                            ))}
                          </ul>
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
