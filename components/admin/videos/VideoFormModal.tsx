'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Image as ImageIcon, Link as LinkIcon, Trash2, Video } from 'lucide-react';
import { toast } from 'sonner';

import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AdminInput as Input } from '@/components/admin/common/AdminInput';
import { AdminSelect as Select } from '@/components/admin/common/AdminSelect';
import MediaPickerModal from '@/components/admin/common/MediaPickerModal';
import { MediaItem, MediaSelectorMode } from '@/lib/types/media';
import { VideoItem, VideoPlatform, VideoStatus, VideoCategory } from '@/lib/types/video';
import { detectVideoPlatform } from '@/lib/storage/videos';

const videoFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: 'Video title is required' })
    .min(2, { message: 'Video title must be at least 2 characters long' }),
  description: z.string().trim().optional(),
  category: z.nativeEnum(VideoCategory),
  platform: z.nativeEnum(VideoPlatform),
  videoUrl: z
    .string()
    .trim()
    .min(1, { message: 'Video URL is required' })
    .url({ message: 'Please enter a valid URL (e.g. https://www.youtube.com/watch?v=...)' }),
  thumbnailMediaId: z.string().trim().optional(),
  thumbnailUrl: z.string().trim().optional(),
  status: z.nativeEnum(VideoStatus),
});

export type VideoFormData = z.infer<typeof videoFormSchema>;

interface VideoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VideoFormData) => Promise<boolean | void> | boolean | void;
  initialData?: VideoItem | null;
  mode?: 'create' | 'edit';
}

