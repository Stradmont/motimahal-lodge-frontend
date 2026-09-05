'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Plus,
  Loader2,
  Check,
} from 'lucide-react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AdminInput as Input } from '@/components/admin/common/AdminInput';
import AdminRichTextEditor from '@/components/admin/common/AdminRichTextEditor';
import { AdminSelect as Select } from '@/components/admin/common/AdminSelect';
import MediaSelector from '@/components/admin/common/MediaSelector';
import { roomFormSchema, RoomFormValues } from '@/lib/validations/room';
import { CreateRoomInput, RoomItem, RoomCategory, RoomStatus } from '@/lib/types/room';
import { MediaSelectorMode } from '@/lib/types/media';

interface RoomFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRoomInput) => Promise<void>;
  initialData?: RoomItem | null;
  mode?: 'create' | 'edit';
}

const COMMON_AMENITIES = [
  'River View Balcony',
  'Air Conditioning',
  'Free WiFi',
  'Heated Blanket',
  'Ensuite Bathroom',
  'Breakfast Included',
  'Hot Rainfall Shower',
  'Flat Screen TV',
  'Mini Bar / Fridge',
  'Tea / Coffee Maker',
  '24/7 Room Service',
  'Garden View',
  'Private Patio',
  'Safe Deposit Box',
];

