import DashboardClientLayout from '@/components/dashboard/DashboardClientLayout';
import { Suspense } from 'react';


// Suspense is required here because DashboardClientLayout contains
// useSearchParams() which opts into dynamic rendering.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen flex items-center justify-center bg-background">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <DashboardClientLayout>{children}</DashboardClientLayout>
    </Suspense>
  );
}
