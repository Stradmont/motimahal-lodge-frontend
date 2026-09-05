'use client';

import React, { useState } from 'react';
import { FileImage, Plus, X, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MediaPickerModal from './MediaPickerModal';
import { MediaItem, MediaSelectorMode } from '@/lib/types/media';
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

  if (mode === MediaSelectorMode.SINGLE) {
    const { value, onChange } = props as MediaSelectorSingleProps;

    const handleConfirm = (selected: MediaItem[]) => {
      if (selected.length > 0) {
        onChange(selected[0].url, selected[0]);
      }
    };

    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange('');
    };

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
                src={value}
                alt="Selected media asset"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                {value.split('/').pop() || 'Media Asset'}
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
                onClick={() => setIsModalOpen(true)}
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
            onClick={() => setIsModalOpen(true)}
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
    const newUrls = selected.map((s) => s.url);
    // Combine unique URLs
    const combined = Array.from(new Set([...value, ...newUrls]));
    onChange(combined, selected);
  };

  const handleRemoveItem = (index: number) => {
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
        {value.map((url, idx) => (
          <div
            key={idx}
            className="group relative aspect-square rounded overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`Gallery media ${idx}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemoveItem(idx)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-950/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
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
