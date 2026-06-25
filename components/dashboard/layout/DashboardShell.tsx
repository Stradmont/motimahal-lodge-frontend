'use client';

import React, { useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import CommandCenter from '@/components/dashboard/common/CommandCenter';
import { useAuth } from '@/context/AuthContext';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* CommandCenter modal triggerable by search button or Ctrl+K */}
      <CommandCenter />

      {/* ── Sidebar (handles desktop collapse and mobile drawer overlays) ── */}
      <DashboardSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* ── Main Viewports ── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <DashboardHeader onMenuClick={() => setMobileOpen(true)} />

        {/* Content Pane */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-background">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
