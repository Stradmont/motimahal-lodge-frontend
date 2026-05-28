'use client';

import { DashboardProvider } from '@/context/DashboardContext';
import DashboardShell from '@/components/dashboard/DashboardShell';

/**
 * Client-side wrapper that wires the DashboardProvider (context)
 * together with the DashboardShell (sidebar layout).
 * Split from layout.tsx so the parent can remain a Server Component.
 */
export default function DashboardClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <DashboardShell>{children}</DashboardShell>
    </DashboardProvider>
  );
}
