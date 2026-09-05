'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  Image as ImageIcon,
  FileImage,
  FileText,
  Bed,
  Video,
  Settings,
  LogOut,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  AlertTriangle,
  CalendarCheck,
  Building2,
  Database,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
  onLogout: () => void;
}

export interface NavSubItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

export interface NavItem {
  title: string;
  href?: string;
  icon: React.ElementType;
  children?: NavSubItem[];
}

export default function AdminSidebar({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onMobileClose,
  onLogout,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isRoomsExpanded, setIsRoomsExpanded] = useState(() => pathname.startsWith('/admin/rooms'));

  useEffect(() => {
    if (pathname.startsWith('/admin/rooms') && !isRoomsExpanded) {
      setIsRoomsExpanded(true);
    }
  }, [pathname, isRoomsExpanded]);

  const navGroups: { groupLabel: string; items: NavItem[] }[] = [
    {
      groupLabel: 'Core Domain',
      items: [
        {
          title: 'Dashboard',
          href: '/admin',
          icon: LayoutDashboard,
        },
        {
          title: 'Rooms & Rates',
          icon: Bed,
          children: [
            {
              title: 'All Rooms',
              href: '/admin/rooms',
              icon: Building2,
            },
            {
              title: 'Room Inquiries',
              href: '/admin/rooms/inquiries',
              icon: CalendarCheck,
            },
          ],
        },
        {
          title: 'Contact Inquiries',
          href: '/admin/contact',
          icon: MessageSquare,
        },
        {
          title: 'Blog Articles',
          href: '/admin/blogs',
          icon: FileText,
        },
      ],
    },
    {
      groupLabel: 'Media & Showcase',
      items: [
        {
          title: 'Media Library',
          href: '/admin/media',
          icon: FileImage,
        },
        {
          title: 'Gallery Media',
          href: '/admin/gallery',
          icon: ImageIcon,
        },
        {
          title: 'Videos & Tours',
          href: '/admin/videos',
          icon: Video,
        },
      ],
    },
    {
      groupLabel: 'System Settings',
      items: [
        {
          title: 'Database Backups',
          href: '/admin/backups',
          icon: Database,
        },
        {
          title: 'Contact & Location',
          href: '/admin/settings',
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col transition-all duration-200 ease-in-out font-sans select-none',
          isCollapsed ? 'lg:w-16' : 'lg:w-60',
          isMobileOpen
            ? 'translate-x-0 w-60'
            : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="h-14 px-3.5 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between shrink-0 bg-white dark:bg-slate-950">
          <Link href="/admin" className="flex items-center gap-2.5 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/branding/logo.png"
              alt="Moti Mahal Logo"
              className="w-7 h-7 rounded object-contain shrink-0 bg-slate-50 dark:bg-slate-900 p-0.5 border border-slate-200 dark:border-slate-800"
            />
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-xs text-slate-900 dark:text-slate-100 tracking-tight whitespace-nowrap leading-tight">
                  Moti Mahal
                </span>
                <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold tracking-wide uppercase">
                  CMS Portal
                </span>
              </div>
            )}
          </Link>

          <button
            onClick={onMobileClose}
            className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 lg:hidden cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-2 bg-white dark:bg-slate-950">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              {groupIdx > 0 && (
                <div className="border-t border-slate-200/80 dark:border-slate-800/80 my-2.5 mx-1" />
              )}

              {group.items.map((item) => {
                const Icon = item.icon;

                // Handle Submenu items (e.g., Rooms & Rates)
                if (item.children) {
                  const isParentActive = pathname.startsWith('/admin/rooms');

                  return (
                    <div key={item.title} className="space-y-1">
                      {/* Parent Menu Item */}
                      <button
                        type="button"
                        onClick={() => {
                          if (isCollapsed) {
                            onToggleCollapse();
                          }
                          setIsRoomsExpanded(!isRoomsExpanded);
                        }}
                        title={isCollapsed ? item.title : undefined}
                        className={cn(
                          'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] transition-all relative font-medium group cursor-pointer',
                          isParentActive
                            ? 'bg-slate-100/90 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 font-semibold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-slate-100',
                          isCollapsed ? 'justify-center px-0' : 'justify-between'
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={cn(
                              'w-4 h-4 shrink-0 transition-colors',
                              isParentActive
                                ? 'text-amber-700 dark:text-amber-400'
                                : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
                            )}
                          />
                          {!isCollapsed && (
                            <span className="truncate tracking-tight">{item.title}</span>
                          )}
                        </div>

                        {!isCollapsed && (
                          <ChevronDown
                            className={cn(
                              'w-3.5 h-3.5 text-slate-400 transition-transform duration-200',
                              isRoomsExpanded ? 'rotate-180 text-slate-700 dark:text-slate-300' : ''
                            )}
                          />
                        )}
                      </button>

                      {/* Submenu Links */}
                      {!isCollapsed && isRoomsExpanded && (
                        <div className="border-l border-slate-200 dark:border-slate-800/80 pl-3 ml-3.5 space-y-1 my-1">
                          {item.children.map((sub) => {
                            const SubIcon = sub.icon;
                            const isSubActive =
                              sub.href === '/admin/rooms'
                                ? pathname === '/admin/rooms'
                                : pathname.startsWith(sub.href);

                            return (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                onClick={onMobileClose}
                                className={cn(
                                  'flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition-all relative font-medium justify-between',
                                  isSubActive
                                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 font-semibold shadow-2xs'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100'
                                )}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <SubIcon className={cn('w-3.5 h-3.5 shrink-0', isSubActive ? 'text-white dark:text-slate-950' : 'text-slate-500')} />
                                  <span className="truncate tracking-tight">{sub.title}</span>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                // Standard Single Menu Item
                const href = item.href || '/admin';
                const isActive =
                  href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={onMobileClose}
                    title={isCollapsed ? item.title : undefined}
                    className={cn(
                      'flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] transition-all relative font-medium group',
                      isActive
                        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 font-semibold shadow-2xs'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-900/80 hover:text-slate-900 dark:hover:text-slate-100',
                      isCollapsed ? 'justify-center px-0' : 'justify-between'
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={cn(
                          'w-4 h-4 shrink-0 transition-colors',
                          isActive
                            ? 'text-white dark:text-slate-950'
                            : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
                        )}
                      />
                      {!isCollapsed && (
                        <span className="truncate tracking-tight">{item.title}</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-2.5 border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 space-y-1 shrink-0">
          <Link
            href="/"
            target="_blank"
            title={isCollapsed ? 'Public Site' : undefined}
            className={cn(
              'flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100 transition-colors',
              isCollapsed && 'justify-center px-0'
            )}
          >
            <ExternalLink className="w-3.5 h-3.5 shrink-0 text-slate-500" />
            {!isCollapsed && <span className="tracking-tight">Public Website</span>}
          </Link>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            title={isCollapsed ? 'Sign Out' : undefined}
            className={cn(
              'w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer',
              isCollapsed && 'justify-center px-0'
            )}
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            {!isCollapsed && <span className="tracking-tight">Sign Out</span>}
          </button>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex w-full items-center justify-center py-1.5 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer border-t border-slate-200/80 dark:border-slate-800/80 mt-1"
            title={isCollapsed ? 'Expand Navigation' : 'Collapse Navigation'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Collapse</span>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Sign Out Confirmation Dialog */}
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm} size="sm">
        <div className="space-y-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-base font-semibold">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              Confirm Sign Out
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Are you sure you want to sign out of the Moti Mahal Admin Panel? You will need to log back in to manage hotel settings.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(false)}
              className="px-3 py-1.5 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setShowLogoutConfirm(false);
                onLogout();
              }}
              className="px-3 py-1.5 text-xs font-semibold rounded-md bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </DialogFooter>
        </div>
      </Dialog>
    </>
  );
}
