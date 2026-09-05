import { apiClient, ApiResponse } from '@/lib/api-client';
import {
  BackupHistoryResponse,
  BackupLogsResponse,
  BackupRecord,
  DownloadUrlResponse,
} from '@/lib/types/backup';

export const BackupService = {
  async getHistory(page = 1, limit = 20): Promise<ApiResponse<BackupHistoryResponse>> {
    return apiClient.get<BackupHistoryResponse>('/api/v1/admin/backups', { page, limit });
  },

  async triggerBackup(): Promise<ApiResponse<BackupRecord>> {
    return apiClient.post<BackupRecord>('/api/v1/admin/backups/trigger', {});
  },

  async getLogs(page = 1, limit = 50): Promise<ApiResponse<BackupLogsResponse>> {
    return apiClient.get<BackupLogsResponse>('/api/v1/admin/backups/logs', { page, limit });
  },

  async getDownloadUrl(
    backupId: string,
    fileType: 'schema' | 'data',
  ): Promise<ApiResponse<DownloadUrlResponse>> {
    return apiClient.get<DownloadUrlResponse>(
      `/api/v1/admin/backups/${backupId}/download-url/${fileType}`,
    );
  },
};
