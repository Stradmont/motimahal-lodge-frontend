'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Plus,
  Loader2,
  ArrowUp,
  ArrowDown,
  X,
  Info,
  Layers,
} from 'lucide-react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AdminInput as Input } from '@/components/admin/common/AdminInput';
import { AdminSelect as Select } from '@/components/admin/common/AdminSelect';
import MediaPickerModal from '@/components/admin/common/MediaPickerModal';
import { gallerySectionSchema, GallerySectionFormValues } from '@/lib/validations/gallery';
import { GallerySectionItem, CreateGallerySectionInput, GallerySectionStatus } from '@/lib/types/gallery';
import { MediaItem, MediaSelectorMode } from '@/lib/types/media';
import { fetchMediaList } from '@/lib/api/media';

interface GallerySectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateGallerySectionInput) => Promise<void>;
  initialData?: GallerySectionItem | null;
  mode?: 'create' | 'edit';
}

export default function GallerySectionModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = 'create',
}: GallerySectionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [selectedMediaItems, setSelectedMediaItems] = useState<MediaItem[]>([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<GallerySectionFormValues>({
    resolver: zodResolver(gallerySectionSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      status: GallerySectionStatus.ACTIVE,
      mediaIds: [],
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData && mode === 'edit') {
        if (initialData.mediaItems && initialData.mediaItems.length > 0) {
          setSelectedMediaItems(initialData.mediaItems);
        } else {
          fetchMediaList().then((allMedia) => {
            const preselected = (initialData.mediaIds || [])
              .map((id) => allMedia.find((m: MediaItem) => m.id === id || m.url === id))
              .filter((m): m is MediaItem => !!m);
            setSelectedMediaItems(preselected);
          }).catch(() => {});
        }
        reset({
          title: initialData.title,
          slug: initialData.slug,
          description: initialData.description || '',
          status: initialData.status,
          mediaIds: initialData.mediaIds,
        });
      } else {
        setSelectedMediaItems([]);
        reset({
          title: '',
          slug: '',
          description: '',
          status: GallerySectionStatus.ACTIVE,
          mediaIds: [],
        });
      }
    }
  }, [isOpen, initialData, mode, reset]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue('title', val, { shouldValidate: true });
    if (mode === 'create') {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setValue('slug', generatedSlug, { shouldValidate: true });
    }
  };

  const handleMediaConfirmSelection = (selectedItems: MediaItem[]) => {
    setSelectedMediaItems(selectedItems);
    setValue(
      'mediaIds',
      selectedItems.map((m) => m.id),
      { shouldValidate: true }
    );
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...selectedMediaItems];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setSelectedMediaItems(updated);
    setValue(
      'mediaIds',
      updated.map((m) => m.id)
    );
  };

  const handleMoveDown = (index: number) => {
    if (index === selectedMediaItems.length - 1) return;
    const updated = [...selectedMediaItems];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setSelectedMediaItems(updated);
    setValue(
      'mediaIds',
      updated.map((m) => m.id)
    );
  };

  const handleRemoveMedia = (mediaId: string) => {
    const updated = selectedMediaItems.filter((m) => m.id !== mediaId);
    setSelectedMediaItems(updated);
    setValue(
      'mediaIds',
      updated.map((m) => m.id)
    );
  };

  const onFormSubmit = async (data: GallerySectionFormValues) => {
    setIsSubmitting(true);
    try {
      const payload: CreateGallerySectionInput = {
        title: data.title,
        slug: data.slug || '',
        description: data.description || undefined,
        status: data.status,
        mediaIds: selectedMediaItems.map((m) => m.id),
      };

      await onSubmit(payload);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save gallery section.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()} size="4xl">
      <div className="font-sans max-h-[85vh] flex flex-col">
        <DialogHeader className="px-1 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
              {mode === 'create' ? 'Create Gallery Section' : 'Edit Gallery Section'}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-500">
            Configure gallery section titles, collection media items from Centralized Media, and display order.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} noValidate className="space-y-4 pt-4 overflow-y-auto flex-1 pr-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Section Title <span className="text-rose-500">*</span>
              </label>
              <Input
                type="text"
                {...register('title')}
                onChange={handleTitleChange}
                placeholder="e.g. Homepage Showcase Gallery"
                className={errors.title ? 'border-rose-500' : ''}
              />
              {errors.title && (
                <p className="text-[11px] font-medium text-rose-500 mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Slug <span className="text-rose-500">*</span>
              </label>
              <Input
                type="text"
                {...register('slug')}
                placeholder="e.g. homepage-showcase-gallery"
                className={errors.slug ? 'border-rose-500' : ''}
              />
              {errors.slug && (
                <p className="text-[11px] font-medium text-rose-500 mt-1">{errors.slug.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Status <span className="text-rose-500">*</span>
              </label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={field.onChange}
                    options={[
                      { value: GallerySectionStatus.ACTIVE, label: 'Active' },
                      { value: GallerySectionStatus.DRAFT, label: 'Draft' },
                      { value: GallerySectionStatus.INACTIVE, label: 'Inactive' },
                    ]}
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Description (Optional)
              </label>
              <Input
                type="text"
                {...register('description')}
                placeholder="Brief context for where this section appears..."
              />
            </div>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-md p-4 bg-slate-50/50 dark:bg-slate-900/30 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-500" />
                  Gallery Media Collection ({selectedMediaItems.length})
                </h4>
                <p className="text-[11px] text-slate-500">
                  Select multiple media items from Centralized Media Library and adjust display order.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setIsMediaPickerOpen(true)}
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Select Media ({selectedMediaItems.length})
              </Button>
            </div>

            {selectedMediaItems.length === 0 ? (
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-md p-6 text-center bg-white dark:bg-slate-950">
                <Info className="w-5 h-5 text-slate-400 mx-auto mb-1.5" />
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  No media items added to this gallery section yet
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5 mb-3">
                  Click &quot;Select Media&quot; to open the Centralized Media Picker and choose existing assets.
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setIsMediaPickerOpen(true)}
                >
                  <Plus className="w-3.5 h-3.5 mr-1.5" />
                  Select Media Items
                </Button>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {selectedMediaItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono text-slate-400 font-bold shrink-0 text-center w-5">
                        #{idx + 1}
                      </span>
                      <div className="w-10 h-8 rounded overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shrink-0">
                        {item.documentType === 'VIDEO' ? (
                          <video src={item.url} className="w-full h-full object-cover" />
                        ) : (
                          <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono truncate">
                          {item.id} • {item.entityType}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={idx === 0}
                        onClick={() => handleMoveUp(idx)}
                        title="Move Up"
                        className="h-7 w-7 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={idx === selectedMediaItems.length - 1}
                        onClick={() => handleMoveDown(idx)}
                        title="Move Down"
                        className="h-7 w-7 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveMedia(item.id)}
                        title="Remove"
                        className="h-7 w-7 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Saving...
                </>
              ) : mode === 'create' ? (
                'Create Gallery Section'
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>

        <MediaPickerModal
          isOpen={isMediaPickerOpen}
          onClose={() => setIsMediaPickerOpen(false)}
          mode={MediaSelectorMode.MULTIPLE}
          initialSelectedUrls={selectedMediaItems.map((m) => m.url)}
          onConfirm={handleMediaConfirmSelection}
          title="Select Gallery Section Media"
        />
      </div>
    </Dialog>
  );
}
