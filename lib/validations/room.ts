import { z } from 'zod';
import { RoomCategory, RoomStatus } from '../types/room';

export const roomFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Room title is required' })
    .min(2, { message: 'Room title must be at least 2 characters long' }),

  type: z.nativeEnum(RoomCategory),

  pricePerNight: z
    .string()
    .trim()
    .min(1, { message: 'Rate per night is required' })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Rate per night must be a positive number',
    }),

  capacity: z
    .string()
    .trim()
    .min(1, { message: 'Guest capacity is required' })
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 1, {
      message: 'Capacity must be at least 1 guest',
    }),

  totalUnits: z
    .string()
    .trim()
    .min(1, { message: 'Total room units count is required' })
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 1, {
      message: 'Must have at least 1 room unit available',
    }),

  bedType: z.string().trim().optional(),

  sizeSqFt: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
      message: 'Size in sq ft must be a valid positive number',
    }),

  status: z.nativeEnum(RoomStatus),

  description: z
    .string()
    .trim()
    .min(1, { message: 'Room description is required' })
    .min(10, { message: 'Room description must be at least 10 characters long' }),

  shortDescription: z.string().trim().optional(),

  amenities: z.array(z.string()).min(1, {
    message: 'Please select or add at least one amenity for this room',
  }),

  /** Media ID referencing MediaEntity — hero image */
  imageId: z.string().trim().optional(),

  /** Media IDs referencing MediaEntity — gallery images */
  galleryImageIds: z.array(z.string()).optional(),

  isFeatured: z.boolean().optional(),
});

export type RoomFormValues = z.infer<typeof roomFormSchema>;
