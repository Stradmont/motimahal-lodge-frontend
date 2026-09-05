'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminSelect as Select } from '@/components/admin/common/AdminSelect';
import { GeneralContactInquiry, GeneralContactStatus, ContactActivityLog } from '@/lib/types/inquiry';
import { InquiryCustomerHeader } from '../inquiry/InquiryCustomerHeader';
import { InquiryMessageViewer } from '../inquiry/InquiryMessageViewer';
import { InquiryActivityTimeline } from '../inquiry/InquiryActivityTimeline';

interface ManageContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: GeneralContactInquiry | null;
  onSave: (updated: GeneralContactInquiry) => Promise<boolean | void> | void;
}

export function getStageBadge(status: GeneralContactStatus) {
  switch (status) {
    case GeneralContactStatus.NEW:
      return <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-2.5 py-0.5">New</Badge>;
    case GeneralContactStatus.IN_PROGRESS:
      return <Badge className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-2.5 py-0.5">In Progress</Badge>;
    case GeneralContactStatus.WAITING_FOR_CUSTOMER:
      return <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-medium text-xs px-2.5 py-0.5">Waiting for Customer</Badge>;
    case GeneralContactStatus.RESOLVED:
      return <Badge className="bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs px-2.5 py-0.5">Resolved</Badge>;
    case GeneralContactStatus.CLOSED:
      return <Badge variant="outline" className="text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 font-medium text-xs px-2.5 py-0.5">Closed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default function ManageContactModal({ isOpen, onClose, inquiry, onSave }: ManageContactModalProps) {
  const [selectedStage, setSelectedStage] = useState<GeneralContactStatus>(GeneralContactStatus.NEW);
  const [noteText, setNoteText] = useState('');
  const [showReplyComposer, setShowReplyComposer] = useState(false);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    if (inquiry) {
      setSelectedStage(inquiry.status || GeneralContactStatus.NEW);
      setNoteText(inquiry.internalNotes || '');
      setReplyText('');
      setShowReplyComposer(false);
    }
  }, [inquiry]);

  if (!inquiry) return null;

  const handleSaveChanges = async () => {
    const timestamp = new Date().toLocaleString('sv-SE').slice(0, 16);
    const logsToAdd: ContactActivityLog[] = [];

    // Stage change log
    let finalStage = selectedStage;
    if (showReplyComposer && replyText.trim()) {
      // Replying moves stage to WAITING_FOR_CUSTOMER if not already resolved/closed
      if (selectedStage !== GeneralContactStatus.RESOLVED && selectedStage !== GeneralContactStatus.CLOSED) {
        finalStage = GeneralContactStatus.WAITING_FOR_CUSTOMER;
      }
      logsToAdd.push({
        id: `act-${Date.now()}-1`,
        timestamp,
        action: `Reply email sent to guest (${inquiry.email})`,
        author: 'Admin Staff',
      });
    }

    if (finalStage !== inquiry.status) {
      logsToAdd.push({
        id: `act-${Date.now()}-2`,
        timestamp,
        action: `Stage changed: ${inquiry.status.replace(/_/g, ' ')} → ${finalStage.replace(/_/g, ' ')}`,
        author: 'Admin Staff',
      });
    }

    if (noteText.trim() !== (inquiry.internalNotes || '').trim()) {
      logsToAdd.push({
        id: `act-${Date.now()}-3`,
        timestamp,
        action: inquiry.internalNotes ? 'Internal team notes updated' : 'Internal team note added',
        author: 'Admin Staff',
      });
    }

    const updatedInquiry: GeneralContactInquiry = {
      ...inquiry,
      status: finalStage,
      internalNotes: noteText,
      history: [...logsToAdd, ...(inquiry.history || [])],
    };

    const res = await onSave(updatedInquiry);
    if (res !== false) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()} size="3xl">
      <DialogHeader>
        <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Manage contact inquiry
        </DialogTitle>
        <DialogDescription className="text-xs text-slate-500">
          Review request details, update lifecycle stage, record team notes, or email the guest.
        </DialogDescription>
      </DialogHeader>

      <DialogBody className="space-y-6">
        {/* Guest Header Info */}
        <InquiryCustomerHeader
          name={inquiry.name}
          email={inquiry.email}
          phone={inquiry.phone}
          date={inquiry.date}
          badge={getStageBadge(selectedStage)}
          categoryOrRoom={inquiry.category}
          isUrgent={inquiry.isUrgent}
          referenceId={inquiry.id}
        />

        {/* Customer Message */}
        <InquiryMessageViewer
          title={`Subject: ${inquiry.subject}`}
          message={inquiry.message}
        />

        {/* Unified Management Area */}
        <div className="space-y-5 pt-2 border-t border-slate-200 dark:border-slate-800">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Management & Workflow
          </h4>

          {/* Current Stage Control */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label htmlFor="stage-select" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Current stage
              </label>
              <Select
                id="stage-select"
                options={[
                  { value: GeneralContactStatus.NEW, label: 'New (Received)' },
                  { value: GeneralContactStatus.IN_PROGRESS, label: 'In Progress' },
                  { value: GeneralContactStatus.WAITING_FOR_CUSTOMER, label: 'Waiting for Customer' },
                  { value: GeneralContactStatus.RESOLVED, label: 'Resolved' },
                  { value: GeneralContactStatus.CLOSED, label: 'Closed' },
                ]}
                value={selectedStage}
                onChange={(val) => setSelectedStage(val as GeneralContactStatus)}
              />
            </div>
            <div className="text-xs text-slate-500">
              <span className="font-medium text-slate-700 dark:text-slate-300 block">Stage guideline</span>
              {selectedStage === GeneralContactStatus.NEW && 'Message received from website. Awaiting staff pick-up.'}
              {selectedStage === GeneralContactStatus.IN_PROGRESS && 'Staff actively processing guest request.'}
              {selectedStage === GeneralContactStatus.WAITING_FOR_CUSTOMER && 'Details sent to guest. Waiting for reply.'}
              {selectedStage === GeneralContactStatus.RESOLVED && 'Inquiry answered and request fulfilled.'}
              {selectedStage === GeneralContactStatus.CLOSED && 'Archived from active workflow.'}
            </div>
          </div>

          {/* Internal Notes */}
          <div className="space-y-1.5">
            <label htmlFor="internal-note" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Internal team notes
            </label>
            <textarea
              id="internal-note"
              rows={3}
              placeholder="Add notes for staff reference (e.g., Called guest, confirmed reservation details for Saturday)..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/50"
            />
          </div>

          {/* Optional Guest Email Response Section */}
          <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowReplyComposer(!showReplyComposer)}
              className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Compose Email Reply to Guest
              </span>
              {showReplyComposer ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {showReplyComposer && (
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-950">
                <div className="text-xs text-slate-500">
                  To: <span className="font-semibold text-slate-800 dark:text-slate-200">{inquiry.name}</span> ({inquiry.email})
                </div>
                <textarea
                  rows={4}
                  placeholder={`Dear ${inquiry.name},\n\nThank you for reaching out to Motimahal Lodge...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/50"
                />
                <p className="text-[11px] text-slate-500 italic">
                  Note: Sending a reply will automatically log the action and mark stage as "Waiting for Customer".
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Activity Timeline */}
        <InquiryActivityTimeline history={inquiry.history} />
      </DialogBody>

      {/* Single Unified Action Footer */}
      <DialogFooter>
        <Button type="button" variant="outline" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={handleSaveChanges}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-4"
        >
          Save changes
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
