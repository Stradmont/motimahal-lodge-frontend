'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminSettingsService } from '@/lib/services/settings.service';
import { ContactSettings, saveContactSettings } from '@/lib/contact-settings';
import { ApiResponse } from '@/lib/api-client';

export function useSettings() {
  const [settings, setSettings] = useState<ContactSettings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await AdminSettingsService.getContactSettings();
      if (res.success && res.data) {
        setSettings(res.data);
        saveContactSettings(res.data);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = async (payload: ContactSettings): Promise<ApiResponse<ContactSettings>> => {
    setIsSaving(true);
    try {
      const res = await AdminSettingsService.updateContactSettings(payload);
      if (res.success && res.data) {
        setSettings(res.data);
        saveContactSettings(res.data);
      }
      return res;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    settings,
    isLoading,
    isSaving,
    refetch: fetchSettings,
    updateSettings,
  };
}
