import { z } from 'zod';
import { BlogCategory, BlogStatus } from '../types/blog';

export const blogFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: 'Blog title is required' })
    .min(3, { message: 'Title must be at least 3 characters long' }),

  slug: z.string().trim().optional(),

  excerpt: z.string().trim().optional(),

  content: z
    .string()
    .trim()
    .min(1, { message: 'Blog content is required' })
    .min(10, { message: 'Content must be at least 10 characters long' }),

  category: z.nativeEnum(BlogCategory),

  authorName: z.string().trim().optional(),

  imageId: z.string().trim().optional(),

  status: z.nativeEnum(BlogStatus),

  seoTitle: z.string().trim().optional(),

  seoDescription: z.string().trim().optional(),

  seoKeywords: z.string().trim().optional(),
});

export type BlogFormValues = z.infer<typeof blogFormSchema>;
