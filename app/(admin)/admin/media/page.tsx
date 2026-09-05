'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Trash2,
  Copy,
  ExternalLink,
  Info,
  Loader2,
  Image as ImageIcon,
  Video,
  Building2,
  Eye,
  Pencil,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import AdminPageHeader from '@/components/admin/layout/AdminPageHeader';
import AdminFilterBar from '@/components/admin/layout/AdminFilterBar';
import ConfirmDeleteDialog from '@/components/admin/common/ConfirmDeleteDialog';
import FullMediaPreviewModal from '@/components/admin/common/FullMediaPreviewModal';
import EditMediaModal from '@/components/admin/media/EditMediaModal';
import { MediaItem, MediaDocumentType, MediaEntityType, MediaUsageRef } from '@/lib/types/media';
import { checkMediaUsage } from '@/lib/api/media';
import { useMedia } from '@/hooks/useMedia';

export default function AdminMediaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDocType, setFilterDocType] = useState<string>('ALL');

  const { mediaItems, isLoading, isUploading, uploadMedia, updateMedia, deleteMedia } = useMedia({
    documentType: filterDocType,
    search: searchTerm,
  });

  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);
  const [editMedia, setEditMedia] = useState<MediaItem | null>(null);
  const [deleteTargetMedia, setDeleteTargetMedia] = useState<MediaItem | null>(null);
  const [mediaUsageRefs, setMediaUsageRefs] = useState<MediaUsageRef[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedMedia) {
      const refs = checkMediaUsage(selectedMedia);
      setMediaUsageRefs(refs);
    } else {
      setMediaUsageRefs([]);
    }
  }, [selectedMedia]);

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds maximum limit of 10MB');
      return;
    }

    try {
      const docType: MediaDocumentType = file.type.startsWith('video/') ? MediaDocumentType.VIDEO : MediaDocumentType.IMAGE;
      const res = await uploadMedia(file, docType, MediaEntityType.GENERAL);
      if (res.success && res.data) {
        toast.success(res.message || `Uploaded ${res.data.originalFileName}`);
        setSelectedMedia(res.data);
      } else {
        toast.error(res.message || 'Failed to upload media file');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload media file');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Media URL copied to clipboard');
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetMedia) return;
    try {
      const res = await deleteMedia(deleteTargetMedia.id);
      if (res.success) {
        toast.success(res.message || `Media asset ${deleteTargetMedia.name} deleted`);
        if (selectedMedia?.id === deleteTargetMedia.id) {
          setSelectedMedia(null);
        }
      } else {
        toast.error(res.message || 'Failed to delete media asset');
      }
    } catch (err) {
      toast.error('Failed to delete media asset');
    } finally {
      setDeleteTargetMedia(null);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filterOptions = [
    { key: 'ALL', label: 'All Media Assets' },
    { key: MediaDocumentType.IMAGE, label: 'Images' },
    { key: MediaDocumentType.VIDEO, label: 'Videos' },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <AdminPageHeader
        title="Centralized Media Library"
        description="Single source of truth for lodge photography, room assets, and marketing media across the CMS."
        action={
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleUploadFile}
              className="hidden"
            />
            <Button
              size="sm"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  Upload Media
                </>
              )}
            </Button>
          </div>
        }
      />

      {/* Filter Bar */}
      <AdminFilterBar
        filterOptions={filterOptions}
        activeFilter={filterDocType}
        onFilterChange={setFilterDocType}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search asset name or file..."
      />

      {/* Visual Media Grid */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-md bg-white dark:bg-slate-950 p-4 min-h-[420px]">
        {isLoading ? (
          <div className="h-64 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
            <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
            <span>Fetching centralized media repository...</span>
          </div>
        ) : mediaItems.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center space-y-2 text-slate-500">
            <ImageIcon className="w-10 h-10 text-slate-300 dark:text-slate-700" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              No media assets found
            </p>
            <p className="text-xs text-slate-500 max-w-sm">
              Upload your first lodge photo or promotional video to use it in rooms, gallery, or website content.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2"
            >
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              Upload First Asset
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3.5">
            {mediaItems.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-square rounded-md border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-900 overflow-hidden cursor-pointer transition-all shadow-xs"
              >
                {item.documentType === MediaDocumentType.IMAGE ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1 bg-slate-900 p-2">
                    <Video className="w-7 h-7 text-slate-300" />
                    <span className="text-[10px] font-mono truncate w-full text-center text-slate-200">
                      {item.name}
                    </span>
                  </div>
                )}

                {/* Entity Category Badge at top-left */}
                <div className="absolute top-1.5 left-1.5 z-10 pointer-events-none">
                  <Badge variant="secondary" className="text-[9px] font-mono py-0 px-1 bg-slate-950/70 text-slate-200 border-none backdrop-blur-2xs">
                    {item.entityType}
                  </Badge>
                </div>

                {/* Clean Caption Bar at bottom */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent p-2 text-[10px] text-white truncate font-mono pointer-events-none">
                  {item.name}
                </div>

                {/* Hover Action Overlay with Icon-Only Action Buttons */}
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewMedia(item);
                    }}
                    className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center shadow transition-transform hover:scale-110 cursor-pointer"
                    title="Preview media"
                  >
                    <Eye className="w-4 h-4 text-slate-800" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditMedia(item);
                    }}
                    className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center shadow transition-transform hover:scale-110 cursor-pointer"
                    title="Edit asset metadata & replace file"
                  >
                    <Pencil className="w-4 h-4 text-slate-800" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTargetMedia(item);
                    }}
                    className="w-8 h-8 rounded-full bg-rose-600/90 hover:bg-rose-600 text-white flex items-center justify-center shadow transition-transform hover:scale-110 cursor-pointer"
                    title="Delete media asset"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Media Item Preview Modal / Detail Drawer */}
      <Dialog
        open={!!selectedMedia}
        onOpenChange={(open) => !open && setSelectedMedia(null)}
        size="2xl"
      >
        {selectedMedia && (
          <div className="space-y-4 font-sans select-none">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="truncate pr-4">{selectedMedia.name}</DialogTitle>
                <Badge variant="outline" className="text-xs">
                  {selectedMedia.documentType}
                </Badge>
              </div>
              <DialogDescription className="font-mono text-[11px]">
                ID: {selectedMedia.id} • Created: {new Date(selectedMedia.createdAt).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>

            {/* Media Asset Preview Box */}
            <div className="relative aspect-video rounded-md border border-slate-200 dark:border-slate-800 bg-slate-900 overflow-hidden flex items-center justify-center">
              {selectedMedia.documentType === MediaDocumentType.IMAGE ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.name}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <video src={selectedMedia.url} controls className="max-h-full max-w-full" />
              )}
            </div>

            {/* Metadata & Usage Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-md bg-slate-50/50 dark:bg-slate-900/50 space-y-1.5">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-slate-500" />
                  Asset Metadata
                </h4>
                <div className="space-y-1 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                  <p>MIME Type: {selectedMedia.mimeType}</p>
                  <p>File Size: {formatFileSize(selectedMedia.sizeBytes)}</p>
                  {selectedMedia.widthPx && <p>Dimensions: {selectedMedia.widthPx} x {selectedMedia.heightPx} px</p>}
                  <p>Original Name: {selectedMedia.originalFileName}</p>
                </div>
              </div>

              <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-md bg-slate-50/50 dark:bg-slate-900/50 space-y-1.5">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  Active Usage References
                </h4>
                {mediaUsageRefs.length === 0 ? (
                  <p className="text-xs text-slate-500 italic pt-1">
                    Not currently referenced by any rooms or content.
                  </p>
                ) : (
                  <div className="space-y-1 pt-0.5">
                    {mediaUsageRefs.map((ref, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs p-1.5 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                      >
                        <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {ref.entityType}: {ref.entityTitle}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">{ref.entityId}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Actions Footer */}
            <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyUrl(selectedMedia.url)}
                  className="w-full sm:w-auto"
                >
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  Copy Asset URL
                </Button>
                <a
                  href={selectedMedia.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                  View Original
                </a>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => setDeleteTargetMedia(selectedMedia)}
                  title="Delete media asset"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </DialogFooter>
          </div>
        )}
      </Dialog>

      {/* Delete Confirmation Modal with Usage Warning */}
      <ConfirmDeleteDialog
        isOpen={!!deleteTargetMedia}
        onClose={() => setDeleteTargetMedia(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Media Asset"
        itemName={deleteTargetMedia?.name}
        description={
          mediaUsageRefs.length > 0
            ? `Warning: This media item is currently referenced by ${mediaUsageRefs.length} active entity (${mediaUsageRefs.map((r) => r.entityTitle).join(', ')}). Deleting it will break image links!`
            : 'Are you sure you want to permanently delete this media file from the CMS repository?'
        }
      />

      {/* Full Media Preview Modal (Eye action) */}
      <FullMediaPreviewModal
        isOpen={!!previewMedia}
        onClose={() => setPreviewMedia(null)}
        src={previewMedia?.url}
        title={previewMedia?.name}
      />

      {/* Edit Media Modal (Pencil action - Metadata & File Replacement) */}
      <EditMediaModal
        isOpen={!!editMedia}
        onClose={() => setEditMedia(null)}
        media={editMedia}
        onUpdated={async (updated) => {
          const res = await updateMedia(updated.id, updated);
          if (res.success) {
            toast.success(res.message || 'Media metadata updated');
            if (editMedia?.id === updated.id) setEditMedia(updated);
          } else {
            toast.error(res.message || 'Failed to update media');
          }
        }}
        onDeleteRequested={(m) => setDeleteTargetMedia(m)}
      />
    </div>
  );
}
