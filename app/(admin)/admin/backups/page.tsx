'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Database,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  HardDrive,
  FileCode,
  FileText,
  UserCheck,
  Eye,
  Loader2,
  Terminal,
} from 'lucide-react';
import AdminPageHeader from '@/components/admin/layout/AdminPageHeader';
import { BackupService } from '@/lib/services/backup.service';
import {
  BackupHistoryResponse,
  BackupLog,
  BackupLogsResponse,
  BackupRecord,
} from '@/lib/types/backup';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

function formatBytes(bytes?: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return 'N/A';
  try {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

export default function AdminBackupsPage() {
  const [activeTab, setActiveTab] = useState<'records' | 'logs'>('records');

  // History state
  const [historyData, setHistoryData] = useState<BackupHistoryResponse | null>(null);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyPage, setHistoryPage] = useState(1);

  // Logs state
  const [logsData, setLogsData] = useState<BackupLogsResponse | null>(null);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsPage, setLogsPage] = useState(1);

  // Triggering backup state
  const [isTriggering, setIsTriggering] = useState(false);

  // Downloading file state
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);

  // Modals state
  const [selectedRecordError, setSelectedRecordError] = useState<BackupRecord | null>(null);
  const [selectedLogDetails, setSelectedLogDetails] = useState<BackupLog | null>(null);

  // Load history data
  const loadHistory = useCallback(async (page = 1) => {
    try {
      setHistoryLoading(true);
      const res = await BackupService.getHistory(page, 20);
      if (res.success && res.data) {
        setHistoryData(res.data);
      } else {
        toast.error(res.message || 'Failed to fetch backup history');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error fetching backup history');
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  // Load logs data
  const loadLogs = useCallback(async (page = 1) => {
    try {
      setLogsLoading(true);
      const res = await BackupService.getLogs(page, 50);
      if (res.success && res.data) {
        setLogsData(res.data);
      } else {
        toast.error(res.message || 'Failed to fetch backup audit logs');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error fetching audit logs');
    } finally {
      setLogsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'records') {
      loadHistory(historyPage);
    } else {
      loadLogs(logsPage);
    }
  }, [activeTab, historyPage, logsPage, loadHistory, loadLogs]);

  // Handle manual backup trigger
  const handleTriggerBackup = async () => {
    try {
      setIsTriggering(true);
      toast.info('Starting database dump & Cloudflare R2 upload...');

      const res = await BackupService.triggerBackup();
      if (res.success && res.data) {
        toast.success(`Backup completed for ${res.data.dateFolder}`);
        loadHistory(1);
        setHistoryPage(1);
      } else {
        toast.error(res.message || 'Backup execution failed');
        loadHistory(historyPage);
      }
    } catch (err: any) {
      toast.error(err?.message || 'Backup trigger failed');
      loadHistory(historyPage);
    } finally {
      setIsTriggering(false);
    }
  };

  // Handle authenticated download
  const handleDownload = async (backupId: string, fileType: 'schema' | 'data') => {
    const key = `${backupId}-${fileType}`;
    try {
      setDownloadingKey(key);
      const res = await BackupService.getDownloadUrl(backupId, fileType);
      if (res.success && res.data) {
        toast.success(`Downloading ${res.data.fileName}...`);
        const link = document.createElement('a');
        link.href = res.data.downloadUrl;
        link.download = res.data.fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        toast.error(res.message || 'Failed to generate download link');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Download request failed');
    } finally {
      setDownloadingKey(null);
    }
  };

  const stats = historyData?.stats;
  const latest = stats?.latestBackup;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        title="Database Backups"
        description="Manage database backups, execute manual dumps, and view audit history."
        action={
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => (activeTab === 'records' ? loadHistory(historyPage) : loadLogs(logsPage))}
              disabled={historyLoading || logsLoading || isTriggering}
              className="h-9 cursor-pointer gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${historyLoading || logsLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            <Button
              size="sm"
              onClick={handleTriggerBackup}
              disabled={isTriggering}
              className="h-9 bg-amber-600 hover:bg-amber-700 text-white font-medium cursor-pointer gap-2"
            >
              {isTriggering ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Backing up...
                </>
              ) : (
                <>
                  <Database className="w-3.5 h-3.5" />
                  Run Backup
                </>
              )}
            </Button>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Latest Backup Status */}
        <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Latest Status</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2.5 flex items-center justify-between">
            {latest ? (
              <>
                <div className="flex items-center gap-2">
                  {latest.status === 'SUCCESS' && (
                    <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Success
                    </Badge>
                  )}
                  {latest.status === 'FAILED' && (
                    <Badge className="bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-800">
                      <XCircle className="w-3 h-3 mr-1" /> Failed
                    </Badge>
                  )}
                  {latest.status === 'RUNNING' && (
                    <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-800 animate-pulse">
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Running
                    </Badge>
                  )}
                </div>
                <span className="text-xs font-mono text-slate-600 dark:text-slate-400">{latest.dateFolder}</span>
              </>
            ) : (
              <span className="text-xs text-slate-400 font-medium">None</span>
            )}
          </div>
        </div>

        {/* Total Executions */}
        <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Backups</span>
            <HardDrive className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats?.totalBackups ?? 0}</span>
            <span className="text-xs text-slate-500">records</span>
          </div>
        </div>

        {/* Successful */}
        <div className="p-4 rounded-lg border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Successful</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{stats?.totalSuccess ?? 0}</span>
            <span className="text-xs text-emerald-600/80 dark:text-emerald-400/80">stored on R2</span>
          </div>
        </div>

        {/* Failed */}
        <div className="p-4 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-400">Failed</span>
            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-rose-700 dark:text-rose-400">{stats?.totalFailed ?? 0}</span>
            <span className="text-xs text-rose-600/80 dark:text-rose-400/80">errors logged</span>
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('records')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'records'
              ? 'border-amber-600 text-amber-700 dark:text-amber-400 dark:border-amber-400 font-bold'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          Backup Records
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'logs'
              ? 'border-amber-600 text-amber-700 dark:text-amber-400 dark:border-amber-400 font-bold'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Terminal className="w-4 h-4" />
          Audit Logs
        </button>
      </div>

      {/* Tab 1: Backup Records */}
      {activeTab === 'records' && (
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
          {historyLoading ? (
            <div className="p-10 flex items-center justify-center gap-2 text-slate-500 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
              Loading records...
            </div>
          ) : !historyData?.items || historyData.items.length === 0 ? (
            <div className="p-10 text-center text-slate-500 text-xs">
              No backup records available. Click "Run Backup" to generate a database snapshot.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800">
                  <TableHead className="w-[170px] text-xs font-bold text-slate-700 dark:text-slate-300">Date / Folder</TableHead>
                  <TableHead className="text-xs font-bold text-slate-700 dark:text-slate-300">Source</TableHead>
                  <TableHead className="text-xs font-bold text-slate-700 dark:text-slate-300">Status</TableHead>
                  <TableHead className="text-xs font-bold text-slate-700 dark:text-slate-300">Sizes</TableHead>
                  <TableHead className="text-xs font-bold text-slate-700 dark:text-slate-300">Duration</TableHead>
                  <TableHead className="text-right text-xs font-bold text-slate-700 dark:text-slate-300">Downloads</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historyData.items.map((record) => {
                  const isDownloadingSchema = downloadingKey === `${record.id}-schema`;
                  const isDownloadingData = downloadingKey === `${record.id}-data`;

                  return (
                    <TableRow key={record.id} className="border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                      <TableCell className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                        <div>{record.dateFolder}</div>
                        <div className="text-[11px] text-slate-500 font-normal">{formatDate(record.createdAt)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {record.triggerSource === 'CRON' ? (
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800 text-[11px]">
                              <Clock className="w-3 h-3 mr-1" /> CRON
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800 text-[11px]">
                              <UserCheck className="w-3 h-3 mr-1" /> MANUAL
                            </Badge>
                          )}
                          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">{record.triggeredByName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {record.status === 'SUCCESS' && (
                          <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> SUCCESS
                          </Badge>
                        )}
                        {record.status === 'FAILED' && (
                          <Badge className="bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-800">
                            <XCircle className="w-3 h-3 mr-1" /> FAILED
                          </Badge>
                        )}
                        {record.status === 'RUNNING' && (
                          <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-800 animate-pulse">
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" /> RUNNING
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-slate-700 dark:text-slate-300 font-mono">
                        {record.status === 'SUCCESS' ? (
                          <div className="space-y-0.5">
                            <div>Schema: <span className="font-semibold text-slate-900 dark:text-slate-100">{formatBytes(record.schemaSize)}</span></div>
                            <div>Data: <span className="font-semibold text-slate-900 dark:text-slate-100">{formatBytes(record.dataSize)}</span></div>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                        {record.durationMs ? `${(record.durationMs / 1000).toFixed(2)}s` : '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {record.status === 'SUCCESS' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownload(record.id, 'schema')}
                                disabled={!!downloadingKey}
                                className="h-7 text-xs gap-1.5 cursor-pointer bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                              >
                                {isDownloadingSchema ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <FileCode className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                )}
                                Schema
                              </Button>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownload(record.id, 'data')}
                                disabled={!!downloadingKey}
                                className="h-7 text-xs gap-1.5 cursor-pointer bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                              >
                                {isDownloadingData ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                )}
                                Data
                              </Button>
                            </>
                          )}

                          {record.status === 'FAILED' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedRecordError(record)}
                              className="h-7 text-xs gap-1.5 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                            >
                              <AlertTriangle className="w-3.5 h-3.5" />
                              View Error
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {historyData && historyData.totalPages > 1 && (
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs bg-slate-50/50 dark:bg-slate-900/50">
              <span className="text-slate-500 font-medium">
                Page {historyData.page} of {historyData.totalPages} ({historyData.total} items)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                  disabled={historyPage === 1 || historyLoading}
                  className="h-7 text-xs cursor-pointer"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setHistoryPage((p) => Math.min(historyData.totalPages, p + 1))}
                  disabled={historyPage >= historyData.totalPages || historyLoading}
                  className="h-7 text-xs cursor-pointer"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Audit Logs */}
      {activeTab === 'logs' && (
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
          {logsLoading ? (
            <div className="p-10 flex items-center justify-center gap-2 text-slate-500 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
              Loading audit logs...
            </div>
          ) : !logsData?.items || logsData.items.length === 0 ? (
            <div className="p-10 text-center text-slate-500 text-xs">
              No audit logs available.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800">
                  <TableHead className="w-[180px] text-xs font-bold text-slate-700 dark:text-slate-300">Timestamp</TableHead>
                  <TableHead className="text-xs font-bold text-slate-700 dark:text-slate-300">Action</TableHead>
                  <TableHead className="text-xs font-bold text-slate-700 dark:text-slate-300">Actor</TableHead>
                  <TableHead className="text-xs font-bold text-slate-700 dark:text-slate-300">IP Address</TableHead>
                  <TableHead className="text-right text-xs font-bold text-slate-700 dark:text-slate-300">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logsData.items.map((log) => (
                  <TableRow key={log.id} className="border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                    <TableCell className="font-mono text-xs text-slate-600 dark:text-slate-400">
                      {formatDate(log.createdAt)}
                    </TableCell>
                    <TableCell>
                      {log.action === 'BACKUP_STARTED' && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800 text-[11px]">
                          BACKUP_STARTED
                        </Badge>
                      )}
                      {log.action === 'BACKUP_COMPLETED' && (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-[11px]">
                          BACKUP_COMPLETED
                        </Badge>
                      )}
                      {log.action === 'BACKUP_FAILED' && (
                        <Badge variant="outline" className="bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800 text-[11px]">
                          BACKUP_FAILED
                        </Badge>
                      )}
                      {log.action === 'FILE_DOWNLOADED' && (
                        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 text-[11px]">
                          FILE_DOWNLOADED
                        </Badge>
                      )}
                      {log.action === 'CRON_SCHEDULED' && (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800 text-[11px]">
                          CRON_SCHEDULED
                        </Badge>
                      )}
                      {log.action === 'CRON_EXECUTED' && (
                        <Badge variant="outline" className="bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 border-teal-200 dark:border-teal-800 text-[11px]">
                          CRON_EXECUTED
                        </Badge>
                      )}
                      {log.action === 'CRON_FAILED' && (
                        <Badge variant="outline" className="bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800 text-[11px]">
                          CRON_FAILED
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {log.actor}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-500">
                      {log.ipAddress || '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLogDetails(log)}
                        className="h-7 text-xs gap-1 cursor-pointer text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {logsData && logsData.totalPages > 1 && (
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs bg-slate-50/50 dark:bg-slate-900/50">
              <span className="text-slate-500 font-medium">
                Page {logsData.page} of {logsData.totalPages} ({logsData.total} logs)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLogsPage((p) => Math.max(1, p - 1))}
                  disabled={logsPage === 1 || logsLoading}
                  className="h-7 text-xs cursor-pointer"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLogsPage((p) => Math.min(logsData.totalPages, p + 1))}
                  disabled={logsPage >= logsData.totalPages || logsLoading}
                  className="h-7 text-xs cursor-pointer"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Trace Modal */}
      <Dialog open={!!selectedRecordError} onOpenChange={() => setSelectedRecordError(null)}>
        <DialogContent className="max-w-2xl bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Backup Diagnostic Trace — {selectedRecordError?.dateFolder}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Error details captured during execution.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Error Message
              </span>
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 rounded border border-rose-200 dark:border-rose-900/50 text-xs font-mono font-medium whitespace-pre-wrap">
                {selectedRecordError?.errorMessage || 'No error message recorded'}
              </div>
            </div>

            {selectedRecordError?.errorStack && (
              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Stack Trace
                </span>
                <pre className="p-3 bg-slate-950 text-slate-200 rounded text-[11px] font-mono overflow-x-auto max-h-56 leading-relaxed border border-slate-800">
                  {selectedRecordError.errorStack}
                </pre>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Log Details Modal */}
      <Dialog open={!!selectedLogDetails} onOpenChange={() => setSelectedLogDetails(null)}>
        <DialogContent className="max-w-lg bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-600" />
              Audit Log Details
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Payload metadata for action: {selectedLogDetails?.action}
            </DialogDescription>
          </DialogHeader>

          {selectedLogDetails && (
            <div className="space-y-3 py-1 text-xs">
              <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 dark:bg-slate-900/80 rounded border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[11px]">Action</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedLogDetails.action}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Actor</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedLogDetails.actor}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Timestamp</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{formatDate(selectedLogDetails.createdAt)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">IP Address</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{selectedLogDetails.ipAddress || '—'}</span>
                </div>
              </div>

              {selectedLogDetails.userAgent && (
                <div>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    User Agent
                  </span>
                  <div className="p-2 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded text-[11px] font-mono break-all border border-slate-200 dark:border-slate-800">
                    {selectedLogDetails.userAgent}
                  </div>
                </div>
              )}

              <div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Metadata Payload
                </span>
                <pre className="p-3 bg-slate-950 text-emerald-400 rounded text-[11px] font-mono overflow-x-auto max-h-56 leading-relaxed border border-slate-800">
                  {JSON.stringify(selectedLogDetails.details || {}, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
