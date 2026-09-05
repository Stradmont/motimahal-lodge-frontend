import { apiClient, ApiResponse } from '@/lib/api-client';
import { ContactSettings } from '@/lib/contact-settings';

export const SettingsService = {
  async getContactSettings(): Promise<ApiResponse<ContactSettings>> {
    return apiClient.get<ContactSettings>('/api/v1/public/settings');
  },

  async updateContactSettings(input: ContactSettings): Promise<ApiResponse<ContactSettings>> {
    return apiClient.put<ContactSettings>('/api/v1/admin/settings/contact', input);
  },
};
