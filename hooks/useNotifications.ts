'use client';

import { useState, useEffect, useCallback } from 'react';
import { NotificationService } from '@/lib/services/notification.service';
import { NotificationItem, NotificationQueryParams } from '@/lib/types/notification';

export function useNotifications(autoRefreshMs = 15000) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchNotifications = useCallback(async (params?: NotificationQueryParams) => {
    try {
      const res = await NotificationService.getAll(params);
      if (res.success && res.data) {
        setNotifications(res.data);
        if ((res as any).unreadCount !== undefined) {
          setUnreadCount((res as any).unreadCount);
        } else {
          setUnreadCount(res.data.filter((n) => !n.isRead).length);
        }
      }
    } catch {
      // Graceful error ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await NotificationService.getUnreadCount();
      if (res.success && res.data) {
        setUnreadCount(res.data.unreadCount);
      }
    } catch {
      // Graceful error ignore
    }
  }, []);

  useEffect(() => {
    fetchNotifications();

    if (autoRefreshMs > 0) {
      const interval = setInterval(() => {
        fetchNotifications();
      }, autoRefreshMs);
      return () => clearInterval(interval);
    }
  }, [fetchNotifications, autoRefreshMs]);

  const markAsRead = async (id: string) => {
    try {
      const res = await NotificationService.markAsRead(id);
      if (res.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      return res;
    } catch (err) {
      throw err;
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await NotificationService.markAllAsRead();
      if (res.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
      return res;
    } catch (err) {
      throw err;
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const res = await NotificationService.deleteNotification(id);
      if (res.success) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        fetchUnreadCount();
      }
      return res;
    } catch (err) {
      throw err;
    }
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    refetch: fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}
