'use client';

import { useState, useEffect, useCallback } from 'react';
import { BlogService, BlogItem } from '@/lib/services/blog.service';
import { ApiResponse } from '@/lib/api-client';

export function useBlogs(params?: any) {
  const [data, setData] = useState<BlogItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await BlogService.getAll(params);
      if (res.success && res.data) setData(res.data);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const createBlog = async (payload: Partial<BlogItem>): Promise<ApiResponse<BlogItem>> => {
    const res = await BlogService.create(payload);
    if (res.success) fetchBlogs();
    return res;
  };

  const updateBlog = async (id: string, payload: Partial<BlogItem>): Promise<ApiResponse<BlogItem>> => {
    const res = await BlogService.update(id, payload);
    if (res.success) fetchBlogs();
    return res;
  };

  const deleteBlog = async (id: string): Promise<ApiResponse<null>> => {
    const res = await BlogService.delete(id);
    if (res.success) fetchBlogs();
    return res;
  };

  return {
    blogs: data,
    data,
    isLoading,
    refetch: fetchBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
  };
}
