'use client';

import React from 'react';
import { AppProgressProvider as ProgressProvider } from '@bprogress/next';

export default function AdminProgressProvider({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider
      height="2.5px"
      color="#0F172A"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
}
