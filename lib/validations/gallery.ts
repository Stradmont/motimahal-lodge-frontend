import { z } from 'zod';
import { GallerySectionStatus } from '../types/gallery';

export const gallerySectionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: 'Gallery section title is required' })
    .min(2, { message: 'Title must be at least 2 characters long' }),

  slug: z.string().trim().optional(),

  description: z.string().trim().optional(),

  status: z.nativeEnum(GallerySectionStatus),

  mediaIds: z.array(z.string()).min(1, {
    message: 'Please select at least one media asset for this gallery section',
  }),
});

export type GallerySectionFormValues = z.infer<typeof gallerySectionSchema>;
