'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Send, ChevronDown, ChevronUp, BedDouble, Calendar, Users } from 'lucide-react';
import { toast } from 'sonner';

import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminSelect as Select } from '@/components/admin/common/AdminSelect';
import { RoomInquiry, RoomInquiryStatus, ContactActivityLog } from '@/lib/types/inquiry';
import { InquiryCustomerHeader } from '../inquiry/InquiryCustomerHeader';
import { InquiryMessageViewer } from '../inquiry/InquiryMessageViewer';
import { InquiryActivityTimeline } from '../inquiry/InquiryActivityTimeline';

interface ManageRoomInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: RoomInquiry | null;
  onSave: (updated: RoomInquiry) => void;
}

export function getRoomInquiryStageBadge(status: RoomInquiryStatus) {
  switch (status) {
    case RoomInquiryStatus.NEW:
      return <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-2.5 py-0.5">New</Badge>;
    case RoomInquiryStatus.IN_PROGRESS:
      return <Badge className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-2.5 py-0.5">In Progress</Badge>;
    case RoomInquiryStatus.WAITING_FOR_CUSTOMER:
      return <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-medium text-xs px-2.5 py-0.5">Waiting for Customer</Badge>;
    case RoomInquiryStatus.CONFIRMED:
      return <Badge className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs px-2.5 py-0.5">Confirmed</Badge>;
    case RoomInquiryStatus.RESOLVED:
      return <Badge className="bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs px-2.5 py-0.5">Resolved</Badge>;
    case RoomInquiryStatus.CLOSED:
      return <Badge variant="outline" className="text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 font-medium text-xs px-2.5 py-0.5">Closed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default function ManageRoomInquiryModal({ isOpen, onClose, inquiry, onSave }: ManageRoomInquiryModalProps) {
  const [selectedStage, setSelectedStage] = useState<RoomInquiryStatus>(RoomInquiryStatus.NEW);
  const [noteText, setNoteText] = useState('');
  const [showReplyComposer, setShowReplyComposer] = useState(false);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    if (inquiry) {
      setSelectedStage(inquiry.status || RoomInquiryStatus.NEW);
      setNoteText(inquiry.internalNotes || '');
      setReplyText('');
      setShowReplyComposer(false);
    }
  }, [inquiry]);

  if (!inquiry) return null;

  const handleSaveChanges = () => {
    const timestamp = new Date().toLocaleString('sv-SE').slice(0, 16);
    const logsToAdd: ContactActivityLog[] = [];

    // Stage change log
    let finalStage = selectedStage;
    if (showReplyComposer && replyText.trim()) {
      if (selectedStage !== RoomInquiryStatus.CONFIRMED && selectedStage !== RoomInquiryStatus.RESOLVED && selectedStage !== RoomInquiryStatus.CLOSED) {
        finalStage = RoomInquiryStatus.WAITING_FOR_CUSTOMER;
      }
      logsToAdd.push({
        id: `act-${Date.now()}-1`,
        timestamp,
        action: `Quotation & availability email sent to guest (${inquiry.email})`,
        author: 'Reservations Staff',
      });
    }

    if (finalStage !== inquiry.status) {
      logsToAdd.push({
        id: `act-${Date.now()}-2`,
        timestamp,
        action: `Stage changed: ${inquiry.status.replace(/_/g, ' ')} → ${finalStage.replace(/_/g, ' ')}`,
        author: 'Reservations Staff',
      });
    }

    if (noteText.trim() !== (inquiry.internalNotes || '').trim()) {
      logsToAdd.push({
        id: `act-${Date.now()}-3`,
        timestamp,
        action: inquiry.internalNotes ? 'Internal team notes updated' : 'Internal team note added',
        author: 'Reservations Staff',
      });
    }

    const updatedInquiry: RoomInquiry = {
      ...inquiry,
      status: finalStage,
      internalNotes: noteText,
      history: [...logsToAdd, ...(inquiry.history || [])],
    };

    onSave(updatedInquiry);
    toast.success('Room inquiry record updated successfully');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()} size="3xl">
      <DialogHeader>
        <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Manage room inquiry
        </DialogTitle>
        <DialogDescription className="text-xs text-slate-500">
          Review guest accommodation specs, check availability, update lifecycle stage, and record notes.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6 py-4 font-sans max-h-[75vh] overflow-y-auto pr-1">
        {/* Guest Header Info */}
        <InquiryCustomerHeader
          name={inquiry.guestName}
          email={inquiry.email}
          phone={inquiry.phone}
          date={inquiry.date}
          badge={getRoomInquiryStageBadge(selectedStage)}
          categoryOrRoom={inquiry.roomType}
          isUrgent={inquiry.isUrgent}
          referenceId={inquiry.id}
        />

        {/* Room & Stay Specifications Summary */}
        <div className="p-3.5 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 space-y-2">
          <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
            Booking & Stay specifications
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <BedDouble className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
              <div>
                <span className="text-slate-500 block text-[11px]">Requested Room</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{inquiry.roomType}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
              <div>
                <span className="text-slate-500 block text-[11px]">Check-in / Check-out</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{inquiry.checkIn} to {inquiry.checkOut}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
              <div>
                <span className="text-slate-500 block text-[11px]">Guest Count</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{inquiry.guestsCount} {inquiry.guestsCount === 1 ? 'Guest' : 'Guests'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Guest Special Requests / Notes */}
        {inquiry.specialRequests ? (
          <InquiryMessageViewer
            title="Guest special requests & notes"
            message={inquiry.specialRequests}
          />
        ) : (
          <div className="text-xs text-slate-500 italic">
            No special requests provided with this inquiry.
          </div>
        )}

        {/* Unified Management Area */}
        <div className="space-y-5 pt-2 border-t border-slate-200 dark:border-slate-800">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Management & Workflow
          </h4>

          {/* Stage Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label htmlFor="room-stage-select" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Current stage
              </label>
              <Select
                id="room-stage-select"
                options={[
                  { value: RoomInquiryStatus.NEW, label: 'New (Received)' },
                  { value: RoomInquiryStatus.IN_PROGRESS, label: 'In Progress' },
                  { value: RoomInquiryStatus.WAITING_FOR_CUSTOMER, label: 'Waiting for Customer' },
                  { value: RoomInquiryStatus.CONFIRMED, label: 'Confirmed' },
                  { value: RoomInquiryStatus.RESOLVED, label: 'Resolved' },
                  { value: RoomInquiryStatus.CLOSED, label: 'Closed' },
                ]}
                value={selectedStage}
                onChange={(val) => setSelectedStage(val as RoomInquiryStatus)}
              />
            </div>
            <div className="text-xs text-slate-500">
              <span className="font-medium text-slate-700 dark:text-slate-300 block">Stage guideline</span>
              {selectedStage === RoomInquiryStatus.NEW && 'New booking inquiry. Awaiting availability check.'}
              {selectedStage === RoomInquiryStatus.IN_PROGRESS && 'Reservations checking room inventory & rates.'}
              {selectedStage === RoomInquiryStatus.WAITING_FOR_CUSTOMER && 'Quotation sent. Awaiting guest deposit or confirmation.'}
              {selectedStage === RoomInquiryStatus.CONFIRMED && 'Room booked and reserved in hotel system.'}
              {selectedStage === RoomInquiryStatus.RESOLVED && 'Guest stay completed and finalized.'}
              {selectedStage === RoomInquiryStatus.CLOSED && 'Inquiry archived or cancelled.'}
            </div>
          </div>

          {/* Internal Notes */}
          <div className="space-y-1.5">
            <label htmlFor="room-internal-note" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Internal team notes
            </label>
            <textarea
              id="room-internal-note"
              rows={3}
              placeholder="Add notes for reservations staff (e.g. Cottage #3 reserved, airport transfer requested)..."
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
                Compose Quotation & Email Response
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
                  To: <span className="font-semibold text-slate-800 dark:text-slate-200">{inquiry.guestName}</span> ({inquiry.email})
                </div>
                <textarea
                  rows={4}
                  placeholder={`Dear ${inquiry.guestName},\n\nThank you for inquiring about ${inquiry.roomType} for ${inquiry.checkIn} to ${inquiry.checkOut}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/50"
                />
                <p className="text-[11px] text-slate-500 italic">
                  Note: Sending a quotation will automatically log the action and mark stage as "Waiting for Customer".
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Activity Timeline */}
        <InquiryActivityTimeline history={inquiry.history} />
      </div>

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
