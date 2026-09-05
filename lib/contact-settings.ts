'use client';

import { useState, useEffect } from 'react';
import { SettingsService } from '@/lib/services/settings.service';

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

export const DEFAULT_PRIMARY_PHONE = '+977 98550 12345';
export const DEFAULT_SECONDARY_PHONE = '+977 98450 67890';
export const DEFAULT_WHATSAPP_NUMBER = '+977 98550 12345';
export const DEFAULT_EMAIL = 'info@motimahallodge.com';
export const DEFAULT_INQUIRY_EMAIL = 'motimahallodge@gmail.com';

export const DEFAULT_CONTACT_SETTINGS: ContactSettings = {
  address: 'Bharatpur-3, Narayangarh',
  cityProvince: 'Chitwan District, Bagmati Province, Nepal',
  primaryPhone: DEFAULT_PRIMARY_PHONE,
  secondaryPhone: DEFAULT_SECONDARY_PHONE,
  whatsappNumber: DEFAULT_WHATSAPP_NUMBER,
  email: DEFAULT_EMAIL,
  inquiryEmail: DEFAULT_INQUIRY_EMAIL,
  googleMapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.787687834571!2d84.428781!3d27.678951!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3994fb2193b2160d%3A0x6b4f74d0e68d0d0!2sBharatpur%2044200%2C%20Nepal!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp',
  googleMapDirectUrl:
    'https://maps.google.com/?q=Bharatpur+10+Narayangarh+Chitwan+Nepal',
  facebookUrl:
    'https://www.facebook.com/people/Moti-Mahal-Restaurant-Lodge/61592017018419/',
  instagramUrl:
    'https://www.instagram.com/moti_mahal_restaurant_lodge/',
  openingHours: '24 Hours / 7 Days a Week (Front Desk)',
};

const STORAGE_KEY = 'motimahal_contact_settings';

export function getContactSettings(): ContactSettings {
  if (typeof window === 'undefined') return DEFAULT_CONTACT_SETTINGS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_CONTACT_SETTINGS;
    return { ...DEFAULT_CONTACT_SETTINGS, ...JSON.parse(saved) };
  } catch {
    return DEFAULT_CONTACT_SETTINGS;
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

    // Fetch live settings from backend API
    SettingsService.getContactSettings()
      .then((res) => {
        if (isMounted && res.success && res.data) {
          setSettings(res.data);
          saveContactSettings(res.data);
        }
      })
      .catch(() => {
        // Fallback to local cache or defaults on error
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
