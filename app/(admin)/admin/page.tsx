'use client';

import React from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Image as ImageIcon,
  Bed,
  Video,
  ExternalLink,
  ArrowRight,
  FileText,
  FileImage,
  Database,
  Settings,
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
      value: isLoadingRooms ? '...' : `${rooms.length} Categories`,
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

  const quickNav = [
    {
      title: 'Rooms & Rates Management',
      description: 'Manage room categories, pricing, amenities, and inventory',
      href: '/admin/rooms',
      icon: Bed,
    },
    {
      title: 'Guest Contact Inquiries',
      description: 'View and respond to guest inquiries submitted from the website',
      href: '/admin/contact',
      icon: MessageSquare,
    },
    {
      title: 'Blog Articles & News',
      description: 'Create and edit blog posts using the rich text editor',
      href: '/admin/blogs',
      icon: FileText,
    },
    {
      title: 'Media Asset Library',
      description: 'Upload and organize general website images and assets',
      href: '/admin/media',
      icon: FileImage,
    },
    {
      title: 'Photo Gallery Collections',
      description: 'Manage homepage and about page photo gallery showcases',
      href: '/admin/gallery',
      icon: ImageIcon,
    },
    {
      title: 'Database Backups',
      description: 'Execute PostgreSQL dumps and inspect database audit logs',
      href: '/admin/backups',
      icon: Database,
    },
    {
      title: 'Contact & Location Settings',
      description: 'Update phone numbers, email addresses, and location details',
      href: '/admin/settings',
      icon: Settings,
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
                <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                  m.accent
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/60'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-slate-100 dark:group-hover:text-slate-900'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Navigation List */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 space-y-4 shadow-2xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-3">
          Management Modules
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group p-3.5 rounded-lg border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100/80 dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0 group-hover:border-slate-400 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors block">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal block">
                      {item.description}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
