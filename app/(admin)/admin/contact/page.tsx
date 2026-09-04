'use client';

import React, { useState } from 'react';
import { Search, Eye, Archive, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: 'unread' | 'replied' | 'archived';
  category: string;
  isUrgent?: boolean;
}

const mockSubmissions: ContactSubmission[] = [
  {
    id: 'SUB-101',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+977 9841234567',
    subject: 'Deluxe River View Suite Booking for 3 Nights',
    message:
      'Hello Moti Mahal team, I am looking to book a Deluxe River View Suite for 3 adults from October 12th to 15th. Could you please confirm room availability and if airport pickup from Bharatpur Airport is available?',
    date: '2026-09-04 14:30',
    status: 'unread',
    category: 'Room Reservation',
    isUrgent: true,
  },
  {
    id: 'SUB-102',
    name: 'Sophia Patel',
    email: 'sophia.patel@gmail.com',
    phone: '+977 9808765432',
    subject: 'Family Dinner Reservation & Tandoori Menu Query',
    message:
      'We are planning a family dinner for 12 guests this Saturday evening around 7:30 PM. We would love a riverside table view and special tandoori platters.',
    date: '2026-09-04 11:15',
    status: 'unread',
    category: 'Restaurant & Dining',
  },
  {
    id: 'SUB-103',
    name: 'Bikash Thapa',
    email: 'bikash.thapa@company.com',
    phone: '+977 9856012345',
    subject: 'Corporate Team Retreat & Hall Booking',
    message:
      'We are organizing a corporate retreat for 25 executives in November. Please send us package details for lodging, meeting space, and breakfast/dinner buffets.',
    date: '2026-09-03 16:45',
    status: 'unread',
    category: 'Events & Catering',
  },
  {
    id: 'SUB-104',
    name: 'Maya Lin',
    email: 'maya.lin@traveler.org',
    phone: '+1 415 555 0192',
    subject: 'Chitwan Jungle Safari Package Inquiry',
    message:
      'Hi! Does Moti Mahal Lodge assist with arranging elephant/jeep safaris into Chitwan National Park? Thank you!',
    date: '2026-09-02 09:20',
    status: 'replied',
    category: 'General Inquiry',
  },
  {
    id: 'SUB-105',
    name: 'Rohan Shrestha',
    email: 'rohan.shrestha@nepalmail.np',
    phone: '+977 9812345678',
    subject: 'Honeymoon Package Details',
    message:
      'Namaste! We are newly married and looking for a quiet romantic stay near Narayani River.',
    date: '2026-09-01 18:10',
    status: 'replied',
    category: 'Room Reservation',
  },
  {
    id: 'SUB-106',
    name: 'Elena Rostova',
    email: 'elena.rostova@globemail.com',
    phone: '+44 20 7946 0912',
    subject: 'Group Tour Bus Parking Inquiry',
    message:
      'We have a tour group arriving by coach. Is there ample secure parking on site for a full-size bus?',
    date: '2026-08-30 13:00',
    status: 'archived',
    category: 'General Inquiry',
  },
];

