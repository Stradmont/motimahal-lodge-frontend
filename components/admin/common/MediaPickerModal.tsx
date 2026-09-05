'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Upload, Check, Loader2, Image as ImageIcon, Video, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AdminInput as Input } from '@/components/admin/common/AdminInput';
import { AdminSelect as Select } from '@/components/admin/common/AdminSelect';
import { MediaItem, MediaDocumentType, MediaEntityType, MediaSelectorMode } from '@/lib/types/media';
import { fetchMediaList, uploadMediaApi, MEDIA_UPDATED_EVENT } from '@/lib/api/media';
import { cn } from '@/lib/utils';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: MediaSelectorMode;
  initialSelectedUrls?: string[];
  onConfirm: (selected: MediaItem[]) => void;
  title?: string;
}

export default function MediaPickerModal({
  isOpen,
  onClose,
  mode = MediaSelectorMode.SINGLE,
  initialSelectedUrls = [],
  onConfirm,
  title = 'Select Media Asset',
}: MediaPickerModalProps) {
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDocType, setFilterDocType] = useState<string>('ALL');
  const [selectedItems, setSelectedItems] = useState<MediaItem[]>([]);

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMedia = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchMediaList(filterDocType, searchTerm);
      setMediaList(data);
    } catch {
      toast.error('Failed to load media assets');
    } finally {
      setIsLoading(false);
    }
  }, [filterDocType, searchTerm]);

  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen, loadMedia]);

  useEffect(() => {
    if (isOpen && mediaList.length > 0) {
      // Sync initial selected items by URL or ID match
      const preselected = mediaList.filter((m) => initialSelectedUrls.includes(m.url) || initialSelectedUrls.includes(m.id));
      setSelectedItems(preselected);
    }
  }, [isOpen, mediaList, initialSelectedUrls]);

  useEffect(() => {
    window.addEventListener(MEDIA_UPDATED_EVENT, loadMedia);
    return () => window.removeEventListener(MEDIA_UPDATED_EVENT, loadMedia);
  }, [loadMedia]);

  const handleToggleSelect = (item: MediaItem) => {
    if (mode === MediaSelectorMode.SINGLE) {
      setSelectedItems([item]);
    } else {
      const exists = selectedItems.some((i) => i.id === item.id);
      if (exists) {
        setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
      } else {
        setSelectedItems([...selectedItems, item]);
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds maximum limit of 10MB');
      return;
    }

    setIsUploading(true);
    try {
      const docType: MediaDocumentType = file.type.startsWith('video/') ? MediaDocumentType.VIDEO : MediaDocumentType.IMAGE;
      const uploaded = await uploadMediaApi(file, docType, MediaEntityType.GENERAL);
      toast.success(`Uploaded ${uploaded.originalFileName}`);
      setActiveTab('library');
      if (mode === MediaSelectorMode.SINGLE) {
        setSelectedItems([uploaded]);
      } else {
        setSelectedItems((prev) => [uploaded, ...prev]);
      }
      loadMedia();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      toast.error(message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleConfirmSelection = () => {
    onConfirm(selectedItems);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()} size="4xl">
      <div className="space-y-4 font-sans select-none">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{title}</DialogTitle>
            <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800 text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveTab('library')}
                className={cn(
                  'px-3 py-1 rounded-sm transition-colors cursor-pointer',
                  activeTab === 'library'
                    ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-semibold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                )}
              >
                Media Library
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={cn(
                  'px-3 py-1 rounded-sm transition-colors cursor-pointer',
                  activeTab === 'upload'
                    ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-semibold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                )}
              >
                Upload File
              </button>
            </div>
          </div>
          <DialogDescription>
            {activeTab === 'library'
              ? 'Choose existing uploaded media asset from the centralized CMS library.'
              : 'Upload a new photo or video asset directly to the centralized CMS media library.'}
          </DialogDescription>
        </DialogHeader>

        {activeTab === 'library' ? (
          <div className="space-y-3">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select
                  value={filterDocType}
                  onChange={(val) => setFilterDocType(val as string)}
                  options={[
                    { value: 'ALL', label: 'All Document Types' },
                    { value: 'IMAGE', label: 'Images Only' },
                    { value: 'VIDEO', label: 'Videos Only' },
                  ]}
                  className="w-44 text-xs"
                />
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  placeholder="Search filename..."
                  className="pl-8 h-9 text-xs"
                />
              </div>
            </div>

            {/* Media Grid */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-md bg-slate-50/50 dark:bg-slate-900/50 p-3 h-80 overflow-y-auto">
              {isLoading ? (
                <div className="h-full flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
                  <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                  <span>Loading media library...</span>
                </div>
              ) : mediaList.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-2 text-center text-slate-500">
                  <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                  <p className="text-xs font-medium">No media items found matching criteria.</p>
                  <Button size="sm" variant="outline" onClick={() => setActiveTab('upload')}>
                    Upload First Asset
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {mediaList.map((item) => {
                    const isSelected = selectedItems.some((i) => i.id === item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleToggleSelect(item)}
                        className={cn(
                          'group relative aspect-square rounded-md border bg-white dark:bg-slate-950 overflow-hidden cursor-pointer transition-all',
                          isSelected
                            ? 'border-slate-900 dark:border-slate-100 ring-2 ring-slate-900 dark:ring-slate-100 shadow-xs'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600'
                        )}
                      >
                        {item.documentType === MediaDocumentType.IMAGE ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={item.url}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-slate-300 gap-1 p-2">
                            <Video className="w-6 h-6 text-slate-400" />
                            <span className="text-[10px] font-mono truncate w-full text-center">{item.name}</span>
                          </div>
                        )}

                        {/* Checkmark Badge */}
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 flex items-center justify-center shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}

                        {/* Name Overlay */}
                        <div className="absolute inset-x-0 bottom-0 bg-slate-950/70 backdrop-blur-2xs p-1 text-[10px] text-white truncate font-mono">
                          {item.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Upload Tab */
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-md bg-slate-50/50 dark:bg-slate-900/50 p-8 flex flex-col items-center justify-center text-center space-y-3 h-80">
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-slate-600 dark:text-slate-400" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Uploading media asset...
                </p>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Click to select file or drag file here
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Supports JPG, PNG, WEBP, and MP4 up to 10MB
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  Select File from Computer
                </Button>
              </>
            )}
          </div>
        )}

        <DialogFooter className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
          <span className="text-xs font-medium text-slate-500">
            {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'} selected
          </span>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={selectedItems.length === 0}
              onClick={handleConfirmSelection}
            >
              Use Selected Media ({selectedItems.length})
            </Button>
          </div>
        </DialogFooter>
      </div>
    </Dialog>
  );
}
