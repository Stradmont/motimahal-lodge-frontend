'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Toaster } from 'sonner';
import AdminSidebar from '@/components/admin/layout/AdminSidebar';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';

function AdminProtectedContent({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!isLoading) {
      if (!user && !isLoginPage) {
        router.replace('/admin/login');
      } else if (user && isLoginPage) {
        router.replace('/admin/contact');
      }
    }
  }, [user, isLoading, isLoginPage, router]);

  if (isLoginPage) {
    return (
      <div className="admin-theme min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased">
        <Toaster position="bottom-right" theme="light" richColors closeButton />
        {children}
      </div>
    );
  }

  // Show loading skeleton during initial session validation
  if (isLoading || !user) {
    return (
      <div className="admin-theme min-h-screen bg-slate-950 flex flex-col items-center justify-center font-sans antialiased">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-slate-700 border-t-emerald-400 rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-medium tracking-wide">Validating Admin Session...</p>
        </div>
      </div>
    );
  }

  const getPageMeta = () => {
    if (pathname.startsWith('/admin/contact')) {
      return {
        title: 'General Contact Inquiries',
        subtitle: 'Manage guest contact submissions, dining queries, and email messages.',
      };
    }
    if (pathname.startsWith('/admin/rooms/inquiries')) {
      return {
        title: 'Room Inquiries',
        subtitle: 'Manage room reservation requests, booking queries, and stay preferences.',
      };
    }
    if (pathname.startsWith('/admin/rooms')) {
      return {
        title: 'Rooms & Accommodations',
        subtitle: 'Manage room inventories, pricing tiers, and availability.',
      };
    }
    if (pathname.startsWith('/admin/media')) {
      return {
        title: 'Media Library',
        subtitle: 'Centralized CMS asset repository for photos, lodge imagery, safari captures, and media documents.',
      };
    }
    if (pathname.startsWith('/admin/gallery')) {
      return {
        title: 'Gallery Management',
        subtitle: 'Curate lodge photography collections and media assets.',
      };
    }
    if (pathname.startsWith('/admin/videos')) {
      return {
        title: 'Videos & Virtual Tours',
        subtitle: 'Manage video showcase links and promotional embeds.',
      };
    }
    if (pathname.startsWith('/admin/settings')) {
      return {
        title: 'Contact & Location Settings',
        subtitle: 'Configure contact information, map embed, operating hours, and social media links.',
      };
    }
    return {
      title: 'Dashboard Overview',
      subtitle: 'System overview and quick CMS management tools.',
    };
  };

  const pageMeta = getPageMeta();

  return (
    <div className="admin-theme min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-slate-900 selection:text-white">
      <Toaster position="bottom-right" theme="system" richColors closeButton />
      <AdminSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
        onLogout={logout}
      />

      <div
        className={cn(
          'flex flex-col min-h-screen transition-all duration-200 ease-in-out',
          isCollapsed ? 'lg:pl-16' : 'lg:pl-60'
        )}
      >
        <AdminHeader
          onOpenMobileSidebar={() => setIsMobileOpen(true)}
          onLogout={logout}
          title={pageMeta.title}
          subtitle={pageMeta.subtitle}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-[1720px] mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminProtectedContent>{children}</AdminProtectedContent>
    </AuthProvider>
  );
}