export default function AdminContactPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>(mockSubmissions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'replied' | 'archived'>('all');
  const [activeMessage, setActiveMessage] = useState<ContactSubmission | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.subject.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedFilter === 'all') return matchesSearch;
    return matchesSearch && sub.status === selectedFilter;
  });

  const unreadCount = submissions.filter((s) => s.status === 'unread').length;

  const handleMarkStatus = (id: string, status: 'unread' | 'replied' | 'archived') => {
    setSubmissions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
    if (activeMessage?.id === id) {
      setActiveMessage((prev) => (prev ? { ...prev, status } : null));
    }
    showToast(`Inquiry marked as ${status}`);
  };

  const handleDeleteMessage = (id: string) => {
    setSubmissions((prev) => prev.filter((item) => item.id !== id));
    if (activeMessage?.id === id) {
      setActiveMessage(null);
    }
    showToast('Inquiry deleted');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeMessage) return;

    setIsSendingReply(true);
    setTimeout(() => {
      handleMarkStatus(activeMessage.id, 'replied');
      setIsSendingReply(false);
      setReplyText('');
      setActiveMessage(null);
      showToast(`Reply sent to ${activeMessage.email}`);
    }, 500);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  return (
    <div className="space-y-5">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-zinc-900 text-zinc-50 border border-zinc-700 px-4 py-2 rounded-sm text-sm font-medium shadow-md">
          {toastMessage}
        </div>
      )}

      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Contact Inquiries
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Review guest messages, room reservation queries, and send email responses.
          </p>
        </div>
      </div>

      {/* 2. Control Bar: Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-1">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 w-full sm:w-auto">
          {(['all', 'unread', 'replied', 'archived'] as const).map((filter) => {
            const isActive = selectedFilter === filter;
            return (
              <Button
                key={filter}
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedFilter(filter)}
                className="capitalize text-xs h-8"
              >
                {filter} {filter === 'unread' && unreadCount > 0 ? `(${unreadCount})` : ''}
              </Button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search guest name, email, subject..."
            className="pl-8 h-8 text-sm bg-white dark:bg-zinc-950"
          />
        </div>
      </div>

      {/* 3. Main Data Table */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-sm bg-white dark:bg-zinc-950 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guest Info</TableHead>
              <TableHead>Subject & Category</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubmissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-zinc-500 text-sm">
                  No contact inquiries match your filter or search query.
                </TableCell>
              </TableRow>
            ) : (
              filteredSubmissions.map((sub) => (
                <TableRow
                  key={sub.id}
                  onClick={() => setActiveMessage(sub)}
                  className="cursor-pointer"
                >
                  {/* Guest Info */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                        {sub.name}
                      </span>
                      {sub.isUrgent && (
                        <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                          Urgent
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {sub.email} • {sub.phone}
                    </p>
                  </TableCell>

                  {/* Subject & Category */}
                  <TableCell className="max-w-xs">
                    <span className="inline-block text-xs text-zinc-500 font-medium mb-0.5">
                      {sub.category}
                    </span>
                    <p className="font-medium text-zinc-900 dark:text-zinc-100 text-sm line-clamp-1">
                      {sub.subject}
                    </p>
                  </TableCell>

                  {/* Date */}
                  <TableCell className="text-xs text-zinc-500 whitespace-nowrap">
                    {sub.date}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    {sub.status === 'unread' && (
                      <Badge variant="default">New</Badge>
                    )}
                    {sub.status === 'replied' && (
                      <Badge variant="secondary">Replied</Badge>
                    )}
                    {sub.status === 'archived' && (
                      <Badge variant="outline">Archived</Badge>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right whitespace-nowrap">
                    <div
                      className="flex items-center justify-end gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setActiveMessage(sub)}
                        title="View message detail"
                      >
                        <Eye className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                      </Button>
                      {sub.status !== 'archived' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMarkStatus(sub.id, 'archived')}
                          title="Archive message"
                        >
                          <Archive className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteMessage(sub.id)}
                        title="Delete inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 4. Detail / Reply Modal Dialog */}
      <Dialog open={!!activeMessage} onOpenChange={(open) => !open && setActiveMessage(null)}>
        {activeMessage && (
          <div className="space-y-4">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>{activeMessage.subject}</DialogTitle>
                <Badge variant="outline">{activeMessage.category}</Badge>
              </div>
              <DialogDescription>
                From {activeMessage.name} ({activeMessage.email} • {activeMessage.phone}) on {activeMessage.date}
              </DialogDescription>
            </DialogHeader>

            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm p-4 text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap font-sans">
              {activeMessage.message}
            </div>

            <form onSubmit={handleSendReply} className="space-y-3 pt-2">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Send Reply Email to {activeMessage.email}
              </label>
              <textarea
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write response message..."
                className="w-full rounded-sm border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950"
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveMessage(null)}
                >
                  Close
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={!replyText.trim() || isSendingReply}
                >
                  {isSendingReply ? 'Sending...' : 'Send Reply Email'}
                </Button>
              </DialogFooter>
            </form>
          </div>
        )}
      </Dialog>
    </div>
  );
}