export default function VideoFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = 'create',
}: VideoFormModalProps) {
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<VideoFormData>({
    resolver: zodResolver(videoFormSchema),
    defaultValues: {
      title: '',
      description: '',
      category: VideoCategory.VIRTUAL_TOUR,
      platform: VideoPlatform.YOUTUBE,
      videoUrl: '',
      thumbnailMediaId: '',
      thumbnailUrl: '',
      status: VideoStatus.PUBLISHED,
    },
    mode: 'onBlur',
  });

  const selectedThumbnailUrl = watch('thumbnailUrl');
  const selectedThumbnailMediaId = watch('thumbnailMediaId');
  const currentVideoUrl = watch('videoUrl');

  // Populate initial values on edit mode
  useEffect(() => {
    if (isOpen) {
      if (initialData && mode === 'edit') {
        reset({
          title: initialData.title || '',
          description: initialData.description || '',
          category: initialData.category || VideoCategory.VIRTUAL_TOUR,
          platform: initialData.platform || VideoPlatform.YOUTUBE,
          videoUrl: initialData.videoUrl || '',
          thumbnailMediaId: initialData.thumbnailMediaId || '',
          thumbnailUrl: initialData.thumbnail?.url || '',
          status: initialData.status || VideoStatus.PUBLISHED,
        });
      } else {
        reset({
          title: '',
          description: '',
          category: VideoCategory.VIRTUAL_TOUR,
          platform: VideoPlatform.YOUTUBE,
          videoUrl: '',
          thumbnailMediaId: '',
          thumbnailUrl: '',
          status: VideoStatus.PUBLISHED,
        });
      }
    }
  }, [isOpen, initialData, mode, reset]);

  // Auto-detect platform when video URL changes
  const handleUrlBlur = () => {
    if (currentVideoUrl) {
      const autoPlatform = detectVideoPlatform(currentVideoUrl);
      if (autoPlatform) {
        setValue('platform', autoPlatform, { shouldValidate: true });
      }
    }
  };

  const handleMediaSelected = (selected: MediaItem[]) => {
    if (selected && selected.length > 0) {
      const media = selected[0];
      setValue('thumbnailMediaId', media.id, { shouldValidate: true });
      setValue('thumbnailUrl', media.url, { shouldValidate: true });
      toast.success(`Attached thumbnail asset (${media.name})`);
    }
    setIsMediaPickerOpen(false);
  };

  const handleRemoveThumbnail = () => {
    setValue('thumbnailMediaId', '', { shouldValidate: true });
    setValue('thumbnailUrl', '', { shouldValidate: true });
    toast.info('Removed thumbnail attachment');
  };

  const onFormSubmit = async (data: VideoFormData) => {
    try {
      await onSubmit(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save video details.';
      toast.error(message);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()} size="2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Video className="w-5 h-5 text-brand-green" />
            {mode === 'create' ? 'Add Video Showcase' : 'Edit Video Showcase'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Configure a video link from YouTube, Instagram, Facebook, or Vimeo and attach a cover thumbnail.'
              : 'Update platform source, video link, thumbnail cover, or status details.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-2 font-sans">
          {/* Row 1: Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Video Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                placeholder="e.g. Motimahal Lodge Aerial Drone & River Tour"
                {...register('title')}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-xs text-red-600 font-medium mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="category" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Showcase Category <span className="text-red-500">*</span>
              </label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    options={Object.values(VideoCategory).map((cat) => ({
                      value: cat,
                      label: cat,
                    }))}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.category && (
                <p className="text-xs text-red-600 font-medium mt-1">{errors.category.message}</p>
              )}
            </div>
          </div>

          {/* Row 2: Platform & Video URL */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="platform" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Platform / Source <span className="text-red-500">*</span>
              </label>
              <Controller
                name="platform"
                control={control}
                render={({ field }) => (
                  <Select
                    options={Object.values(VideoPlatform).map((plat) => ({
                      value: plat,
                      label: plat,
                    }))}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.platform && (
                <p className="text-xs text-red-600 font-medium mt-1">{errors.platform.message}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="videoUrl" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Video Link / URL <span className="text-red-500">*</span>
              </label>
              <Input
                id="videoUrl"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                {...register('videoUrl', { onBlur: handleUrlBlur })}
                className={errors.videoUrl ? 'border-red-500' : ''}
              />
              {errors.videoUrl && (
                <p className="text-xs text-red-600 font-medium mt-1">{errors.videoUrl.message}</p>
              )}
            </div>
          </div>

          {/* Row 3: Thumbnail Management (Centralized Media Picker) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Cover Thumbnail Image
              </label>
              <span className="text-[11px] text-slate-400 font-normal">Central Media Selector</span>
            </div>

            {selectedThumbnailUrl ? (
              <div className="flex items-center gap-4 p-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50/50 dark:bg-slate-900/40">
                <div className="relative w-24 h-16 rounded overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedThumbnailUrl}
                    alt="Thumbnail Preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">
                      Thumbnail Asset
                    </span>
                    {selectedThumbnailMediaId && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {selectedThumbnailMediaId}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{selectedThumbnailUrl}</p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsMediaPickerOpen(true)}
                    className="text-xs h-8"
                  >
                    <ImageIcon className="w-3.5 h-3.5 mr-1 text-slate-500" />
                    Change
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveThumbnail}
                    className="text-xs h-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50/50 dark:bg-slate-900/30 text-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    No Thumbnail Selected
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Select an existing image from the centralized Media Library or upload a new one.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMediaPickerOpen(true)}
                  className="text-xs h-8 mt-1"
                >
                  <ImageIcon className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                  Choose from Media Library
                </Button>
              </div>
            )}
          </div>

          {/* Row 4: Status & Description */}
          <div>
            <label htmlFor="status" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Publishing Status <span className="text-red-500">*</span>
            </label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  options={Object.values(VideoStatus).map((st) => ({
                    value: st,
                    label: st,
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              rows={2}
              placeholder="Brief description of the video content..."
              {...register('description')}
              className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-slate-400"
            />
          </div>

          <DialogFooter className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting} className="bg-brand-green hover:bg-brand-green-dark text-white">
              {mode === 'create' ? 'Create Video' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* Centralized Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        mode={MediaSelectorMode.SINGLE}
        initialSelectedUrls={selectedThumbnailUrl ? [selectedThumbnailUrl] : []}
        onConfirm={handleMediaSelected}
        title="Select Video Cover Thumbnail"
      />
    </>
  );
}
