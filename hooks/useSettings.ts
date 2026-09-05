'use client';

import { useState, useEffect, useCallback } from 'react';
import { SettingsService } from '@/lib/services/settings.service';
import { ContactSettings } from '@/lib/contact-settings';
import { ApiResponse } from '@/lib/api-client';

export function useSettings() {
  const [settings, setSettings] = useState<ContactSettings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await SettingsService.getContactSettings();
      if (res.success && res.data) {
        setSettings(res.data);
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
      const res = await SettingsService.updateContactSettings(payload);
      if (res.success && res.data) {
        setSettings(res.data);
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
