'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import FullMediaPreviewModal from '@/components/admin/common/FullMediaPreviewModal';
import { BlogItem, BlogCategory, BlogStatus, BLOG_CATEGORY_LABELS } from '@/lib/types/blog';
import {
  Calendar,
  User,
  Globe,
  Edit2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  ZoomIn,
} from 'lucide-react';

interface BlogPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  blog: BlogItem | null;
}

export default function BlogPreviewModal({
  isOpen,
  onClose,
  blog,
}: BlogPreviewModalProps) {
  const [fullscreenSrc, setFullscreenSrc] = useState<string | null>(null);

  if (!blog) return null;

  const formattedPublishedDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Not published';

  const formattedCreatedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose} size="3xl">
        <div className="font-sans">
          <DialogHeader>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                  {BLOG_CATEGORY_LABELS[blog.category] || blog.category}
                </span>
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border inline-flex items-center gap-1 ${
                    blog.status === BlogStatus.PUBLISHED
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300'
                  }`}
                >
                  {blog.status === BlogStatus.PUBLISHED ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <XCircle className="w-3 h-3 text-amber-500" />
                  )}
                  <span>{blog.status}</span>
                </span>
              </div>

              {blog.status === BlogStatus.PUBLISHED && (
                <Link
                  href={`/blog/${blog.slug}`}
                  target="_blank"
                  className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>Live Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-2 leading-tight">
              {blog.title}
            </DialogTitle>

            <DialogDescription className="text-xs text-slate-500 font-mono mt-1">
              /{blog.slug}
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="space-y-6 py-4 max-h-[70vh] overflow-y-auto">
            {/* Metadata bar */}
            <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 pb-3 border-b border-slate-200 dark:border-slate-800 flex-wrap">
              <span className="flex items-center gap-1.5 font-medium">
                <User className="w-3.5 h-3.5 text-amber-600" />
                {blog.authorName || 'Motimahal Team'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                Published: {formattedPublishedDate}
              </span>
              <span>•</span>
              <span className="text-slate-400">Created: {formattedCreatedDate}</span>
            </div>

            {/* Featured Cover Image with Fullscreen Lightbox trigger */}
            {blog.image?.url && (
              <div
                onClick={() => setFullscreenSrc(blog.image!.url)}
                className="w-full h-64 sm:h-72 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 relative group cursor-pointer"
                title="Click to view full image"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={blog.image.url}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ZoomIn className="w-5 h-5 text-white" />
                </div>
              </div>
            )}

            {/* Excerpt */}
            {blog.excerpt && (
              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-lg border-l-4 border-amber-600 text-slate-800 dark:text-slate-200 italic text-sm leading-relaxed">
                &ldquo;{blog.excerpt}&rdquo;
              </div>
            )}

            {/* Full Rich Text Content */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Article Content
              </h3>
              <div
                className="prose dark:prose-invert max-w-none text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans space-y-3 [&_img]:rounded-lg [&_img]:max-h-96 [&_img]:object-cover [&_img]:cursor-pointer [&_img]:transition-transform [&_img]:hover:scale-[1.02]"
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.tagName === 'IMG') {
                    const src = (target as HTMLImageElement).src;
                    if (src) {
                      setFullscreenSrc(src);
                    }
                  }
                }}
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>

            {/* SEO Metadata Breakdown */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Globe className="w-4 h-4" />
                <span>SEO Details</span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Meta Title: </span>
                  <span className="text-slate-600 dark:text-slate-400">{blog.seoTitle || blog.title}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Meta Description: </span>
                  <span className="text-slate-600 dark:text-slate-400">{blog.seoDescription || blog.excerpt || 'Default fallback'}</span>
                </div>
                {blog.seoKeywords && (
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Keywords: </span>
                    <span className="text-slate-600 dark:text-slate-400">{blog.seoKeywords}</span>
                  </div>
                )}
              </div>
            </div>
          </DialogBody>

          <DialogFooter className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-3">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>

            <Link
              href={`/admin/blogs/${blog.id}/edit`}
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-md bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Article</span>
            </Link>
          </DialogFooter>
        </div>
      </Dialog>

      {/* Fullscreen Lightbox */}
      <FullMediaPreviewModal
        isOpen={!!fullscreenSrc}
        onClose={() => setFullscreenSrc(null)}
        src={fullscreenSrc}
        title={blog.title}
      />
    </>
  );
}
