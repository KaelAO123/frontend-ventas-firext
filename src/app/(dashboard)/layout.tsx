'use client';

import { RouteGuard } from '@/components/auth/RouteGuard';
import MainLayout from '@/components/layouts/MainLayout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard>
      <MainLayout>{children}</MainLayout>
    </RouteGuard>
  );
}