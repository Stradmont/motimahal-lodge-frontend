'use client';

import React, { useState } from 'react';
import { Eye, Archive, Trash2, AlertCircle } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import AdminPageHeader from '@/components/admin/layout/AdminPageHeader';
import AdminFilterBar from '@/components/admin/layout/AdminFilterBar';

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

const replySchema = z.object({
  replyText: z
    .string()
    .trim()
    .min(1, { message: 'Reply message text is required' })
    .min(5, { message: 'Reply message must be at least 5 characters long' }),
});

type ReplyFormData = z.infer<typeof replySchema>;

export default function AdminContactPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>(mockSubmissions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [activeMessage, setActiveMessage] = useState<ContactSubmission | null>(null);
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReplyFormData>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      replyText: '',
    },
    mode: 'onBlur',
  });

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

  const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread', count: unreadCount },
    { key: 'replied', label: 'Replied' },
    { key: 'archived', label: 'Archived' },
  ];

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

  const onSendReplySubmit = (data: ReplyFormData) => {
    if (!activeMessage) return;

    setIsSendingReply(true);
    setTimeout(() => {
      handleMarkStatus(activeMessage.id, 'replied');
      setIsSendingReply(false);
      reset();
      setActiveMessage(null);
      showToast(`Reply sent to ${activeMessage.email}`);
    }, 500);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  return (
    <div>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-zinc-900 text-zinc-50 border border-zinc-700 px-4 py-2 rounded-sm text-sm font-medium shadow-md">
          {toastMessage}
        </div>
      )}

      {/* Reusable Page Header */}
      <AdminPageHeader
        title="Contact Inquiries"
        description="Review guest messages, room reservation queries, and send email responses."
      />

      {/* Reusable Control & Search Bar */}
      <AdminFilterBar
        filterOptions={filterOptions}
        activeFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search guest name, email, subject..."
      />

      {/* Main Data Table */}
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
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                        {sub.name}
                      </span>
                      {sub.isUrgent && (
                        <Badge variant="destructive" className="text-xs px-1.5 py-0">
                          Urgent
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {sub.email} • {sub.phone}
                    </p>
                  </TableCell>

                  <TableCell className="max-w-xs">
                    <span className="inline-block text-xs text-zinc-500 font-medium mb-0.5">
                      {sub.category}
                    </span>
                    <p className="font-medium text-zinc-900 dark:text-zinc-100 text-sm line-clamp-1">
                      {sub.subject}
                    </p>
                  </TableCell>

                  <TableCell className="text-sm text-zinc-500 whitespace-nowrap">
                    {sub.date}
                  </TableCell>

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

      {/* Detail / Reply Modal Dialog - Spacious size="3xl" */}
      <Dialog open={!!activeMessage} onOpenChange={(open) => !open && setActiveMessage(null)} size="3xl">
        {activeMessage && (
          <div className="space-y-4 font-sans">
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

            <form onSubmit={handleSubmit(onSendReplySubmit)} noValidate className="space-y-3 pt-2 font-sans">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Send Reply Email to {activeMessage.email} <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  {...register('replyText')}
                  placeholder="Write response message..."
                  className={`w-full rounded-sm border ${
                    errors.replyText ? 'border-rose-500 focus:ring-rose-500' : 'border-zinc-300 dark:border-zinc-700'
                  } bg-white dark:bg-zinc-950 p-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none font-sans`}
                />
                {errors.replyText && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.replyText.message}
                  </p>
                )}
              </div>

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
                  disabled={isSendingReply}
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