export default function RoomFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = 'create',
}: RoomFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customAmenityInput, setCustomAmenityInput] = useState('');

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RoomFormValues>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: {
      name: '',
      type: RoomCategory.DELUXE,
      pricePerNight: '5500',
      capacity: '2',
      totalUnits: '1',
      bedType: 'King Size Bed',
      sizeSqFt: '350',
      status: RoomStatus.AVAILABLE,
      description: '',
      shortDescription: '',
      amenities: ['Air Conditioning', 'Free WiFi', 'Breakfast Included', 'Hot Shower'],
      imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      galleryImages: [],
      isFeatured: false,
    },
    mode: 'onBlur',
  });

  const watchAmenities = watch('amenities') || [];

  useEffect(() => {
    if (isOpen) {
      if (initialData && mode === 'edit') {
        reset({
          name: initialData.name,
          type: initialData.type,
          pricePerNight: initialData.pricePerNight.toString(),
          capacity: initialData.capacity.toString(),
          totalUnits: (initialData.totalUnits || 1).toString(),
          bedType: initialData.bedType || 'King Size Bed',
          sizeSqFt: initialData.sizeSqFt ? initialData.sizeSqFt.toString() : '',
          status: initialData.status,
          description: initialData.description || '',
          shortDescription: initialData.shortDescription || '',
          amenities: initialData.amenities || [],
          imageUrl: initialData.imageUrl || '',
          galleryImages: initialData.galleryImages || [],
          isFeatured: !!initialData.isFeatured,
        });
      } else {
        reset({
          name: '',
          type: RoomCategory.DELUXE,
          pricePerNight: '5500',
          capacity: '2',
          totalUnits: '1',
          bedType: 'King Size Bed',
          sizeSqFt: '350',
          status: RoomStatus.AVAILABLE,
          description: '',
          shortDescription: '',
          amenities: ['Air Conditioning', 'Free WiFi', 'Breakfast Included', 'Hot Shower'],
          imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
          galleryImages: [],
          isFeatured: false,
        });
      }
    }
  }, [isOpen, initialData, mode, reset]);

  const toggleAmenity = (amenity: string) => {
    if (watchAmenities.includes(amenity)) {
      setValue(
        'amenities',
        watchAmenities.filter((a) => a !== amenity),
        { shouldValidate: true }
      );
    } else {
      setValue('amenities', [...watchAmenities, amenity], { shouldValidate: true });
    }
  };

  const handleAddCustomAmenity = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customAmenityInput.trim();
    if (trimmed && !watchAmenities.includes(trimmed)) {
      setValue('amenities', [...watchAmenities, trimmed], { shouldValidate: true });
      setCustomAmenityInput('');
    }
  };

  const onFormSubmit = async (data: RoomFormValues) => {
    setIsSubmitting(true);
    try {
      const payload: CreateRoomInput = {
        name: data.name,
        type: data.type,
        pricePerNight: parseFloat(data.pricePerNight),
        capacity: parseInt(data.capacity),
        totalUnits: parseInt(data.totalUnits),
        bedType: data.bedType || undefined,
        sizeSqFt: data.sizeSqFt ? parseInt(data.sizeSqFt) : undefined,
        status: data.status,
        description: data.description,
        shortDescription: data.shortDescription || undefined,
        amenities: data.amenities,
        imageUrl: data.imageUrl,
        galleryImages: data.galleryImages || [],
        isFeatured: data.isFeatured,
      };

      await onSubmit(payload);
      reset();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save room details.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalidSubmit = () => {
    toast.error('Please fix validation errors in the room form.');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()} size="4xl">
      <div className="font-sans max-h-[85vh] flex flex-col">
        <DialogHeader className="px-1 pb-3 border-b border-slate-200 dark:border-slate-800">
          <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
            {mode === 'create' ? 'Add Room Category' : `Edit Room: ${initialData?.name}`}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Configure room inventory attributes, nightly rates, amenities, and rich description.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onFormSubmit, onInvalidSubmit)}
          noValidate
          className="flex-1 overflow-y-auto py-4 space-y-6 px-1 pr-2"
        >
          {/* Section 1: Basic Specifications */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-1">
              Basic Specifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Room Title <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="text"
                  {...register('name')}
                  placeholder="e.g. Royal River View Deluxe Suite"
                  className={errors.name ? 'border-rose-500' : ''}
                />
                {errors.name && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Category <span className="text-rose-500">*</span>
                </label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onChange={field.onChange}
                      options={Object.values(RoomCategory).map((cat) => ({
                        value: cat,
                        label: cat,
                      }))}
                    />
                  )}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Rate per Night (NPR) <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="number"
                  {...register('pricePerNight')}
                  placeholder="5500"
                  className={errors.pricePerNight ? 'border-rose-500' : ''}
                />
                {errors.pricePerNight && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1">
                    {errors.pricePerNight.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Guest Capacity <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="number"
                  {...register('capacity')}
                  placeholder="2"
                  className={errors.capacity ? 'border-rose-500' : ''}
                />
                {errors.capacity && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1">
                    {errors.capacity.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Available Units <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="number"
                  {...register('totalUnits')}
                  placeholder="3"
                  className={errors.totalUnits ? 'border-rose-500' : ''}
                />
                {errors.totalUnits && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1">
                    {errors.totalUnits.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Bed Configuration
                </label>
                <Input
                  type="text"
                  {...register('bedType')}
                  placeholder="e.g. 1 King Size Bed"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Size (sq ft)
                </label>
                <Input
                  type="number"
                  {...register('sizeSqFt')}
                  placeholder="350"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Rich Text Description */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-1">
              Description & Details
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Short Summary
              </label>
              <Input
                type="text"
                {...register('shortDescription')}
                placeholder="Brief one-line card summary..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Full Description <span className="text-rose-500">*</span>
              </label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <AdminRichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Write detailed room description..."
                    height="200px"
                  />
                )}
              />
              {errors.description && (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* Section 3: Amenities */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-1">
              Room Amenities <span className="text-rose-500">*</span>
            </h3>

            <div className="space-y-2">
              <div className="flex flex-wrap gap-1.5 p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                {COMMON_AMENITIES.map((amenity) => {
                  const isSelected = watchAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold'
                          : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-400'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 shrink-0" />}
                      {amenity}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <Input
                  type="text"
                  value={customAmenityInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomAmenityInput(e.target.value)}
                  placeholder="Add custom amenity..."
                  className="text-xs h-8"
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomAmenity(e);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddCustomAmenity}
                  className="h-8 text-xs shrink-0"
                >
                  <Plus className="w-3 h-3 mr-1" /> Add
                </Button>
              </div>

              {errors.amenities && (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1">
                  {errors.amenities.message}
                </p>
              )}
            </div>
          </div>

          {/* Section 4: Media */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-1">
              Cover & Gallery Media
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Main Cover Image <span className="text-rose-500">*</span>
              </label>
              <Controller
                name="imageUrl"
                control={control}
                render={({ field }) => (
                  <MediaSelector
                    mode={MediaSelectorMode.SINGLE}
                    value={field.value}
                    onChange={(val) => field.onChange(val as string)}
                    error={errors.imageUrl?.message}
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Additional Gallery Photos
              </label>
              <Controller
                name="galleryImages"
                control={control}
                render={({ field }) => (
                  <MediaSelector
                    mode={MediaSelectorMode.MULTIPLE}
                    value={field.value || []}
                    onChange={(val) => field.onChange(val as string[])}
                    error={errors.galleryImages?.message}
                  />
                )}
              />
            </div>
          </div>

          {/* Section 5: Status */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-1">
              Status & Options
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Availability Status
                </label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onChange={field.onChange}
                      options={Object.values(RoomStatus).map((s) => ({
                        value: s,
                        label: s.charAt(0).toUpperCase() + s.slice(1),
                      }))}
                    />
                  )}
                />
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('isFeatured')}
                    className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500 dark:border-slate-700 dark:bg-slate-950"
                  />
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    Feature on Homepage Showcase
                  </span>
                </label>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Saving...
                </>
              ) : mode === 'create' ? (
                'Create Room'
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </div>
    </Dialog>
  );
}
