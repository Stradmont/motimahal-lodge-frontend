'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Bed, Calendar, Users } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminPageHeader from '@/components/admin/layout/AdminPageHeader';
import AdminFilterBar from '@/components/admin/layout/AdminFilterBar';
import ConfirmDeleteDialog from '@/components/admin/common/ConfirmDeleteDialog';
import { AdminDataTable } from '@/components/admin/common/AdminDataTable';
import { RoomInquiry, RoomInquiryStatus } from '@/lib/types/inquiry';
import ManageRoomInquiryModal, { getRoomInquiryStageBadge } from '@/components/admin/rooms/ManageRoomInquiryModal';
import { useInquiries } from '@/hooks/useInquiries';

export default function AdminRoomInquiriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const { inquiries, isLoading, updateInquiry, deleteInquiry } = useInquiries({
    status: selectedFilter,
    search: searchTerm,
  });

  const [managingInquiry, setManagingInquiry] = useState<RoomInquiry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RoomInquiry | null>(null);

  const handleUpdateInquiry = async (updated: RoomInquiry) => {
    try {
      const res = await updateInquiry(updated.id, updated);
      if (res.success) {
        toast.success(res.message || 'Room inquiry updated successfully');
        if (managingInquiry?.id === updated.id) {
          setManagingInquiry(updated);
        }
      } else {
        toast.error(res.message || 'Failed to update room inquiry');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await deleteInquiry(deleteTarget.id);
      if (res.success) {
        if (managingInquiry?.id === deleteTarget.id) {
          setManagingInquiry(null);
        }
        toast.success(res.message || 'Deleted room inquiry from records');
      } else {
        toast.error(res.message || 'Failed to delete room inquiry');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setDeleteTarget(null);
    }
  };

  const newCount = inquiries.filter((i) => i.status === RoomInquiryStatus.NEW).length;
  const inProgressCount = inquiries.filter((i) => i.status === RoomInquiryStatus.IN_PROGRESS).length;

  const filterOptions = [
    { key: 'all', label: 'All Room Inquiries' },
    { key: RoomInquiryStatus.NEW, label: 'New', count: newCount },
    { key: RoomInquiryStatus.IN_PROGRESS, label: 'In Progress', count: inProgressCount },
    { key: RoomInquiryStatus.WAITING_FOR_CUSTOMER, label: 'Waiting for Customer' },
    { key: RoomInquiryStatus.CONFIRMED, label: 'Confirmed' },
    { key: RoomInquiryStatus.RESOLVED, label: 'Resolved' },
    { key: RoomInquiryStatus.CLOSED, label: 'Closed' },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <AdminPageHeader
        title="Room Booking Inquiries"
        description="Review guest stay inquiries, manage availability quotations, track lifecycle stages, and record team notes."
        action={
          <Link href="/admin/rooms">
            <Button size="sm" className="bg-brand-green hover:bg-brand-green-dark text-white">
              <Bed className="w-4 h-4 mr-1.5" />
              Manage Rooms Inventory
            </Button>
          </Link>
        }
      />

      {/* Filter Bar */}
      <AdminFilterBar
        filterOptions={filterOptions}
        activeFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search guest name, email, room type..."
      />

      {/* Main Data Table */}
      <AdminDataTable<RoomInquiry>
        onRowClick={(item) => setManagingInquiry(item)}
        emptyMessage="No room inquiries found matching criteria."
        isLoading={isLoading}
        columns={[
          {
            key: 'guestName',
            header: 'Guest specifications',
            render: (item) => (
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                    {item.guestName}
                  </span>
                  {item.isUrgent && (
                    <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                      Urgent
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  {item.email} • {item.phone}
                </p>
              </div>
            ),
          },
          {
            key: 'roomType',
            header: 'Room & stay dates',
            render: (item) => (
              <div>
                <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm block">
                  {item.roomType}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 font-mono">
                  <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>
                    {item.checkIn} to {item.checkOut}
                  </span>
                </div>
              </div>
            ),
          },
          {
            key: 'guestsCount',
            header: 'Party size',
            width: '130px',
            render: (item) => (
              <div className="flex items-center gap-1 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>{item.guestsCount} {item.guestsCount === 1 ? 'Guest' : 'Guests'}</span>
              </div>
            ),
          },
          {
            key: 'status',
            header: 'Stage',
            width: '180px',
            render: (item) => getRoomInquiryStageBadge(item.status),
          },
          {
            key: 'date',
            header: 'Submitted at',
            width: '150px',
            render: (item) => (
              <span className="text-xs text-slate-500 font-mono whitespace-nowrap">{item.date}</span>
            ),
          },
          {
            key: 'actions',
            header: 'Actions',
            align: 'right',
            width: '140px',
            render: (item) => (
              <div
                className="flex items-center justify-end gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setManagingInquiry(item)}
                  title="Manage room inquiry"
                  className="h-8 w-8 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteTarget(item)}
                  title="Delete room inquiry"
                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ),
          },
        ]}
        data={inquiries}
        keyExtractor={(item) => item.id}
        footer={<span>Showing {inquiries.length} room inquiry entries</span>}
      />

      {/* Stage Management Modal */}
      <ManageRoomInquiryModal
        isOpen={!!managingInquiry}
        onClose={() => setManagingInquiry(null)}
        inquiry={managingInquiry}
        onSave={handleUpdateInquiry}
      />

      {/* Confirm Deletion Dialog */}
      <ConfirmDeleteDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Room Inquiry"
        description={`Are you sure you want to permanently delete the room inquiry for "${deleteTarget?.roomType}" submitted by ${deleteTarget?.guestName}?`}
      />
    </div>
  );
}
