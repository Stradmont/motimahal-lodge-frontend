'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import BlogForm from '@/components/admin/blogs/BlogForm';
import { useAdminBlogs } from '@/hooks/useBlogs';
import { AdminBlogService } from '@/lib/services/blog.service';
import { BlogItem } from '@/lib/types/blog';

interface EditBlogPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { updateBlog } = useAdminBlogs();

  const [blog, setBlog] = useState<BlogItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchBlog() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await AdminBlogService.getById(id);
        if (isMounted) {
          if (res.success && res.data) {
            setBlog(res.data);
          } else {
            setError(res.message || 'Article not found');
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch article details');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchBlog();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSubmit = async (data: Partial<BlogItem>) => {
    const res = await updateBlog(id, data);
    if (res.success) {
      router.push('/admin/blogs');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-3 font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-slate-600 dark:text-slate-400" />
        <p className="text-xs font-medium text-slate-500">Loading article details...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4 font-sans text-center px-4">
        <div className="p-3 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Unable to Load Article
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            {error || 'The requested article could not be found.'}
          </p>
        </div>
        <Link
          href="/admin/blogs"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-md bg-slate-900 hover:bg-slate-800 text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full font-sans">
      <BlogForm mode="edit" initialData={blog} onSubmit={handleSubmit} />
    </div>
  );
}
