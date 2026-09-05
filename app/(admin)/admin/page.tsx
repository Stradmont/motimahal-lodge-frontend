'use client';

import React from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Image as ImageIcon,
  Bed,
  Video,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminPageHeader from '@/components/admin/layout/AdminPageHeader';
import { useRooms } from '@/hooks/useRooms';
import { useContacts } from '@/hooks/useContacts';
import { useGallery } from '@/hooks/useGallery';
import { useVideo } from '@/hooks/useVideo';

export default function AdminDashboardOverview() {
  const { rooms, isLoading: isLoadingRooms } = useRooms();
  const { submissions, isLoading: isLoadingContacts } = useContacts();
  const { sections, isLoading: isLoadingGallery } = useGallery();
  const { videos, isLoading: isLoadingVideos } = useVideo();

  const newInquiriesCount = submissions.filter((s) => s.status === 'NEW').length;

  const metrics = [
    {
      title: 'Unread Inquiries',
      value: isLoadingContacts ? '...' : `${newInquiriesCount} New`,
      subtext: `${submissions.length} Total Received`,
      href: '/admin/contact',
      icon: MessageSquare,
      accent: newInquiriesCount > 0,
    },
    {
      title: 'Rooms & Rates',
      value: isLoadingRooms ? '...' : `${rooms.length} Rooms`,
      subtext: `${rooms.reduce((acc, r) => acc + (r.totalUnits || 1), 0)} Total Units`,
      href: '/admin/rooms',
      icon: Bed,
      accent: false,
    },
    {
      title: 'Gallery Showcase',
      value: isLoadingGallery ? '...' : `${sections.length} Collections`,
      subtext: 'Active Photo Media',
      href: '/admin/gallery',
      icon: ImageIcon,
      accent: false,
    },
    {
      title: 'Video Tours',
      value: isLoadingVideos ? '...' : `${videos.length} Videos`,
      subtext: 'Published Virtual Tours',
      href: '/admin/videos',
      icon: Video,
      accent: false,
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <AdminPageHeader
        title="Dashboard Overview"
        description="Moti Mahal Lodge & Restaurant administrative portal."
        action={
          <Link href="/" target="_blank">
            <Button variant="outline" size="sm" className="h-9 gap-1.5 cursor-pointer">
              <ExternalLink className="w-3.5 h-3.5" /> Public Website
            </Button>
          </Link>
        }
      />

      {/* Clean Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Link key={m.href} href={m.href} className="group">
              <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex items-center justify-between shadow-2xs">
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {m.title}
                  </span>
                  <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {m.value}
                  </div>
                  <span className="text-[11px] text-slate-500 font-normal block">
                    {m.subtext}
                  </span>
                </div>
                <div
                  className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                    m.accent
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/60'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-slate-100 dark:group-hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
