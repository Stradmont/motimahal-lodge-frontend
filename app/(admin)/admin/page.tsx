'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Image as ImageIcon,
  Bed,
  Video,
  ExternalLink,
  ArrowUpRight,
  Mail,
  Phone,
  CalendarCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminPageHeader from '@/components/admin/layout/AdminPageHeader';
import { AdminDataTable, AdminColumn } from '@/components/admin/common/AdminDataTable';
import { useRooms } from '@/hooks/useRooms';
import { useContacts } from '@/hooks/useContacts';
import { useGallery } from '@/hooks/useGallery';
import { useVideo } from '@/hooks/useVideo';
import { GeneralContactInquiry, GeneralContactStatus } from '@/lib/types/inquiry';

export default function AdminDashboardOverview() {
  const { rooms, isLoading: isLoadingRooms } = useRooms();
  const { submissions, isLoading: isLoadingContacts, refetch } = useContacts();
  const { sections, isLoading: isLoadingGallery } = useGallery();
  const { videos, isLoading: isLoadingVideos } = useVideo();

  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'in_progress'>('all');

  const newInquiriesCount = submissions.filter((s) => s.status === GeneralContactStatus.NEW).length;
  const inProgressCount = submissions.filter((s) => s.status === GeneralContactStatus.IN_PROGRESS).length;

  const filteredSubmissions = submissions.filter((item) => {
    if (activeTab === 'new') return item.status === GeneralContactStatus.NEW;
    if (activeTab === 'in_progress') return item.status === GeneralContactStatus.IN_PROGRESS;
    return true;
  });

  const metrics = [
    {
      title: 'Unread Inquiries',
      value: isLoadingContacts ? '...' : `${newInquiriesCount} New`,
      subtext: `${submissions.length} Total Received`,
      href: '/admin/contact',
      icon: MessageSquare,
      color: 'amber',
      bgClass: 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200/80 dark:border-amber-900/50',
      iconBgClass: 'bg-amber-500 text-white shadow-xs',
      valueClass: 'text-amber-700 dark:text-amber-400',
    },
    {
      title: 'Rooms & Rates',
      value: isLoadingRooms ? '...' : `${rooms.length} Categories`,
      subtext: `${rooms.reduce((acc, r) => acc + (r.totalUnits || 1), 0)} Total Units`,
      href: '/admin/rooms',
      icon: Bed,
      color: 'emerald',
      bgClass: 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-900/50',
      iconBgClass: 'bg-emerald-600 text-white shadow-xs',
      valueClass: 'text-emerald-700 dark:text-emerald-400',
    },
    {
      title: 'Gallery Showcase',
      value: isLoadingGallery ? '...' : `${sections.length} Collections`,
      subtext: 'Active Photo Media',
      href: '/admin/gallery',
      icon: ImageIcon,
      color: 'indigo',
      bgClass: 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-200/80 dark:border-indigo-900/50',
      iconBgClass: 'bg-indigo-600 text-white shadow-xs',
      valueClass: 'text-indigo-700 dark:text-indigo-400',
    },
    {
      title: 'Video Tours',
      value: isLoadingVideos ? '...' : `${videos.length} Videos`,
      subtext: 'Published Virtual Tours',
      href: '/admin/videos',
      icon: Video,
      color: 'purple',
      bgClass: 'bg-purple-50/70 dark:bg-purple-950/30 border-purple-200/80 dark:border-purple-900/50',
      iconBgClass: 'bg-purple-600 text-white shadow-xs',
      valueClass: 'text-purple-700 dark:text-purple-400',
    },
  ];

  const columns: AdminColumn<GeneralContactInquiry>[] = [
    {
      key: 'guest',
      header: 'Guest Contact',
      render: (item) => (
        <div className="flex flex-col space-y-0.5">
          <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">{item.name}</span>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            {item.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-400" />
                {item.email}
              </span>
            )}
            {item.phone && (
              <span className="flex items-center gap-1 font-mono">
                <Phone className="w-3 h-3 text-slate-400" />
                {item.phone}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'subject',
      header: 'Subject / Message',
      render: (item) => (
        <div className="flex flex-col space-y-0.5 max-w-md">
          <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 line-clamp-1">
            {item.subject}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
            {item.message}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '130px',
      render: (item) => {
        if (item.status === GeneralContactStatus.NEW) {
          return (
            <Badge className="bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-800 font-semibold text-[11px]">
              <AlertCircle className="w-3 h-3 mr-1" /> NEW
            </Badge>
          );
        }
        if (item.status === GeneralContactStatus.IN_PROGRESS) {
          return (
            <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-800 font-semibold text-[11px]">
              <Clock className="w-3 h-3 mr-1" /> IN PROGRESS
            </Badge>
          );
        }
        if (item.status === GeneralContactStatus.RESOLVED) {
          return (
            <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 font-semibold text-[11px]">
              <CheckCircle2 className="w-3 h-3 mr-1" /> RESOLVED
            </Badge>
          );
        }
        return (
          <Badge variant="outline" className="text-[11px]">
            {item.status}
          </Badge>
        );
      },
    },
    {
      key: 'date',
      header: 'Date',
      align: 'right',
      width: '140px',
      render: (item) => (
        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{item.date}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      width: '90px',
      render: (item) => (
        <Link href={`/admin/contact`}>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1 cursor-pointer">
            <Eye className="w-3.5 h-3.5" />
            View
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <AdminPageHeader
        title="Dashboard Overview"
        description="Moti Mahal Lodge & Restaurant administrative management portal."
        action={
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoadingContacts}
              className="h-9 cursor-pointer gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingContacts ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Link href="/" target="_blank">
              <Button variant="outline" size="sm" className="h-9 gap-1.5 cursor-pointer">
                <ExternalLink className="w-3.5 h-3.5" /> Website
              </Button>
            </Link>
          </div>
        }
      />

      {/* Colorful Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Link key={m.href} href={m.href} className="group">
              <div className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-sm ${m.bgClass} flex items-center justify-between`}>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    {m.title}
                  </span>
                  <div className={`text-2xl font-extrabold tracking-tight ${m.valueClass}`}>
                    {m.value}
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                    {m.subtext}
                  </span>
                </div>
                <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${m.iconBgClass}`}>
                  <Icon className="w-5.5 h-5.5" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Guest Inquiries Section (Full Width Table) */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 space-y-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Guest Contact Inquiries & Submissions
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Recent messages sent by guests through the website contact form.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                All ({submissions.length})
              </button>
              <button
                onClick={() => setActiveTab('new')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  activeTab === 'new'
                    ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                Unread ({newInquiriesCount})
              </button>
              <button
                onClick={() => setActiveTab('in_progress')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  activeTab === 'in_progress'
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                In Progress ({inProgressCount})
              </button>
            </div>

            <Link href="/admin/contact">
              <Button size="sm" variant="ghost" className="h-8 text-xs gap-1 cursor-pointer">
                View All <ArrowUpRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        <AdminDataTable
          isLoading={isLoadingContacts}
          emptyMessage="No guest inquiries found."
          columns={columns}
          data={filteredSubmissions.slice(0, 10)}
          keyExtractor={(item) => item.id}
        />
      </div>
    </div>
  );
}
