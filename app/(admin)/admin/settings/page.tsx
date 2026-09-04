'use client';

import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, MapPin, Phone, Mail, MessageSquare, Globe, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import AdminPageHeader from '@/components/admin/layout/AdminPageHeader';
import {
  getContactSettings,
  saveContactSettings,
  DEFAULT_CONTACT_SETTINGS,
  ContactSettings,
} from '@/lib/contact-settings';

const contactSettingsSchema = z.object({
  address: z
    .string()
    .trim()
    .min(1, { message: 'Street address is required' })
    .min(3, { message: 'Address must be at least 3 characters' }),
  cityProvince: z
    .string()
    .trim()
    .min(1, { message: 'City and province are required' }),
  primaryPhone: z
    .string()
    .trim()
    .min(1, { message: 'Primary phone number is required' })
    .min(7, { message: 'Please enter a valid phone number (min 7 digits)' }),
  secondaryPhone: z.string().trim().optional(),
  whatsappNumber: z
    .string()
    .trim()
    .min(1, { message: 'WhatsApp number is required' }),
  email: z
    .string()
    .trim()
    .min(1, { message: 'Primary email address is required' })
    .email({ message: 'Please enter a valid email address' }),
  inquiryEmail: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: 'Please enter a valid inquiry email address',
    }),
  googleMapEmbedUrl: z
    .string()
    .trim()
    .min(1, { message: 'Google Maps embed URL is required' })
    .url({ message: 'Must be a valid Google Maps embed URL (https://...)' }),
  googleMapDirectUrl: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: 'Must be a valid URL',
    }),
  facebookUrl: z
    .string()
    .trim()
    .min(1, { message: 'Facebook URL is required' })
    .url({ message: 'Must be a valid URL' }),
  instagramUrl: z
    .string()
    .trim()
    .min(1, { message: 'Instagram URL is required' })
    .url({ message: 'Must be a valid URL' }),
  openingHours: z
    .string()
    .trim()
    .min(1, { message: 'Front desk operating hours are required' }),
});

type ContactSettingsFormData = z.infer<typeof contactSettingsSchema>;

