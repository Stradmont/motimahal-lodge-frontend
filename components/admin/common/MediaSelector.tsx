'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FileImage, Plus, X, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MediaPickerModal from './MediaPickerModal';
import { MediaItem, MediaSelectorMode } from '@/lib/types/media';
import { fetchMediaList } from '@/lib/api/media';
import { cn } from '@/lib/utils';

interface MediaSelectorSingleProps {
  mode?: MediaSelectorMode.SINGLE;
  value?: string;
  onChange: (value: string, mediaItem?: MediaItem) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  className?: string;
}

interface MediaSelectorMultipleProps {
  mode: MediaSelectorMode.MULTIPLE;
  value?: string[];
  onChange: (value: string[], mediaItems?: MediaItem[]) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  className?: string;
}

export type MediaSelectorProps = MediaSelectorSingleProps | MediaSelectorMultipleProps;

export function MediaSelector(props: MediaSelectorProps) {
  const { mode = MediaSelectorMode.SINGLE, label, placeholder = 'Select image from Media Library', className } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mediaCache, setMediaCache] = useState<Record<string, MediaItem>>({});

  const cacheMediaItems = useCallback((items: MediaItem[]) => {
    setMediaCache((prev) => {
      const next = { ...prev };
      items.forEach((item) => {
        if (item.id) next[item.id] = item;
        if (item.url) next[item.url] = item;
      });
      return next;
    });
  }, []);

  // Populate cache for unresolved media IDs
  useEffect(() => {
    const idsToResolve: string[] = [];
    if (mode === MediaSelectorMode.SINGLE) {
      const val = (props as MediaSelectorSingleProps).value;
      if (val && !val.startsWith('http') && !val.startsWith('/') && !val.startsWith('data:') && !mediaCache[val]) {
        idsToResolve.push(val);
      }
    } else {
      const vals = (props as MediaSelectorMultipleProps).value || [];
      vals.forEach((v) => {
        if (v && !v.startsWith('http') && !v.startsWith('/') && !v.startsWith('data:') && !mediaCache[v]) {
          idsToResolve.push(v);
        }
      });
    }

    if (idsToResolve.length > 0) {
      fetchMediaList()
        .then((allMedia) => {
          cacheMediaItems(allMedia);
        })
        .catch(() => {});
    }
  }, [props, mode, mediaCache, cacheMediaItems]);

  const getDisplayUrl = (idOrUrl: string): string => {
    if (!idOrUrl) return '';
    if (idOrUrl.startsWith('http') || idOrUrl.startsWith('/') || idOrUrl.startsWith('data:')) {
      return idOrUrl;
    }
    if (mediaCache[idOrUrl]) {
      return mediaCache[idOrUrl].url;
    }
    return idOrUrl;
  };

  const getFileName = (idOrUrl: string): string => {
    if (!idOrUrl) return 'Media Asset';
    if (mediaCache[idOrUrl]?.originalFileName) {
      return mediaCache[idOrUrl].originalFileName;
    }
    if (mediaCache[idOrUrl]?.name) {
      return mediaCache[idOrUrl].name;
    }
    return idOrUrl.split('/').pop() || 'Media Asset';
  };

  if (mode === MediaSelectorMode.SINGLE) {
    const { value, onChange } = props as MediaSelectorSingleProps;

    const handleConfirm = (selected: MediaItem[]) => {
      if (selected.length > 0) {
        cacheMediaItems(selected);
        // Pass Media ID as primary string
        onChange(selected[0].id, selected[0]);
      }
    };

    const handleRemove = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onChange('');
    };

    const displayUrl = value ? getDisplayUrl(value) : '';

    return (
      <div className={cn('space-y-1.5 font-sans', className)}>
        {label && (
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}

        {value ? (
          <div className="relative group flex items-center gap-3 p-2 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            {/* Thumbnail Preview */}
            <div className="w-14 h-14 rounded overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={displayUrl}
                alt="Selected media asset"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                {getFileName(value)}
              </p>
              <p className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
                {value}
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
                className="h-8 px-2.5 text-xs"
              >
                <Pencil className="w-3 h-3 mr-1" />
                Change
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                title="Remove selection"
                className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="w-full h-20 rounded-md border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
          >
            <FileImage className="w-5 h-5 text-slate-400" />
            <span className="text-xs font-semibold">{placeholder}</span>
          </button>
        )}

        <MediaPickerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          mode={MediaSelectorMode.SINGLE}
          initialSelectedUrls={value ? [value] : []}
          onConfirm={handleConfirm}
          title="Select Media Asset"
        />
      </div>
    );
  }

  // Multiple Mode
  const { value = [], onChange } = props as MediaSelectorMultipleProps;

  const handleConfirmMultiple = (selected: MediaItem[]) => {
    cacheMediaItems(selected);
    const selectedIds = selected.map((s) => s.id);
    const combinedIds = Array.from(new Set([...value, ...selectedIds]));
    onChange(combinedIds, selected);
  };

  const handleRemoveItem = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className={cn('space-y-1.5 font-sans', className)}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 p-2 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        {value.map((idOrUrl, idx) => (
          <div
            key={idx}
            className="group relative aspect-square rounded overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getDisplayUrl(idOrUrl)} alt={`Gallery media ${idx}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={(e) => handleRemoveItem(e, idx)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-950/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsModalOpen(true);
          }}
          className="aspect-square rounded border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 text-slate-400" />
          <span className="text-[10px] font-semibold">Add Media</span>
        </button>
      </div>

      <MediaPickerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={MediaSelectorMode.MULTIPLE}
        initialSelectedUrls={value}
        onConfirm={handleConfirmMultiple}
        title="Select Media Assets"
      />
    </div>
  );
}

export default MediaSelector;
