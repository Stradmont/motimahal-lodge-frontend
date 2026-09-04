'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/layout/AdminSidebar';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import { cn } from '@/lib/utils';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    // Check auth status
    const authStatus = localStorage.getItem('motimahal_admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      if (!isLoginPage) {
        router.push('/admin/login');
      }
    }
  }, [pathname, isLoginPage, router]);

  const handleLogout = () => {
    localStorage.removeItem('motimahal_admin_auth');
    setIsAuthenticated(false);
    router.push('/admin/login');
  };

  if (isLoginPage) {
    return <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans">{children}</div>;
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-zinc-500 border-t-zinc-100 rounded-full animate-spin" />
          <p className="text-xs text-zinc-400 font-medium">Loading CMS Portal...</p>
        </div>
      </div>
    );
  }

  const getPageMeta = () => {
    if (pathname.startsWith('/admin/contact')) {
      return {
        title: 'Contact Submissions',
        subtitle: 'Manage guest contact submissions and email inquiries.',
      };
    }
    if (pathname.startsWith('/admin/gallery')) {
      return {
        title: 'Gallery Management',
        subtitle: 'Curate lodge photography collections and media assets.',
      };
    }
    if (pathname.startsWith('/admin/rooms')) {
      return {
        title: 'Rooms & Accommodations',
        subtitle: 'Manage room inventories, pricing tiers, and availability.',
      };
    }
    if (pathname.startsWith('/admin/videos')) {
      return {
        title: 'Videos & Virtual Tours',
        subtitle: 'Manage video showcase links and promotional embeds.',
      };
    }
    return {
      title: 'Dashboard Overview',
      subtitle: 'System overview and quick CMS management tools.',
    };
  };

  const pageMeta = getPageMeta();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
      <AdminSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
        onLogout={handleLogout}
        unreadCount={3}
      />

      <div
        className={cn(
          'flex flex-col min-h-screen transition-all duration-300 ease-in-out',
          isCollapsed ? 'lg:pl-16' : 'lg:pl-60'
        )}
      >
        <AdminHeader
          onOpenMobileSidebar={() => setIsMobileOpen(true)}
          title={pageMeta.title}
          subtitle={pageMeta.subtitle}
        />

        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
