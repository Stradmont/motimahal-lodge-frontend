'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Pencil,
  RefreshCw,
  Trash2,
  Loader2,
  Upload,
  AlertTriangle,
  Info,
  Building2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AdminInput as Input } from '@/components/admin/common/AdminInput';
import { Badge } from '@/components/ui/badge';
import { MediaItem, MediaDocumentType, MediaUsageRef } from '@/lib/types/media';
import { updateMediaMetadataApi, replaceMediaFileApi, checkMediaUsage } from '@/lib/api/media';

interface EditMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: MediaItem | null;
  onUpdated: (updatedMedia: MediaItem) => void;
  onDeleteRequested: (media: MediaItem) => void;
}

export default function EditMediaModal({
  isOpen,
  onClose,
  media,
  onUpdated,
  onDeleteRequested,
}: EditMediaModalProps) {
  const [activeTab, setActiveTab] = useState<'metadata' | 'replace'>('metadata');
  
  // Metadata form states
  const [name, setName] = useState('');
  const [originalFileName, setOriginalFileName] = useState('');
  const [isSavingMetadata, setIsSavingMetadata] = useState(false);

  // Replace file states
  const [replacementFile, setReplacementFile] = useState<File | null>(null);
  const [isReplacingFile, setIsReplacingFile] = useState(false);
  const [showReplaceConfirm, setShowReplaceConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Usage refs
  const [usageRefs, setUsageRefs] = useState<MediaUsageRef[]>([]);

  useEffect(() => {
    if (media) {
      setName(media.name || '');
      setOriginalFileName(media.originalFileName || '');
      setReplacementFile(null);
      setShowReplaceConfirm(false);
      setActiveTab('metadata');
      setUsageRefs(checkMediaUsage(media));
    }
  }, [media]);

  if (!media) return null;

  const handleSaveMetadata = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Asset name is required');
      return;
    }

    setIsSavingMetadata(true);
    try {
      const updated = await updateMediaMetadataApi(media.id, {
        name,
        originalFileName,
      });
      toast.success('Media metadata updated');
      onUpdated(updated);
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update media metadata';
      toast.error(message);
    } finally {
      setIsSavingMetadata(false);
    }
  };

  const handleReplaceFile = async () => {
    if (!replacementFile) {
      toast.error('Please select a replacement file first');
      return;
    }

    setIsReplacingFile(true);
    try {
      const updated = await replaceMediaFileApi(media.id, replacementFile);
      toast.success(`Media file replaced successfully for ${updated.name}`);
      onUpdated(updated);
      setShowReplaceConfirm(false);
      setReplacementFile(null);
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to replace media file';
      toast.error(message);
    } finally {
      setIsReplacingFile(false);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSavingMetadata && !isReplacingFile && onClose()} size="3xl">
      <DialogHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
              Edit Media Asset
            </DialogTitle>
            <Badge variant="outline" className="text-[10px] font-mono">
              {media.id}
            </Badge>
          </div>
          <Badge variant="secondary" className="text-xs">
            {media.documentType}
          </Badge>
        </div>
        <DialogDescription className="text-xs text-slate-500 mt-0.5">
          Update asset metadata attributes or replace the underlying media file while preserving references.
        </DialogDescription>
      </DialogHeader>

      {/* Tab Selector Bar */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 shrink-0 bg-white dark:bg-slate-950">
        <button
          type="button"
          onClick={() => setActiveTab('metadata')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'metadata'
              ? 'border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Pencil className="w-3.5 h-3.5 inline mr-1.5" />
          Metadata & Details
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('replace')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'replace'
              ? 'border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5 inline mr-1.5" />
          Replace Media File
        </button>
      </div>

      {/* Tab 1: Metadata Form & Information */}
      {activeTab === 'metadata' && (
        <form onSubmit={handleSaveMetadata} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <DialogBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Media Preview Box */}
              <div className="md:col-span-1 space-y-2">
                <div className="relative aspect-square rounded-md border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden flex items-center justify-center">
                  {media.documentType === MediaDocumentType.IMAGE ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={media.url} alt={media.name} className="max-h-full max-w-full object-contain" />
                  ) : (
                    <video src={media.url} controls className="max-h-full max-w-full" />
                  )}
                </div>

                <div className="p-2.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-[11px] font-mono space-y-1 text-slate-600 dark:text-slate-400">
                  <p>Format: {media.mimeType}</p>
                  <p>Size: {formatFileSize(media.sizeBytes)}</p>
                  {media.widthPx && <p>Dimensions: {media.widthPx}x{media.heightPx} px</p>}
                </div>
              </div>

              {/* Editable Fields */}
              <div className="md:col-span-2 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Asset Title / Display Name <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    placeholder="e.g. riverfront-suite-master"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Original File Name
                  </label>
                  <Input
                    type="text"
                    value={originalFileName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOriginalFileName(e.target.value)}
                    placeholder="Original filename..."
                  />
                </div>

                {/* Active Usage List */}
                {usageRefs.length > 0 && (
                  <div className="p-2.5 rounded border border-amber-200 dark:border-amber-950/60 bg-amber-50/50 dark:bg-amber-950/20 text-xs text-amber-800 dark:text-amber-300 space-y-1">
                    <p className="font-semibold flex items-center gap-1 text-xs">
                      <Building2 className="w-3.5 h-3.5 text-amber-600" />
                      Active References ({usageRefs.length})
                    </p>
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {usageRefs.map((r, idx) => (
                        <Badge key={idx} variant="outline" className="text-[10px] bg-white dark:bg-slate-900">
                          {r.entityType}: {r.entityTitle}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DialogBody>

          <DialogFooter className="flex items-center justify-between">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => {
                onClose();
                onDeleteRequested(media);
              }}
              title="Delete media asset"
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSavingMetadata}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSavingMetadata}>
                {isSavingMetadata ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Metadata'
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      )}

      {/* Tab 2: Replace Media File */}
      {activeTab === 'replace' && (
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <DialogBody className="space-y-4">
            <div className="p-3 rounded border border-blue-200 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 text-xs text-blue-900 dark:text-blue-200 space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                Preserve Asset Identity & References
              </p>
              <p className="text-[11px] leading-relaxed text-blue-800/90 dark:text-blue-300/90">
                Replacing this media file will update the actual image/video file associated with <strong>ID: {media.id}</strong>. All connected rooms, gallery showcases, and website pages using this Media item will automatically display the updated file.
              </p>
            </div>

            {/* Drag & Drop File Selector */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 0) setReplacementFile(files[0]);
              }}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-36 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-500 rounded-md bg-slate-50/60 dark:bg-slate-900/40 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors p-4 text-center"
            >
              <Upload className="w-6 h-6 text-slate-400" />
              {replacementFile ? (
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Selected Replacement: {replacementFile.name}
                  </p>
                  <p className="text-[11px] font-mono text-slate-500">
                    {formatFileSize(replacementFile.size)} • {replacementFile.type}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Click to select new replacement file
                  </p>
                  <p className="text-[11px] text-slate-500">Supports JPG, PNG, WEBP, MP4 (max 10MB)</p>
                </div>
              )}
            </div>

            {/* Confirmation Box when file selected */}
            {replacementFile && !showReplaceConfirm && (
              <div className="flex items-center justify-between p-3 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-xs">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">Ready to replace file</span>
                  <p className="text-[11px] text-slate-500">
                    Will replace {media.originalFileName} with {replacementFile.name}
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setShowReplaceConfirm(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                  Proceed to Replace
                </Button>
              </div>
            )}

            {showReplaceConfirm && (
              <div className="p-3 rounded border border-amber-300 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 space-y-2 text-xs">
                <div className="flex items-start gap-2 text-amber-900 dark:text-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Confirm File Replacement</span>
                    <p className="text-[11px] text-amber-800 dark:text-amber-300">
                      Are you sure you want to replace this file? The existing image will be overwritten for all linked rooms and gallery items.
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowReplaceConfirm(false)}
                    disabled={isReplacingFile}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleReplaceFile}
                    disabled={isReplacingFile}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    {isReplacingFile ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                        Replacing File...
                      </>
                    ) : (
                      'Confirm Replace File'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogBody>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isReplacingFile}>
              Cancel
            </Button>
          </DialogFooter>
        </div>
      )}
    </Dialog>
  );
}
