export type BackupTriggerSource = 'MANUAL' | 'CRON';
export type BackupTriggeredBy = 'SYSTEM_CRON' | 'ADMIN_USER' | 'CLI_SCRIPT';
export type BackupStatus = 'RUNNING' | 'SUCCESS' | 'FAILED';

export type BackupAction =
  | 'BACKUP_TRIGGERED'
  | 'BACKUP_STARTED'
  | 'BACKUP_COMPLETED'
  | 'BACKUP_FAILED'
  | 'FILE_DOWNLOADED'
  | 'CRON_SCHEDULED'
  | 'CRON_EXECUTED'
  | 'CRON_FAILED';

export interface BackupRecord {
  id: string;
  triggerSource: BackupTriggerSource;
  triggeredById?: string;
  triggeredByName: BackupTriggeredBy;
  status: BackupStatus;
  dateFolder: string;
  schemaKey?: string;
  dataKey?: string;
  schemaSize?: number;
  dataSize?: number;
  durationMs?: number;
  startedAt: string;
  completedAt?: string;
  errorMessage?: string;
  errorStack?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface BackupLog {
  id: string;
  backupRecordId?: string;
  backupRecord?: BackupRecord;
  action: BackupAction;
  actor: string;
  actorId?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
  createdAt: string;
}

export interface BackupStats {
  totalBackups: number;
  totalSuccess: number;
  totalFailed: number;
  latestBackup?: BackupRecord | null;
}

export interface BackupHistoryResponse {
  items: BackupRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: BackupStats;
}

export interface BackupLogsResponse {
  items: BackupLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DownloadUrlResponse {
  downloadUrl: string;
  fileName: string;
  size: number;
}