export default function AdminContactSettingsPage() {
  const [toastMessage, setToastMessage] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ContactSettingsFormData>({
    resolver: zodResolver(contactSettingsSchema),
    defaultValues: DEFAULT_CONTACT_SETTINGS,
    mode: 'onBlur',
  });

  useEffect(() => {
    const current = getContactSettings();
    reset(current);
  }, [reset]);

  const onSubmit = (data: ContactSettingsFormData) => {
    saveContactSettings(data as ContactSettings);
    setIsSaved(true);
    showToast('Lodge contact & location details saved successfully!');
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleResetToDefault = () => {
    if (confirm('Are you sure you want to reset contact details to default values?')) {
      reset(DEFAULT_CONTACT_SETTINGS);
      saveContactSettings(DEFAULT_CONTACT_SETTINGS);
      showToast('Contact settings reset to defaults');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-zinc-900 text-zinc-50 border border-zinc-700 px-4 py-2.5 rounded-sm text-sm font-medium shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <AdminPageHeader
        title="Contact & Location Settings"
        description="Manage lodge address, Google Maps location, phone numbers, email addresses, and social media handles visible across the website."
        action={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetToDefault}
              className="text-xs h-9"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Reset Defaults
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT 8 COLS: FORM FIELDS */}
          <div className="lg:col-span-8 space-y-6">

            {/* 1. Address & Location */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-sm bg-white dark:bg-zinc-950 p-5 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <MapPin className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                  Lodge Address & Location
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Street Address / Area <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="text"
                    {...register('address')}
                    placeholder="e.g. Bharatpur-10, Narayangarh"
                    className={errors.address ? 'border-rose-500 focus-visible:ring-rose-500' : ''}
                  />
                  {errors.address && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    City, District & Province <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="text"
                    {...register('cityProvince')}
                    placeholder="e.g. Chitwan District, Bagmati Province, Nepal"
                    className={errors.cityProvince ? 'border-rose-500 focus-visible:ring-rose-500' : ''}
                  />
                  {errors.cityProvince && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.cityProvince.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Google Maps Embed iFrame URL <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="url"
                  {...register('googleMapEmbedUrl')}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  className={`font-mono text-xs ${errors.googleMapEmbedUrl ? 'border-rose-500 focus-visible:ring-rose-500' : ''}`}
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  Obtained from Google Maps → Share → Embed a map → Copy HTML src URL.
                </p>
                {errors.googleMapEmbedUrl && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.googleMapEmbedUrl.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Direct Google Maps Link (Optional)
                </label>
                <Input
                  type="url"
                  {...register('googleMapDirectUrl')}
                  placeholder="https://maps.google.com/?q=..."
                  className={`font-mono text-xs ${errors.googleMapDirectUrl ? 'border-rose-500 focus-visible:ring-rose-500' : ''}`}
                />
                {errors.googleMapDirectUrl && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.googleMapDirectUrl.message}
                  </p>
                )}
              </div>
            </div>

            {/* 2. Phone Numbers & WhatsApp */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-sm bg-white dark:bg-zinc-950 p-5 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <Phone className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                  Phone Numbers & Instant Messaging
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Primary Telephone <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="text"
                    {...register('primaryPhone')}
                    placeholder="+977 98550 12345"
                    className={errors.primaryPhone ? 'border-rose-500 focus-visible:ring-rose-500' : ''}
                  />
                  {errors.primaryPhone && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.primaryPhone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Secondary Telephone (Optional)
                  </label>
                  <Input
                    type="text"
                    {...register('secondaryPhone')}
                    placeholder="+977 98450 67890"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    WhatsApp Number <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="text"
                    {...register('whatsappNumber')}
                    placeholder="+977 98550 12345"
                    className={errors.whatsappNumber ? 'border-rose-500 focus-visible:ring-rose-500' : ''}
                  />
                  {errors.whatsappNumber && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.whatsappNumber.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Email & Front Desk Hours */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-sm bg-white dark:bg-zinc-950 p-5 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <Mail className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                  Email Addresses & Desk Operating Hours
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Primary Email <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="email"
                    {...register('email')}
                    placeholder="info@motimahallodge.com"
                    className={errors.email ? 'border-rose-500 focus-visible:ring-rose-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Inquiry Email (Optional)
                  </label>
                  <Input
                    type="email"
                    {...register('inquiryEmail')}
                    placeholder="motimahallodge@gmail.com"
                    className={errors.inquiryEmail ? 'border-rose-500 focus-visible:ring-rose-500' : ''}
                  />
                  {errors.inquiryEmail && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.inquiryEmail.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Desk Operating Hours <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="text"
                    {...register('openingHours')}
                    placeholder="24 Hours / 7 Days a Week"
                    className={errors.openingHours ? 'border-rose-500 focus-visible:ring-rose-500' : ''}
                  />
                  {errors.openingHours && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.openingHours.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 4. Social Links */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-sm bg-white dark:bg-zinc-950 p-5 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <Globe className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                  Social Media Links
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Facebook Page URL <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="url"
                    {...register('facebookUrl')}
                    placeholder="https://facebook.com/..."
                    className={errors.facebookUrl ? 'border-rose-500 focus-visible:ring-rose-500' : ''}
                  />
                  {errors.facebookUrl && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.facebookUrl.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Instagram Profile URL <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="url"
                    {...register('instagramUrl')}
                    placeholder="https://instagram.com/..."
                    className={errors.instagramUrl ? 'border-rose-500 focus-visible:ring-rose-500' : ''}
                  />
                  {errors.instagramUrl && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.instagramUrl.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="submit" size="sm" className="px-6 h-9">
                <Save className="w-4 h-4 mr-1.5" />
                Save Contact Settings
              </Button>
            </div>

          </div>

          {/* RIGHT 4 COLS: LIVE PREVIEW CARD */}
          <div className="lg:col-span-4 space-y-4">
            <div className="sticky top-20 border border-zinc-200 dark:border-zinc-800 rounded-sm bg-white dark:bg-zinc-950 p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="font-semibold text-xs uppercase tracking-wider text-zinc-500">
                  Live Guest Preview
                </h3>
                <Badge variant="outline" className="text-[10px]">
                  Public View
                </Badge>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-zinc-500 block mb-0.5">Address & Location:</span>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Bharatpur-10, Narayangarh
                  </p>
                  <p className="text-zinc-600 dark:text-zinc-400 text-[11px]">
                    Chitwan District, Bagmati Province, Nepal
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-500 block mb-0.5">Contact Numbers:</span>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    Phone: <span className="font-mono text-zinc-700 dark:text-zinc-300">+977 98550 12345</span>
                  </p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    WhatsApp: <span className="font-mono text-zinc-700 dark:text-zinc-300">+977 98550 12345</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-500 block mb-0.5">Emails:</span>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    info@motimahallodge.com
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-500 block mb-0.5">Desk Operating Hours:</span>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    24 Hours / 7 Days a Week
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500 leading-relaxed">
                Changes saved here will automatically sync across the Navbar, Footer, Contact Page, and Room Booking Enquiry widgets.
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
