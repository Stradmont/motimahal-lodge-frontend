'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Settings } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminPageHeader from '@/components/admin/layout/AdminPageHeader';
import AdminFilterBar from '@/components/admin/layout/AdminFilterBar';
import ConfirmDeleteDialog from '@/components/admin/common/ConfirmDeleteDialog';
import { AdminDataTable } from '@/components/admin/common/AdminDataTable';
import { GeneralContactInquiry, GeneralContactStatus } from '@/lib/types/inquiry';
import ManageContactModal, { getStageBadge } from '@/components/admin/contact/ManageContactModal';
import { useContacts } from '@/hooks/useContacts';

export default function AdminContactPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const { submissions, isLoading, updateContact, deleteContact } = useContacts({
    status: selectedFilter,
    search: searchTerm,
  });

  const [managingContact, setManagingContact] = useState<GeneralContactInquiry | null>(null);
  const [deleteTargetSubmission, setDeleteTargetSubmission] = useState<GeneralContactInquiry | null>(null);

  const handleUpdateContact = async (updated: GeneralContactInquiry) => {
    try {
      const res = await updateContact(updated.id, updated);
      if (res.success) {
        toast.success(res.message || 'Updated contact inquiry');
        if (managingContact?.id === updated.id) {
          setManagingContact(updated);
        }
      } else {
        toast.error(res.message || 'Failed to update contact inquiry');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleConfirmDeleteSubmission = async () => {
    if (!deleteTargetSubmission) return;
    try {
      const res = await deleteContact(deleteTargetSubmission.id);
      if (res.success) {
        if (managingContact?.id === deleteTargetSubmission.id) {
          setManagingContact(null);
        }
        toast.success(res.message || 'Deleted contact submission from records');
      } else {
        toast.error(res.message || 'Failed to delete contact submission');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setDeleteTargetSubmission(null);
    }
  };

  const newCount = submissions.filter((s) => s.status === GeneralContactStatus.NEW).length;
  const inProgressCount = submissions.filter((s) => s.status === GeneralContactStatus.IN_PROGRESS).length;

  const filterOptions = [
    { key: 'all', label: 'All Inquiries' },
    { key: GeneralContactStatus.NEW, label: 'New', count: newCount },
    { key: GeneralContactStatus.IN_PROGRESS, label: 'In Progress', count: inProgressCount },
    { key: GeneralContactStatus.WAITING_FOR_CUSTOMER, label: 'Waiting for Customer' },
    { key: GeneralContactStatus.RESOLVED, label: 'Resolved' },
    { key: GeneralContactStatus.CLOSED, label: 'Closed' },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <AdminPageHeader
        title="Contact Submissions"
        description="Review guest messages, manage customer inquiry lifecycles, and record internal team notes."
        action={
          <Link href="/admin/settings">
            <Button size="sm" variant="outline">
              <Settings className="w-3.5 h-3.5 mr-1.5" />
              Contact Details Settings
            </Button>
          </Link>
        }
      />

      {/* Stage Filter Bar */}
      <AdminFilterBar
        filterOptions={filterOptions}
        activeFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search guest name, email, subject, category..."
      />

      {/* Main Data Table */}
      <AdminDataTable<GeneralContactInquiry>
        onRowClick={(sub) => setManagingContact(sub)}
        emptyMessage="No contact inquiries found matching criteria."
        isLoading={isLoading}
        columns={[
          {
            key: 'name',
            header: 'Guest specifications',
            render: (sub) => (
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                    {sub.name}
                  </span>
                  {sub.isUrgent && (
                    <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                      Urgent
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  {sub.email} • {sub.phone}
                </p>
              </div>
            ),
          },
          {
            key: 'subject',
            header: 'Category & subject',
            render: (sub) => (
              <div>
                <span className="inline-block text-xs text-slate-500 font-medium mb-0.5">
                  {sub.category}
                </span>
                <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm truncate max-w-lg">
                  {sub.subject}
                </p>
              </div>
            ),
          },
          {
            key: 'status',
            header: 'Stage',
            width: '180px',
            render: (sub) => getStageBadge(sub.status),
          },
          {
            key: 'date',
            header: 'Received at',
            width: '160px',
            render: (sub) => (
              <span className="text-xs text-slate-500 font-mono whitespace-nowrap">{sub.date}</span>
            ),
          },
          {
            key: 'actions',
            header: 'Actions',
            align: 'right',
            width: '140px',
            render: (sub) => (
              <div
                className="flex items-center justify-end gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setManagingContact(sub)}
                  title="Manage contact"
                  className="h-8 w-8 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteTargetSubmission(sub)}
                  title="Delete message"
                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ),
          },
        ]}
        data={submissions}
        keyExtractor={(sub) => sub.id}
        footer={<span>Showing {submissions.length} contact inquiry entries</span>}
      />

      {/* Stage Management Modal */}
      <ManageContactModal
        isOpen={!!managingContact}
        onClose={() => setManagingContact(null)}
        inquiry={managingContact}
        onSave={handleUpdateContact}
      />

      {/* Confirm Deletion Dialog */}
      <ConfirmDeleteDialog
        isOpen={!!deleteTargetSubmission}
        onClose={() => setDeleteTargetSubmission(null)}
        onConfirm={handleConfirmDeleteSubmission}
        title="Delete Contact Submission"
        description={`Are you sure you want to permanently delete the inquiry "${deleteTargetSubmission?.subject}" from ${deleteTargetSubmission?.name}?`}
      />
    </div>
  );
}
