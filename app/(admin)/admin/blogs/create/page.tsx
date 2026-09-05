'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import BlogForm from '@/components/admin/blogs/BlogForm';
import { useAdminBlogs } from '@/hooks/useBlogs';
import { BlogItem } from '@/lib/types/blog';

export default function CreateBlogPage() {
  const router = useRouter();
  const { createBlog } = useAdminBlogs();

  const handleSubmit = async (data: Partial<BlogItem>) => {
    const res = await createBlog(data);
    if (res.success) {
      router.push('/admin/blogs');
    }
  };

  return (
    <div className="w-full font-sans">
      <BlogForm mode="create" onSubmit={handleSubmit} />
    </div>
  );
}
