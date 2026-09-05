'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Settings, LogOut, ChevronDown, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface AdminHeaderProps {
  onOpenMobileSidebar: () => void;
  onLogout?: () => void;
  title?: string;
  subtitle?: string;
}

export default function AdminHeader({
  onOpenMobileSidebar,
  onLogout,
  title,
}: AdminHeaderProps) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  return (
    <>
      <header className="sticky top-0 z-30 h-14 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between font-sans select-none">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenMobileSidebar}
            className="lg:hidden text-slate-600 dark:text-slate-300"
            aria-label="Open navigation menu"
          >
            <Menu className="w-4 h-4" />
          </Button>

          <span className="text-xs font-semibold ">
            Admin Portal / {title || 'Dashboard'}
          </span>
        </div>

        {/* Profile Dropdown Area */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
            aria-label="User navigation menu"
            className={cn(
              'flex items-center gap-2 p-1.5 rounded-md transition-all cursor-pointer border border-transparent hover:bg-slate-100 dark:hover:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-700',
              isDropdownOpen && 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            )}
          >
            <div className="w-7 h-7 rounded bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 flex items-center justify-center font-bold text-xs select-none shadow-2xs">
              M
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                Manager
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                Portal Admin
              </span>
            </div>
            <ChevronDown
              className={cn(
                'w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ml-0.5',
                isDropdownOpen && 'rotate-180 text-slate-700 dark:text-slate-200'
              )}
            />
          </button>

          {/* Profile Dropdown Menu */}
          {isDropdownOpen && (
            <div
              role="menu"
              aria-orientation="vertical"
              className="absolute right-0 mt-1.5 w-48 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-1 shadow-md z-50 animate-in fade-in-50 zoom-in-95 duration-100 font-sans"
            >
              <div className="px-2.5 py-1.5 border-b border-slate-100 dark:border-slate-800/80 mb-1">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  Moti Mahal Manager
                </p>
                <p className="text-[10px] text-slate-500 font-mono truncate">
                  manager@motimahal.com
                </p>
              </div>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsDropdownOpen(false);
                  router.push('/admin/settings');
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs font-medium rounded text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100 transition-colors text-left cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>Settings</span>
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsDropdownOpen(false);
                  setShowLogoutConfirm(true);
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs font-medium rounded text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left cursor-pointer mt-0.5"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm} size="sm">
        <div className="space-y-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-base font-semibold">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              Confirm Sign Out
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Are you sure you want to sign out of the Moti Mahal Admin Panel?
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
                if (onLogout) {
                  onLogout();
                } else {
                  localStorage.removeItem('motimahal_admin_auth');
                  router.push('/admin/login');
                }
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

