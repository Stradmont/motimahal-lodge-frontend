'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  Loader2,
  Globe,
  FileText,
  Image as ImageIcon,
  Sparkles,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminInput as Input } from '@/components/admin/common/AdminInput';
import { AdminSelect as Select } from '@/components/admin/common/AdminSelect';
import { AppRichTextEditor } from '@/components/admin/common/AdminRichTextEditor';
import MediaSelector from '@/components/admin/common/MediaSelector';
import { blogFormSchema, BlogFormValues } from '@/lib/validations/blog';
import { BlogItem, BlogCategory, BlogStatus, BLOG_CATEGORY_LABELS } from '@/lib/types/blog';
import { MediaSelectorMode } from '@/lib/types/media';

interface BlogFormProps {
  mode: 'create' | 'edit';
  initialData?: BlogItem | null;
  onSubmit: (data: Partial<BlogItem>) => Promise<void>;
  isSubmitting?: boolean;
}

export default function BlogForm({
  mode,
  initialData,
  onSubmit,
  isSubmitting: externalIsSubmitting = false,
}: BlogFormProps) {
  const router = useRouter();
  const [internalIsSubmitting, setInternalIsSubmitting] = useState(false);
  const isSubmitting = externalIsSubmitting || internalIsSubmitting;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      excerpt: initialData?.excerpt || '',
      content: initialData?.content || '',
      category: initialData?.category || BlogCategory.GENERAL,
      authorName: initialData?.authorName || 'Motimahal Team',
      status: initialData?.status || BlogStatus.PUBLISHED,
      imageId: initialData?.imageId || '',
      seoTitle: initialData?.seoTitle || '',
      seoDescription: initialData?.seoDescription || '',
      seoKeywords: initialData?.seoKeywords || '',
    },
    mode: 'onBlur',
  });

  const watchTitle = watch('title');
  const watchExcerpt = watch('excerpt');
  const watchContent = watch('content');

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || '',
        slug: initialData.slug || '',
        excerpt: initialData.excerpt || '',
        content: initialData.content || '',
        category: initialData.category || BlogCategory.GENERAL,
        authorName: initialData.authorName || 'Motimahal Team',
        status: initialData.status || BlogStatus.PUBLISHED,
        imageId: initialData.imageId || '',
        seoTitle: initialData.seoTitle || '',
        seoDescription: initialData.seoDescription || '',
        seoKeywords: initialData.seoKeywords || '',
      });
    }
  }, [initialData, reset]);

  // Auto-generate slug when creating a new article
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue('title', val);

    if (mode === 'create') {
      const generatedSlug = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
      setValue('slug', generatedSlug);
    }
  };

  const handleFormSubmit = async (values: BlogFormValues) => {
    setInternalIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setInternalIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 font-sans pb-16">
      {/* Top Sticky Action Bar */}
      <div className="sticky top-14 z-20 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xs border-b border-slate-200 dark:border-slate-800 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogs"
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            title="Back to Blog Articles"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">
              {mode === 'create' ? 'Create New Article' : 'Edit Article'}
            </h1>
            <p className="text-xs text-slate-500">
              {mode === 'create' ? 'Draft a new story for your website' : `Editing: ${initialData?.title || 'Article'}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/blogs"
            className="px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting}
            size="sm"
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{mode === 'create' ? 'Publish Article' : 'Save Changes'}</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Grid: Left Column (Content), Right Column (Metadata & SEO) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Left 2 Columns: Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Article Title & Slug Card */}
          <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 space-y-4 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Basic Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Article Title <span className="text-rose-500">*</span>
                </label>
                <Input
                  {...register('title')}
                  onChange={handleTitleChange}
                  placeholder="e.g. 5 Best Sunset Spots on Narayani Riverfront"
                  className="text-sm font-semibold"
                />
                {errors.title?.message && (
                  <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  URL Slug <span className="text-slate-400 font-normal">(auto-generated)</span>
                </label>
                <Input
                  {...register('slug')}
                  placeholder="5-best-sunset-spots-narayani"
                  className="font-mono text-xs"
                />
                {errors.slug?.message && (
                  <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.slug.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Short Summary / Excerpt
                </label>
                <textarea
                  {...register('excerpt')}
                  rows={2}
                  className="w-full text-xs p-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-slate-400 outline-none transition-all"
                  placeholder="A brief 1-2 sentence description shown in blog post cards..."
                />
                {errors.excerpt?.message && (
                  <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.excerpt.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Rich Text Body Content */}
          <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Article Body Content <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400 font-medium">Tiptap Rich Text Editor</span>
            </div>

            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <AppRichTextEditor
                  value={field.value}
                  onChange={(val) => field.onChange(val)}
                  placeholder="Write full article body paragraphs, headings, blockquotes, and lists here..."
                  height="450px"
                />
              )}
            />

            {errors.content?.message && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.content.message}</p>
            )}
          </div>
        </div>

        {/* Right 1 Column: Settings, Cover Image & SEO */}
        <div className="space-y-6">
          {/* Publishing Controls */}
          <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 space-y-4 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Publishing Options
            </h2>

            <div className="space-y-4">
              {/* Status */}
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
                      onChange={(val) => field.onChange(val as BlogStatus)}
                      options={[
                        { value: BlogStatus.PUBLISHED, label: 'Published (Publicly Visible)' },
                        { value: BlogStatus.DRAFT, label: 'Draft (Internal Only)' },
                        { value: BlogStatus.UNPUBLISHED, label: 'Unpublished (Hidden)' },
                        { value: BlogStatus.ARCHIVED, label: 'Archived' },
                      ]}
                    />
                  )}
                />
                {errors.status?.message && (
                  <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.status.message}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category <span className="text-rose-500">*</span>
                </label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onChange={(val) => field.onChange(val as BlogCategory)}
                      options={Object.values(BlogCategory).map((cat) => ({
                        value: cat,
                        label: BLOG_CATEGORY_LABELS[cat] || cat,
                      }))}
                    />
                  )}
                />
                {errors.category?.message && (
                  <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.category.message}</p>
                )}
              </div>

              {/* Author Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Author Name
                </label>
                <Input
                  {...register('authorName')}
                  placeholder="e.g. Motimahal Desk"
                />
                {errors.authorName?.message && (
                  <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.authorName.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Featured Cover Image */}
          <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 space-y-3 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Featured Cover Image
            </h2>
            <Controller
              name="imageId"
              control={control}
              render={({ field }) => (
                <MediaSelector
                  mode={MediaSelectorMode.SINGLE}
                  value={field.value}
                  onChange={(val) => field.onChange(val as string)}
                />
              )}
            />
            {errors.imageId?.message && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.imageId.message}</p>
            )}
          </div>

          {/* SEO Metadata Card */}
          <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <Globe className="w-4 h-4" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                SEO Metadata
              </h2>
            </div>

      

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Custom SEO Meta Title
                </label>
                <Input
                  {...register('seoTitle')}
                  placeholder={watchTitle || 'Fallback: Article Title'}
                />
                {errors.seoTitle?.message && (
                  <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.seoTitle.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Custom SEO Meta Description
                </label>
                <textarea
                  {...register('seoDescription')}
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-slate-400 outline-none transition-all"
                  placeholder={watchExcerpt || (watchContent ? watchContent.replace(/<[^>]*>/g, '').substring(0, 140) + '...' : 'Fallback: Article Excerpt')}
                />
                {errors.seoDescription?.message && (
                  <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.seoDescription.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  SEO Keywords <span className="text-slate-400 font-normal">(comma-separated)</span>
                </label>
                <Input
                  {...register('seoKeywords')}
                  placeholder="Chitwan, Motimahal Lodge, Bharatpur hotel, safari"
                />
                {errors.seoKeywords?.message && (
                  <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.seoKeywords.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
