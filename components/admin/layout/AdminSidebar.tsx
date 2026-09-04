'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  Image as ImageIcon,
  Bed,
  Video,
  LogOut,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
  onLogout: () => void;
  unreadCount?: number;
}

export const adminNavGroup = [
  {
    title: 'Content Management',
    items: [
      {
        title: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
      },
      {
        title: 'Contact Inquiries',
        href: '/admin/contact',
        icon: MessageSquare,
        badge: '3',
      },
      {
        title: 'Gallery Media',
        href: '/admin/gallery',
        icon: ImageIcon,
      },
      {
        title: 'Rooms & Rates',
        href: '/admin/rooms',
        icon: Bed,
      },
      {
        title: 'Videos & Tours',
        href: '/admin/videos',
        icon: Video,
      },
    ],
  },
];

export default function AdminSidebar({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onMobileClose,
  onLogout,
  unreadCount = 3,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-zinc-950/60 backdrop-blur-xs lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 bg-zinc-950 text-zinc-300 border-r border-zinc-800 flex flex-col transition-all duration-200 ease-in-out',
          isCollapsed ? 'lg:w-16' : 'lg:w-60',
          isMobileOpen
            ? 'translate-x-0 w-60'
            : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="h-14 px-4 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <Link href="/admin" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-sm bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold text-sm shrink-0">
              M
            </div>
            {!isCollapsed && (
              <span className="font-bold text-sm text-zinc-100 tracking-tight whitespace-nowrap">
                Moti Mahal CMS
              </span>
            )}
          </Link>

          <button
            onClick={onMobileClose}
            className="p-1 rounded-sm text-zinc-400 hover:text-zinc-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
          {adminNavGroup.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {!isCollapsed && (
                <p className="px-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                  {group.title}
                </p>
              )}

              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === '/admin'
                    ? pathname === '/admin'
                    : pathname.startsWith(item.href);

                const badgeVal =
                  item.href === '/admin/contact' && unreadCount > 0
                    ? unreadCount
                    : item.badge;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onMobileClose}
                    title={isCollapsed ? item.title : undefined}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-sm text-sm transition-colors relative',
                      isActive
                        ? 'bg-zinc-800 text-zinc-50 font-medium'
                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100',
                      isCollapsed ? 'justify-center px-0' : 'justify-between'
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={cn(
                          'w-4 h-4 shrink-0',
                          isActive ? 'text-zinc-50' : 'text-zinc-400'
                        )}
                      />
                      {!isCollapsed && (
                        <span className="truncate">{item.title}</span>
                      )}
                    </div>

                    {!isCollapsed && badgeVal && (
                      <span className="px-1.5 py-0.5 text-xs font-semibold rounded-sm bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {badgeVal}
                      </span>
                    )}

                    {isCollapsed && badgeVal && (
                      <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-zinc-100" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-2 border-t border-zinc-800 bg-zinc-950 space-y-1 shrink-0">
          <Link
            href="/"
            target="_blank"
            title={isCollapsed ? 'View Public Site' : undefined}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-sm text-sm text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 transition-colors',
              isCollapsed && 'justify-center px-0'
            )}
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Public Website</span>}
          </Link>

          <button
            onClick={onLogout}
            title={isCollapsed ? 'Sign Out' : undefined}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 rounded-sm text-sm text-zinc-400 hover:bg-rose-950/30 hover:text-rose-400 transition-colors cursor-pointer',
              isCollapsed && 'justify-center px-0'
            )}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex w-full items-center justify-center py-2 rounded-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors cursor-pointer border-t border-zinc-800/60 mt-1"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <div className="flex items-center gap-2 text-xs font-medium">
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse Navigation</span>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
