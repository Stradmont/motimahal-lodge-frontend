import { apiClient, ApiResponse } from '@/lib/api-client';
import { ContactSettings } from '@/lib/contact-settings';

/**
 * Public Settings Service
 * Handles public website settings retrieval (phone, email, address, hours, maps, social links)
 */
export const PublicSettingsService = {
  async getContactSettings(): Promise<ApiResponse<ContactSettings>> {
    return apiClient.get<ContactSettings>('/api/v1/public/settings');
  },
};

/**
 * Admin Settings Service
 * Handles administrative updating of contact and lodge settings
 */
export const AdminSettingsService = {
  async getContactSettings(): Promise<ApiResponse<ContactSettings>> {
    return apiClient.get<ContactSettings>('/api/v1/public/settings');
  },

  async updateContactSettings(input: ContactSettings): Promise<ApiResponse<ContactSettings>> {
    return apiClient.put<ContactSettings>('/api/v1/admin/settings/contact', input);
  },
};

/**
 * Legacy export for backward compatibility
 */
export const SettingsService = PublicSettingsService;
