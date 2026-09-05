'use client';

import React from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Image as ImageIcon,
  Bed,
  Video,
  ExternalLink,
  Settings,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminDataTable } from '@/components/admin/common/AdminDataTable';
import AdminPageHeader from '@/components/admin/layout/AdminPageHeader';
import { useRooms } from '@/hooks/useRooms';
import { useContacts } from '@/hooks/useContacts';
import { useGallery } from '@/hooks/useGallery';
import { useVideo } from '@/hooks/useVideo';
import { GeneralContactStatus } from '@/lib/types/inquiry';

export default function AdminDashboardOverview() {
  const { rooms, isLoading: isLoadingRooms } = useRooms();
  const { submissions, isLoading: isLoadingContacts } = useContacts();
  const { sections, isLoading: isLoadingGallery } = useGallery();
  const { videos, isLoading: isLoadingVideos } = useVideo();

  const newInquiriesCount = submissions.filter((s) => s.status === GeneralContactStatus.NEW).length;

  const metrics = [
    {
      title: 'Unread Inquiries',
      value: isLoadingContacts ? '...' : `${newInquiriesCount} New`,
      href: '/admin/contact',
      icon: MessageSquare,
      badge: 'Action Required',
      badgeVariant: 'destructive' as const,
    },
    {
      title: 'Total Rooms',
      value: isLoadingRooms ? '...' : `${rooms.length} Categories`,
      href: '/admin/rooms',
      icon: Bed,
      badge: `${rooms.reduce((acc, r) => acc + (r.totalUnits || 1), 0)} Units`,
      badgeVariant: 'outline' as const,
    },
    {
      title: 'Gallery Media',
      value: isLoadingGallery ? '...' : `${sections.length} Collections`,
      href: '/admin/gallery',
      icon: ImageIcon,
      badge: 'Active',
      badgeVariant: 'secondary' as const,
    },
    {
      title: 'Video Showcase',
      value: isLoadingVideos ? '...' : `${videos.length} Tours`,
      href: '/admin/videos',
      icon: Video,
      badge: 'Published',
      badgeVariant: 'outline' as const,
    },
  ];

  const recentActivities = submissions.slice(0, 5).map((sub) => ({
    id: sub.id,
    activity: `Inquiry from ${sub.name}: "${sub.subject}"`,
    module: sub.category || 'Contact',
    timestamp: sub.date,
  }));

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <AdminPageHeader
        title="Dashboard Overview"
        description="Moti Mahal Lodge business management portal."
        action={
          <div className="flex items-center gap-2">
            <Link href="/admin/contact">
              <Button size="sm">
                View Inquiries ({newInquiriesCount})
              </Button>
            </Link>
            <Link href="/" target="_blank">
              <Button variant="outline" size="sm">
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Website
              </Button>
            </Link>
          </div>
        }
      />

      {/* Summary Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Link key={m.href} href={m.href} className="group">
              <div className="border border-slate-200 dark:border-slate-800 rounded-md bg-white dark:bg-slate-950 p-4 hover:border-slate-400 dark:hover:border-slate-700 transition-colors flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">{m.title}</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">{m.value}</p>
                </div>
                <div className="w-9 h-9 rounded bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 flex items-center justify-center border border-slate-200 dark:border-slate-800 group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-slate-100 dark:group-hover:text-slate-900 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity Table & Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        <div className="lg:col-span-2 space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
              Recent System Inquiries & Activity
            </h3>
            <Link href="/admin/contact" className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 font-medium">
              View all
            </Link>
          </div>
          <AdminDataTable
            isLoading={isLoadingContacts}
            emptyMessage="No recent guest inquiry activity recorded."
            columns={[
              {
                key: 'activity',
                header: 'Activity description',
                render: (item) => (
                  <span className="font-medium text-slate-900 dark:text-slate-100">{item.activity}</span>
                ),
              },
              {
                key: 'module',
                header: 'Module',
                width: '120px',
                render: (item) => (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                    {item.module}
                  </span>
                ),
              },
              {
                key: 'timestamp',
                header: 'Date',
                align: 'right',
                width: '150px',
                render: (item) => (
                  <span className="text-xs text-slate-500 font-mono">{item.timestamp}</span>
                ),
              },
            ]}
            data={recentActivities}
            keyExtractor={(item) => item.id}
          />
        </div>

        {/* System Summary & Quick Actions */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-md bg-white dark:bg-slate-950 p-4 flex flex-col justify-between font-sans">
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2">
              Management Navigation
            </h3>

            <div className="space-y-1">
              <Link
                href="/admin/rooms"
                className="flex items-center justify-between p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 font-medium transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Bed className="w-3.5 h-3.5 text-slate-500" /> Manage Rooms & Pricing
                </span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </Link>
              <Link
                href="/admin/contact"
                className="flex items-center justify-between p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 font-medium transition-colors"
              >
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-500" /> Guest Contact Inquiries
                </span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </Link>
              <Link
                href="/admin/gallery"
                className="flex items-center justify-between p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 font-medium transition-colors"
              >
                <span className="flex items-center gap-2">
                  <ImageIcon className="w-3.5 h-3.5 text-slate-500" /> Lodge Photo Gallery
                </span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center justify-between p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 font-medium transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Settings className="w-3.5 h-3.5 text-slate-500" /> Contact & Location Info
                </span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </Link>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>System Status:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> API Connected
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
