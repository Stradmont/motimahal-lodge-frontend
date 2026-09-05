'use client';

import React, { useState, useEffect } from 'react';
import { Save, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { AdminInput as Input } from '@/components/admin/common/AdminInput';
import AdminPageHeader from '@/components/admin/layout/AdminPageHeader';
import { ContactSettings, DEFAULT_CONTACT_SETTINGS } from '@/lib/contact-settings';
import { useSettings } from '@/hooks/useSettings';

export default function AdminSettingsPage() {
  const { settings, isLoading, isSaving, updateSettings } = useSettings();
  const [formData, setFormData] = useState<ContactSettings>(DEFAULT_CONTACT_SETTINGS);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleChange = (key: keyof ContactSettings, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.primaryPhone.trim()) {
      newErrors.primaryPhone = 'Primary phone number is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Primary email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Lodge address is required';
    }

    if (!formData.cityProvince.trim()) {
      newErrors.cityProvince = 'City & district location is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fill in all required settings fields');
      return false;
    }

    return true;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await updateSettings(formData);
      if (res.success) {
        toast.success(res.message || 'Contact & Location settings saved');
      } else {
        toast.error(res.message || 'Failed to save settings');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
        <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
        <span>Loading contact & location settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans max-w-5xl pb-16">
      {/* Page Header */}
      <AdminPageHeader
        title="Contact & Location Settings"
        description="Configure telephone numbers, address, operating hours, map location embed, and social links."
        action={
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 mr-1.5" /> Save Settings
              </>
            )}
          </Button>
        }
      />

      <form onSubmit={handleSave} noValidate className="space-y-8">
        {/* Section 1: Contact Information */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-md bg-white dark:bg-slate-950 p-6 space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Primary Contact Information
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Phone numbers, email addresses, and location details shown across website footer and contact page.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-start">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 md:pt-2">
                Primary Phone <span className="text-rose-500">*</span>
              </label>
              <div className="md:col-span-2 space-y-1">
                <Input
                  type="text"
                  value={formData.primaryPhone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('primaryPhone', e.target.value)}
                  placeholder="+977 56 590123"
                  className={errors.primaryPhone ? 'border-rose-500 dark:border-rose-500 focus-visible:ring-rose-500' : ''}
                />
                {errors.primaryPhone && (
                  <p className="text-[11px] font-medium text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {errors.primaryPhone}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-start">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 md:pt-2">
                Secondary Phone / WhatsApp
              </label>
              <div className="md:col-span-2">
                <Input
                  type="text"
                  value={formData.secondaryPhone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('secondaryPhone', e.target.value)}
                  placeholder="+977 9845179310"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-start">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 md:pt-2">
                Primary Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="md:col-span-2 space-y-1">
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('email', e.target.value)}
                  placeholder="info@motimahallodge.com"
                  className={errors.email ? 'border-rose-500 dark:border-rose-500 focus-visible:ring-rose-500' : ''}
                />
                {errors.email && (
                  <p className="text-[11px] font-medium text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-start">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 md:pt-2">
                Lodge Address <span className="text-rose-500">*</span>
              </label>
              <div className="md:col-span-2 space-y-1">
                <Input
                  type="text"
                  value={formData.address}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('address', e.target.value)}
                  placeholder="Bharatpur-3, Narayangarh"
                  className={errors.address ? 'border-rose-500 dark:border-rose-500 focus-visible:ring-rose-500' : ''}
                />
                {errors.address && (
                  <p className="text-[11px] font-medium text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {errors.address}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-start">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 md:pt-2">
                City & District <span className="text-rose-500">*</span>
              </label>
              <div className="md:col-span-2 space-y-1">
                <Input
                  type="text"
                  value={formData.cityProvince}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('cityProvince', e.target.value)}
                  placeholder="Chitwan District, Nepal"
                  className={errors.cityProvince ? 'border-rose-500 dark:border-rose-500 focus-visible:ring-rose-500' : ''}
                />
                {errors.cityProvince && (
                  <p className="text-[11px] font-medium text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {errors.cityProvince}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Operating Hours & Map */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-md bg-white dark:bg-slate-950 p-6 space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Hours & Map Location Embed
            </h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-start">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 md:pt-2">
                Opening Hours
              </label>
              <div className="md:col-span-2">
                <Input
                  type="text"
                  value={formData.openingHours}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('openingHours', e.target.value)}
                  placeholder="24 Hours / 7 Days a Week"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-start">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 md:pt-2">
                Google Map Embed URL
              </label>
              <div className="md:col-span-2">
                <Input
                  type="url"
                  value={formData.googleMapEmbedUrl}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('googleMapEmbedUrl', e.target.value)}
                  placeholder="https://www.google.com/maps/embed?..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Social Channels */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-md bg-white dark:bg-slate-950 p-6 space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Social Media Channels
            </h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-start">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 md:pt-2">
                Facebook Page URL
              </label>
              <div className="md:col-span-2">
                <Input
                  type="url"
                  value={formData.facebookUrl}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('facebookUrl', e.target.value)}
                  placeholder="https://facebook.com/..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-start">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 md:pt-2">
                Instagram Profile URL
              </label>
              <div className="md:col-span-2">
                <Input
                  type="url"
                  value={formData.instagramUrl}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('instagramUrl', e.target.value)}
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="submit" size="sm" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 mr-1.5" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
