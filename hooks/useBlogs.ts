'use client';

import { useState, useEffect, useCallback } from 'react';
import { BlogService, AdminBlogService, PublicBlogService } from '@/lib/services/blog.service';
import { BlogItem, BlogQueryParams } from '@/lib/types/blog';
import { ApiResponse } from '@/lib/api-client';
import { toast } from 'sonner';

export function useAdminBlogs(params?: BlogQueryParams) {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await AdminBlogService.getAll(params);
      if (res.success && res.data) {
        setBlogs(res.data);
        if (res.pagination) {
          setTotal(res.pagination.count || res.data.length);
        } else {
          setTotal(res.data.length);
        }
      } else {
        setError(res.message || 'Failed to fetch admin blogs');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch admin blogs');
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const createBlog = async (payload: Partial<BlogItem>): Promise<ApiResponse<BlogItem>> => {
    try {
      const res = await AdminBlogService.create(payload);
      if (res.success) {
        toast.success('Blog article created successfully!');
        fetchBlogs();
      } else {
        toast.error(res.message || 'Failed to create blog article');
      }
      return res;
    } catch (err: any) {
      toast.error(err.message || 'Error creating blog article');
      throw err;
    }
  };

  const updateBlog = async (id: string, payload: Partial<BlogItem>): Promise<ApiResponse<BlogItem>> => {
    try {
      const res = await AdminBlogService.update(id, payload);
      if (res.success) {
        toast.success('Blog article updated successfully!');
        fetchBlogs();
      } else {
        toast.error(res.message || 'Failed to update blog article');
      }
      return res;
    } catch (err: any) {
      toast.error(err.message || 'Error updating blog article');
      throw err;
    }
  };

  const deleteBlog = async (id: string): Promise<ApiResponse<null>> => {
    try {
      const res = await AdminBlogService.delete(id);
      if (res.success) {
        toast.success('Blog article deleted successfully!');
        fetchBlogs();
      } else {
        toast.error(res.message || 'Failed to delete blog article');
      }
      return res;
    } catch (err: any) {
      toast.error(err.message || 'Error deleting blog article');
      throw err;
    }
  };

  return {
    blogs,
    data: blogs,
    total,
    isLoading,
    error,
    refetch: fetchBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
  };
}

export function usePublicBlogs(params?: BlogQueryParams) {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await PublicBlogService.getAll(params);
      if (res.success && res.data) {
        setBlogs(res.data);
        if (res.pagination) {
          setTotal(res.pagination.count || res.data.length);
        } else {
          setTotal(res.data.length);
        }
      }
    } catch {
      // Graceful fallback
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return {
    blogs,
    total,
    isLoading,
    refetch: fetchBlogs,
  };
}

export const useBlogs = useAdminBlogs;
