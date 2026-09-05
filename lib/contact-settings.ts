'use client';

import { useState, useEffect } from 'react';
import { PublicSettingsService } from '@/lib/services/settings.service';

export interface ContactSettings {
  address: string;
  cityProvince: string;
  primaryPhone: string;
  secondaryPhone: string;
  whatsappNumber: string;
  email: string;
  inquiryEmail: string;
  googleMapEmbedUrl: string;
  googleMapDirectUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  openingHours: string;
}

export const EMPTY_CONTACT_SETTINGS: ContactSettings = {
  address: '',
  cityProvince: '',
  primaryPhone: '',
  secondaryPhone: '',
  whatsappNumber: '',
  email: '',
  inquiryEmail: '',
  googleMapEmbedUrl: '',
  googleMapDirectUrl: '',
  facebookUrl: '',
  instagramUrl: '',
  openingHours: '',
};

const STORAGE_KEY = 'motimahal_contact_settings';

export function getContactSettings(): ContactSettings {
  if (typeof window === 'undefined') return EMPTY_CONTACT_SETTINGS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return EMPTY_CONTACT_SETTINGS;
    return { ...EMPTY_CONTACT_SETTINGS, ...JSON.parse(saved) };
  } catch {
    return EMPTY_CONTACT_SETTINGS;
  }
}

export function saveContactSettings(settings: ContactSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event('contact_settings_updated'));
  } catch {
    // Ignore storage write error
  }
}

export function useContactSettings() {
  const [settings, setSettings] = useState<ContactSettings>(() => getContactSettings());

  useEffect(() => {
    let isMounted = true;

    // Fetch live settings directly from Express backend API (/api/v1/public/settings)
    PublicSettingsService.getContactSettings()
      .then((res) => {
        if (isMounted && res.success && res.data) {
          setSettings(res.data);
          saveContactSettings(res.data);
        }
      })
      .catch(() => {
        // Fallback to local cache on network error
      });

    const handleUpdate = () => {
      setSettings(getContactSettings());
    };

    window.addEventListener('contact_settings_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('contact_settings_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return settings;
}
