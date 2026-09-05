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
  ShieldCheck,
  Search,
  Eye,
  Loader2,
  Server,
  Terminal,
} from 'lucide-react';
import { BackupService } from '@/lib/services/backup.service';
import {
  BackupHistoryResponse,
  BackupLog,
  BackupLogsResponse,
  BackupRecord,
} from '@/lib/types/backup';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

  // Downloading file state per backup ID & type
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);

  // Selected item for modals
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
      toast.info('Initiating database backup... pg_dump and R2 upload in progress.', {
        duration: 4000,
      });

      const res = await BackupService.triggerBackup();
      if (res.success && res.data) {
        toast.success(`Backup completed successfully for ${res.data.dateFolder}!`);
        loadHistory(1);
        setHistoryPage(1);
      } else {
        toast.error(res.message || 'Manual backup execution failed');
        loadHistory(historyPage);
      }
    } catch (err: any) {
      toast.error(err?.message || 'Backup trigger failed. Check logs for details.');
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
        toast.success(`Download URL generated for ${res.data.fileName}. Downloading...`);
        // Trigger browser download safely
        const link = document.createElement('a');
        link.href = res.data.downloadUrl;
        link.download = res.data.fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        toast.error(res.message || 'Failed to generate download URL');
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
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2.5">
            <Database className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            Database Backup Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Automated PostgreSQL dumps (`schema.sql` & `data.sql`) stored securely on Cloudflare R2 object storage with full audit logging.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => (activeTab === 'records' ? loadHistory(historyPage) : loadLogs(logsPage))}
            disabled={historyLoading || logsLoading || isTriggering}
            className="cursor-pointer gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${historyLoading || logsLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            onClick={handleTriggerBackup}
            disabled={isTriggering}
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold cursor-pointer shadow-sm gap-2"
          >
            {isTriggering ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Executing Backup...
              </>
            ) : (
              <>
                <Database className="w-4 h-4" />
                Trigger Backup Now
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Latest Status */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Latest Backup
            </CardTitle>
            <Server className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent className="p-4 pt-1 space-y-1">
            {latest ? (
              <>
                <div className="flex items-center gap-2">
                  {latest.status === 'SUCCESS' && (
                    <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 font-semibold">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Success
                    </Badge>
                  )}
                  {latest.status === 'FAILED' && (
                    <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/20 font-semibold">
                      <XCircle className="w-3 h-3 mr-1" /> Failed
                    </Badge>
                  )}
                  {latest.status === 'RUNNING' && (
                    <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20 font-semibold animate-pulse">
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Running
                    </Badge>
                  )}
                  <span className="text-xs text-slate-500">{latest.dateFolder}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                  Triggered by: <span className="font-medium text-slate-700 dark:text-slate-300">{latest.triggeredByName}</span>
                </p>
              </>
            ) : (
              <p className="text-sm text-slate-400 font-medium">No backups recorded yet</p>
            )}
          </CardContent>
        </Card>

        {/* Total Backups */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Executions
            </CardTitle>
            <HardDrive className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {stats?.totalBackups ?? 0}
            </div>
            <p className="text-xs text-slate-500 mt-1">Total backup operations</p>
          </CardContent>
        </Card>

        {/* Successful Count */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Successful
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {stats?.totalSuccess ?? 0}
            </div>
            <p className="text-xs text-slate-500 mt-1">Uploaded & verified on R2</p>
          </CardContent>
        </Card>

        {/* Failed Count */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              Failed
            </CardTitle>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
              {stats?.totalFailed ?? 0}
            </div>
            <p className="text-xs text-slate-500 mt-1">Failures logged with stack trace</p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('records')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'records'
              ? 'border-amber-600 text-amber-600 dark:text-amber-400 dark:border-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          Backup Records & Downloads
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'logs'
              ? 'border-amber-600 text-amber-600 dark:text-amber-400 dark:border-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Terminal className="w-4 h-4" />
          Database Audit Logs
        </button>
      </div>

      {/* Tab 1: Backup Records & Downloads */}
      {activeTab === 'records' && (
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <CardHeader className="p-4 pb-3 border-b border-slate-200 dark:border-slate-800">
            <CardTitle className="text-base font-semibold">Backup History & Download Files</CardTitle>
            <CardDescription className="text-xs">
              Every manual or scheduled backup produces authenticated `schema.sql` & `data.sql` files stored on R2 CDN.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {historyLoading ? (
              <div className="p-12 flex items-center justify-center gap-2 text-slate-500 text-sm">
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading backup history...
              </div>
            ) : !historyData?.items || historyData.items.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-sm">
                No backup records found in database. Click "Trigger Backup Now" to create your first backup.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200 dark:border-slate-800">
                    <TableHead className="w-[160px]">Date / Folder</TableHead>
                    <TableHead>Trigger Source</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Dump Sizes</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="text-right">Actions / Downloads</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyData.items.map((record) => {
                    const isDownloadingSchema = downloadingKey === `${record.id}-schema`;
                    const isDownloadingData = downloadingKey === `${record.id}-data`;

                    return (
                      <TableRow key={record.id} className="border-slate-200 dark:border-slate-800">
                        <TableCell className="font-mono text-xs font-semibold">
                          <div>{record.dateFolder}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{formatDate(record.createdAt)}</div>
                        </TableCell>
                        <TableCell className="text-xs">
                          <div className="flex items-center gap-1.5">
                            {record.triggerSource === 'CRON' ? (
                              <Badge variant="outline" className="bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20 text-[11px]">
                                <Clock className="w-3 h-3 mr-1" /> CRON
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20 text-[11px]">
                                <UserCheck className="w-3 h-3 mr-1" /> MANUAL
                              </Badge>
                            )}
                            <span className="text-slate-600 dark:text-slate-400 font-medium">{record.triggeredByName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {record.status === 'SUCCESS' && (
                            <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20">
                              <CheckCircle2 className="w-3 h-3 mr-1" /> SUCCESS
                            </Badge>
                          )}
                          {record.status === 'FAILED' && (
                            <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/20">
                              <XCircle className="w-3 h-3 mr-1" /> FAILED
                            </Badge>
                          )}
                          {record.status === 'RUNNING' && (
                            <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20 animate-pulse">
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" /> RUNNING
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-slate-600 dark:text-slate-400">
                          {record.status === 'SUCCESS' ? (
                            <div className="space-y-0.5 font-mono text-[11px]">
                              <div>Schema: <span className="font-semibold text-slate-800 dark:text-slate-200">{formatBytes(record.schemaSize)}</span></div>
                              <div>Data: <span className="font-semibold text-slate-800 dark:text-slate-200">{formatBytes(record.dataSize)}</span></div>
                            </div>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-slate-500 font-mono">
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
                                  className="h-8 text-xs gap-1.5 cursor-pointer"
                                  title="Download schema.sql"
                                >
                                  {isDownloadingSchema ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <FileCode className="w-3.5 h-3.5 text-blue-500" />
                                  )}
                                  Schema
                                </Button>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDownload(record.id, 'data')}
                                  disabled={!!downloadingKey}
                                  className="h-8 text-xs gap-1.5 cursor-pointer"
                                  title="Download data.sql"
                                >
                                  {isDownloadingData ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Download className="w-3.5 h-3.5 text-emerald-500" />
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
                                className="h-8 text-xs gap-1.5 text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900/50 dark:hover:bg-rose-950/30 cursor-pointer"
                              >
                                <AlertTriangle className="w-3.5 h-3.5" />
                                Error Trace
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
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500">
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
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Database Audit Logs */}
      {activeTab === 'logs' && (
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <CardHeader className="p-4 pb-3 border-b border-slate-200 dark:border-slate-800">
            <CardTitle className="text-base font-semibold">Persistent Database Audit Logs</CardTitle>
            <CardDescription className="text-xs">
              Immutable audit trail recording every trigger event, status transition, cron execution, and file download by Admin users.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {logsLoading ? (
              <div className="p-12 flex items-center justify-center gap-2 text-slate-500 text-sm">
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading audit logs from database...
              </div>
            ) : !logsData?.items || logsData.items.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-sm">
                No audit log entries recorded in database.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200 dark:border-slate-800">
                    <TableHead className="w-[170px]">Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Actor</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead className="text-right">Metadata / Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logsData.items.map((log) => (
                    <TableRow key={log.id} className="border-slate-200 dark:border-slate-800">
                      <TableCell className="font-mono text-xs text-slate-500">
                        {formatDate(log.createdAt)}
                      </TableCell>
                      <TableCell>
                        {log.action === 'BACKUP_STARTED' && (
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20 text-[11px]">
                            BACKUP_STARTED
                          </Badge>
                        )}
                        {log.action === 'BACKUP_COMPLETED' && (
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 text-[11px]">
                            BACKUP_COMPLETED
                          </Badge>
                        )}
                        {log.action === 'BACKUP_FAILED' && (
                          <Badge variant="outline" className="bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20 text-[11px]">
                            BACKUP_FAILED
                          </Badge>
                        )}
                        {log.action === 'FILE_DOWNLOADED' && (
                          <Badge variant="outline" className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20 text-[11px]">
                            FILE_DOWNLOADED
                          </Badge>
                        )}
                        {log.action === 'CRON_SCHEDULED' && (
                          <Badge variant="outline" className="bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20 text-[11px]">
                            CRON_SCHEDULED
                          </Badge>
                        )}
                        {log.action === 'CRON_EXECUTED' && (
                          <Badge variant="outline" className="bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20 text-[11px]">
                            CRON_EXECUTED
                          </Badge>
                        )}
                        {log.action === 'CRON_FAILED' && (
                          <Badge variant="outline" className="bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20 text-[11px]">
                            CRON_FAILED
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs font-medium text-slate-700 dark:text-slate-300">
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
                          className="h-7 text-xs gap-1 cursor-pointer text-slate-600 dark:text-slate-400 hover:text-slate-900"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {/* Pagination */}
            {logsData && logsData.totalPages > 1 && (
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500">
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
          </CardContent>
        </Card>
      )}

      {/* Error Trace Modal */}
      <Dialog open={!!selectedRecordError} onOpenChange={() => setSelectedRecordError(null)}>
        <DialogContent className="max-w-2xl bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Backup Error Diagnostics — {selectedRecordError?.dateFolder}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Detailed failure logs recorded when pg_dump or Cloudflare R2 upload encountered an error.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Error Summary
              </label>
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 rounded-md border border-rose-200 dark:border-rose-900/50 text-xs font-mono font-medium whitespace-pre-wrap">
                {selectedRecordError?.errorMessage || 'No error message available'}
              </div>
            </div>

            {selectedRecordError?.errorStack && (
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Stack Trace
                </label>
                <pre className="p-3 bg-slate-900 text-slate-100 rounded-md text-[11px] font-mono overflow-x-auto max-h-60 leading-relaxed">
                  {selectedRecordError.errorStack}
                </pre>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Log Details Modal */}
      <Dialog open={!!selectedLogDetails} onOpenChange={() => setSelectedLogDetails(null)}>
        <DialogContent className="max-w-xl bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Terminal className="w-5 h-5 text-amber-600" />
              Audit Log Entry Details
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Full payload metadata recorded in `backup_logs` database table.
            </DialogDescription>
          </DialogHeader>

          {selectedLogDetails && (
            <div className="space-y-3 py-2 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[11px]">Action</span>
                  <span className="font-semibold">{selectedLogDetails.action}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Actor</span>
                  <span className="font-semibold">{selectedLogDetails.actor}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Timestamp</span>
                  <span className="font-mono">{formatDate(selectedLogDetails.createdAt)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">IP Address</span>
                  <span className="font-mono">{selectedLogDetails.ipAddress || 'N/A'}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  User Agent
                </label>
                <div className="p-2 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded text-[11px] font-mono break-all">
                  {selectedLogDetails.userAgent || 'N/A'}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  JSON Metadata / Details
                </label>
                <pre className="p-3 bg-slate-900 text-emerald-400 rounded-md text-[11px] font-mono overflow-x-auto max-h-60 leading-relaxed">
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
