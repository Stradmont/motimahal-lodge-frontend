'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Eye, Edit2, Trash2, CheckCircle2, XCircle, FileText, ExternalLink, ZoomIn } from 'lucide-react';
import AdminPageHeader from '@/components/admin/layout/AdminPageHeader';
import AdminFilterBar from '@/components/admin/layout/AdminFilterBar';
import ConfirmDeleteDialog from '@/components/admin/common/ConfirmDeleteDialog';
import BlogPreviewModal from '@/components/admin/blogs/BlogPreviewModal';
import FullMediaPreviewModal from '@/components/admin/common/FullMediaPreviewModal';
import { AdminDataTable, AdminColumn } from '@/components/admin/common/AdminDataTable';
import { useAdminBlogs } from '@/hooks/useBlogs';
import { BlogItem, BlogCategory, BlogStatus, BLOG_CATEGORY_LABELS } from '@/lib/types/blog';

export default function AdminBlogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const { blogs, isLoading, deleteBlog } = useAdminBlogs({
    search: searchTerm || undefined,
    status: activeFilter !== 'All' ? activeFilter : undefined,
    category: selectedCategory !== 'All' ? (selectedCategory as BlogCategory) : undefined,
  });

  const [previewBlog, setPreviewBlog] = useState<BlogItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BlogItem | null>(null);
  const [fullscreenMedia, setFullscreenMedia] = useState<{ src: string; title?: string } | null>(null);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteBlog(deleteTarget.id);
    setDeleteTarget(null);
  };

  const filterOptions = [
    { key: 'All', label: 'All Statuses' },
    { key: BlogStatus.PUBLISHED, label: 'Published' },
    { key: BlogStatus.DRAFT, label: 'Drafts' },
    { key: BlogStatus.UNPUBLISHED, label: 'Unpublished' },
    { key: BlogStatus.ARCHIVED, label: 'Archived' },
  ];

  const columns: AdminColumn<BlogItem>[] = [
    {
      key: 'article',
      header: 'Article',
      render: (blog: BlogItem) => (
        <div className="flex items-center gap-3">
          <div className="w-14 h-11 rounded border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 overflow-hidden shrink-0 relative group">
            {blog.image?.url ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={blog.image.url}
                  alt={blog.title}
                  className="w-full h-full object-cover cursor-pointer transition-transform duration-200 group-hover:scale-105"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFullscreenMedia({ src: blog.image!.url, title: blog.title });
                  }}
                  title="Click to view fullscreen image"
                />
                <div
                  className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer pointer-events-none"
                >
                  <ZoomIn className="w-3.5 h-3.5 text-white" />
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <FileText className="w-4 h-4" />
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <Link
              href={`/blog/${blog.slug}`}
              target="_blank"
              className="font-semibold text-xs text-slate-900 dark:text-slate-100 hover:text-amber-600 dark:hover:text-amber-400 hover:underline transition-colors flex items-center gap-1.5 group/link truncate max-w-[280px]"
              title="View live marketing page"
            >
              <span className="truncate">{blog.title}</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity text-amber-600 dark:text-amber-400 shrink-0" />
            </Link>
            <span className="text-[11px] text-slate-500 font-mono truncate max-w-[240px]">
              /{blog.slug}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (blog: BlogItem) => (
        <span className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap">
          {BLOG_CATEGORY_LABELS[blog.category] || blog.category}
        </span>
      ),
    },
    {
      key: 'author',
      header: 'Author',
      render: (blog: BlogItem) => (
        <span className="text-xs text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap">
          {blog.authorName || 'Motimahal Desk'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (blog: BlogItem) => {
        let badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900';
        if (blog.status === BlogStatus.DRAFT) {
          badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900';
        } else if (blog.status === BlogStatus.UNPUBLISHED) {
          badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800';
        } else if (blog.status === BlogStatus.ARCHIVED) {
          badgeStyle = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900';
        }

        return (
          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${badgeStyle} whitespace-nowrap inline-flex items-center gap-1`}>
            {blog.status === BlogStatus.PUBLISHED ? (
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            ) : (
              <XCircle className="w-3 h-3 text-amber-500" />
            )}
            <span>{blog.status}</span>
          </span>
        );
      },
    },
    {
      key: 'publishedAt',
      header: 'Published Date',
      render: (blog: BlogItem) => (
        <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
          {blog.publishedAt
            ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : 'Not published'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (blog: BlogItem) => (
        <div className="flex items-center justify-end gap-1.5">
          {/* View Details Modal */}
          <button
            type="button"
            onClick={() => setPreviewBlog(blog)}
            className="p-1.5 rounded text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
            title="Preview Article Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Edit Page Link */}
          <Link
            href={`/admin/blogs/${blog.id}/edit`}
            className="p-1.5 rounded text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
            title="Edit Article"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Link>

          {/* Delete */}
          <button
            type="button"
            onClick={() => setDeleteTarget(blog)}
            className="p-1.5 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            title="Delete Article"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <AdminPageHeader
        title="Blog & Hospitality Stories"
        description="Publish and manage travel guides, Chitwan safari tips, news, and hospitality stories."
        action={
          <Link
            href="/admin/blogs/create"
            className="px-3 py-1.5 text-xs font-semibold rounded-md bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Article</span>
          </Link>
        }
      />

      {/* Filter Bar */}
      <AdminFilterBar
        filterOptions={filterOptions}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search article title or slug..."
      />

      {/* Data Table */}
      <div className="w-full border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 overflow-hidden shadow-xs">
        <AdminDataTable<BlogItem>
          columns={columns}
          data={blogs}
          keyExtractor={(blog) => blog.id}
          isLoading={isLoading}
          emptyMessage="No blog articles found matching your criteria."
        />
      </div>

      {/* View / Preview Modal */}
      <BlogPreviewModal
        isOpen={!!previewBlog}
        onClose={() => setPreviewBlog(null)}
        blog={previewBlog}
      />

      {/* Delete Confirmation */}
      <ConfirmDeleteDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Blog Article"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This operation cannot be undone.`}
      />

      {/* Fullscreen Media Lightbox */}
      <FullMediaPreviewModal
        isOpen={!!fullscreenMedia}
        onClose={() => setFullscreenMedia(null)}
        src={fullscreenMedia?.src}
        title={fullscreenMedia?.title}
      />
    </div>
  );
}

