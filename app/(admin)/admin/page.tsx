'use client';

import React from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Image as ImageIcon,
  Bed,
  Video,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';

export default function AdminDashboardOverview() {
  const cmsModules = [
    {
      title: 'Contact Inquiries',
      description: 'Review guest booking requests, restaurant reservations, and dispatch replies.',
      href: '/admin/contact',
      icon: MessageSquare,
      stat: '3 Unread',
    },
    {
      title: 'Gallery Media',
      description: 'Manage photo collections, high-res lodge imagery, and categories.',
      href: '/admin/gallery',
      icon: ImageIcon,
      stat: '24 Photos',
    },
    {
      title: 'Rooms & Rates',
      description: 'Update room pricing tiers, guest capacity, and availability status.',
      href: '/admin/rooms',
      icon: Bed,
      stat: '4 Rooms',
    },
    {
      title: 'Videos & Tours',
      description: 'Curate resort video links, YouTube embeds, and promotional showcases.',
      href: '/admin/videos',
      icon: Video,
      stat: '4 Videos',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Moti Mahal Administration
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Centralized CMS for managing room inventories, contact submissions, gallery media, and promotional video content.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/contact">
            <Button size="sm">View Messages (3)</Button>
          </Link>
          <Link href="/" target="_blank">
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-1.5" /> Public Site
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. CMS Modules Grid */}
      <div>
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
          Content Modules
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cmsModules.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-sm bg-white dark:bg-zinc-950 p-4 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors group cursor-pointer h-full flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                          <Icon className="w-4 h-4" />
                        </div>
                        <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-50">
                          {item.title}
                        </h4>
                      </div>
                      <Badge variant="outline">{item.stat}</Badge>
                    </div>

                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-normal">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    <span>Manage {item.title}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 3. Activity Table & System Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        <div className="lg:col-span-2 border border-zinc-200 dark:border-zinc-800 rounded-sm bg-white dark:bg-zinc-950 overflow-hidden">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-50">
              Recent Activity Log
            </h4>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Module</TableHead>
                <TableHead className="text-right">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium text-sm">
                  New inquiry received from Aarav Sharma (Deluxe Suite)
                </TableCell>
                <TableCell>
                  <Badge variant="outline">Contact</Badge>
                </TableCell>
                <TableCell className="text-right text-xs text-zinc-500">
                  Today, 14:30
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium text-sm">
                  Dispatched email response to Maya Lin
                </TableCell>
                <TableCell>
                  <Badge variant="outline">Contact</Badge>
                </TableCell>
                <TableCell className="text-right text-xs text-zinc-500">
                  Yesterday, 09:20
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium text-sm">
                  Updated Gallery photo: Riverfront Sunset View
                </TableCell>
                <TableCell>
                  <Badge variant="outline">Gallery</Badge>
                </TableCell>
                <TableCell className="text-right text-xs text-zinc-500">
                  Sep 01, 2026
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 rounded-sm bg-white dark:bg-zinc-950 p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-50 border-b border-zinc-200 dark:border-zinc-800 pb-2">
              System Environment
            </h4>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-900">
                <span className="text-zinc-500">Active Role:</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">Administrator</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-900">
                <span className="text-zinc-500">CMS Engine:</span>
                <span className="font-mono text-zinc-700 dark:text-zinc-300">Next.js App Router</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-500">Status:</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">Operational</span>
              </div>
            </div>
          </div>

          <Link href="/admin/contact">
            <Button className="w-full text-sm">Go to Inquiries</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
