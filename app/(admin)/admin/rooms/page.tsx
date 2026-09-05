'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Eye, Loader2, CalendarCheck, ZoomIn, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter } from '@/components/ui/dialog';
import AdminPageHeader from '@/components/admin/layout/AdminPageHeader';
import AdminFilterBar from '@/components/admin/layout/AdminFilterBar';
import ConfirmDeleteDialog from '@/components/admin/common/ConfirmDeleteDialog';
import RoomFormModal from '@/components/admin/rooms/RoomFormModal';
import FullMediaPreviewModal from '@/components/admin/common/FullMediaPreviewModal';
import { RoomItem, CreateRoomInput, RoomCategory, RoomStatus } from '@/lib/types/room';
import { useRooms } from '@/hooks/useRooms';

interface SortableRoomRowProps {
  room: RoomItem;
  index: number;
  onFullscreenMediaRequested: (media: { src: string; title: string }) => void;
  onPreviewRequested: (room: RoomItem) => void;
  onEditRequested: (room: RoomItem) => void;
  onDeleteRequested: (room: RoomItem) => void;
  isDragDisabled: boolean;
}

function SortableRoomRow({
  room,
  index,
  onFullscreenMediaRequested,
  onPreviewRequested,
  onEditRequested,
  onDeleteRequested,
  isDragDisabled,
}: SortableRoomRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: room.id, disabled: isDragDisabled });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    position: 'relative',
    zIndex: isDragging ? 40 : 1,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={`transition-colors border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/80 dark:hover:bg-slate-900/50 ${
        isDragging
          ? 'bg-amber-50/80 dark:bg-amber-950/40 shadow-md ring-1 ring-amber-300 dark:ring-amber-800'
          : ''
      }`}
    >
      <TableCell className="py-3.5 px-4 text-sm align-middle w-28">
        <div className="flex items-center gap-2">
          <button
            type="button"
            {...attributes}
            {...listeners}
            disabled={isDragDisabled}
            className={`p-1.5 rounded transition-colors ${
              isDragDisabled
                ? 'opacity-30 cursor-not-allowed text-slate-300 dark:text-slate-600'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-grab active:cursor-grabbing hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isDragDisabled ? 'Clear search/filter to reorder' : 'Drag to reorder display sequence'}
          >
            <GripVertical className="w-4 h-4 shrink-0" />
          </button>
          <Badge variant="outline" className="text-[11px] font-mono px-2 py-0.5 font-semibold shrink-0">
            #{index + 1}
          </Badge>
        </div>
      </TableCell>

      <TableCell className="py-3.5 px-4 text-sm align-middle">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              onFullscreenMediaRequested({
                src: room.image?.url || '',
                title: room.name,
              })
            }
            className="relative group shrink-0 rounded overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-400"
            title="Click to view full media"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={room.image?.url}
              alt={room.name}
              className="w-12 h-9 object-cover transition-transform duration-200 group-hover:scale-110"
              
            />
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <ZoomIn className="w-3.5 h-3.5 text-white" />
            </div>
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <Link
                href={`/rooms/${room.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-slate-900 dark:text-slate-100 text-sm hover:underline cursor-pointer"
                title="View public room page"
              >
                {room.name}
              </Link>
              {room.isFeatured && (
                <Badge variant="outline" className="text-[10px] py-0 px-1 text-amber-600 border-amber-300">
                  Featured
                </Badge>
              )}
            </div>
            {room.bedType && (
              <div className="text-xs text-slate-500 font-sans mt-0.5">
                {room.bedType}
              </div>
            )}
          </div>
        </div>
      </TableCell>

      <TableCell className="py-3.5 px-4 text-sm align-middle w-32">
        <Badge variant="outline" className="text-xs font-normal">
          {room.type}
        </Badge>
      </TableCell>

      <TableCell className="py-3.5 px-4 text-sm align-middle w-36">
        <span className="font-semibold text-sm text-slate-900 dark:text-slate-100 font-mono">
          NPR {room.pricePerNight.toLocaleString()}
        </span>
      </TableCell>

      <TableCell className="py-3.5 px-4 text-sm align-middle w-40">
        <div>
          <div className="text-sm text-slate-700 dark:text-slate-300 font-medium">{room.capacity} Guests</div>
          <span className="text-xs text-slate-400 font-mono">
            {room.totalUnits || 1} {room.totalUnits === 1 ? 'unit' : 'units'}
          </span>
        </div>
      </TableCell>

      <TableCell className="py-3.5 px-4 text-sm align-middle w-32">
        {room.status === RoomStatus.AVAILABLE && <Badge variant="success">Available</Badge>}
        {room.status === RoomStatus.OCCUPIED && <Badge variant="secondary">Occupied</Badge>}
        {room.status === RoomStatus.MAINTENANCE && <Badge variant="destructive">Maintenance</Badge>}
      </TableCell>

      <TableCell className="py-3.5 px-4 text-sm align-middle w-48 text-right">
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPreviewRequested(room)}
            title="View details"
            className="h-8 w-8"
          >
            <Eye className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEditRequested(room)}
            title="Edit room"
            className="h-8 w-8"
          >
            <Pencil className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDeleteRequested(room)}
            className="h-8 w-8"
            title="Delete room"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function AdminRoomsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');

  // Domain API Hook
  const { rooms, isLoading, createRoom, updateRoom, updateRoomStatus, deleteRoom } = useRooms({
    type: filterType,
    search: searchTerm,
  });

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedRoom, setSelectedRoom] = useState<RoomItem | null>(null);
  const [deleteTargetRoom, setDeleteTargetRoom] = useState<RoomItem | null>(null);
  const [previewRoom, setPreviewRoom] = useState<RoomItem | null>(null);
  const [fullscreenMedia, setFullscreenMedia] = useState<{
    src: string;
    title: string;
  } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filterOptions = [
    { key: 'All', label: 'All Categories' },
    ...Object.values(RoomCategory).map((cat) => ({ key: cat as string, label: cat as string })),
  ];

  const isDragDisabled = filterType !== 'All' || searchTerm.trim().length > 0;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      toast.success('Room inventory display order updated');
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedRoom(null);
    setModalMode('create');
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (room: RoomItem) => {
    setSelectedRoom(room);
    setModalMode('edit');
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (data: CreateRoomInput) => {
    if (modalMode === 'create') {
      const res = await createRoom(data);
      if (res.success) {
        toast.success(res.message || `Room "${data.name}" created successfully`);
        setIsFormModalOpen(false);
      } else {
        toast.error(res.message || 'Failed to create room');
      }
    } else if (selectedRoom) {
      const res = await updateRoom(selectedRoom.id, data);
      if (res.success) {
        toast.success(res.message || `Room "${data.name}" updated successfully`);
        setIsFormModalOpen(false);
      } else {
        toast.error(res.message || 'Failed to update room');
      }
    }
  };

  const handleToggleStatus = async (room: RoomItem) => {
    const nextStatus: RoomStatus =
      room.status === RoomStatus.AVAILABLE
        ? RoomStatus.OCCUPIED
        : room.status === RoomStatus.OCCUPIED
        ? RoomStatus.MAINTENANCE
        : RoomStatus.AVAILABLE;

    const res = await updateRoomStatus(room.id, nextStatus);
    if (res.success) {
      toast.success(res.message || `Status for "${room.name}" changed to ${nextStatus}`);
    } else {
      toast.error(res.message || 'Failed to update room status');
    }
  };

  const handleConfirmDeleteRoom = async () => {
    if (!deleteTargetRoom) return;
    const res = await deleteRoom(deleteTargetRoom.id);
    if (res.success) {
      toast.success(res.message || `Room "${deleteTargetRoom.name}" deleted`);
      setDeleteTargetRoom(null);
    } else {
      toast.error(res.message || 'Failed to delete room');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <AdminPageHeader
        title="Rooms & Accommodations"
        description="Manage room inventories, pricing tiers, amenities, and drag & drop display order."
        action={
          <div className="flex items-center gap-2">
            <Link href="/admin/rooms/inquiries">
              <Button size="sm" variant="outline">
                <CalendarCheck className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                Room Inquiries
              </Button>
            </Link>
            <Button size="sm" onClick={handleOpenCreateModal}>
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Create Room
            </Button>
          </div>
        }
      />

      {/* Filter Bar */}
      <AdminFilterBar
        filterOptions={filterOptions}
        activeFilter={filterType}
        onFilterChange={setFilterType}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search room title or ID..."
      />

      {/* Main Table with @dnd-kit */}
      <div className="w-full border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 overflow-hidden shadow-xs font-sans">
        <div className="w-full overflow-x-auto">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <Table className="w-full text-left border-collapse text-sm">
              <TableHeader className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-28">
                    Order
                  </TableHead>
                  <TableHead>
                    Room specifications & title
                  </TableHead>
                  <TableHead className="w-32">
                    Category
                  </TableHead>
                  <TableHead className="w-36">
                    Nightly rate
                  </TableHead>
                  <TableHead className="w-40">
                    Capacity & units
                  </TableHead>
                  <TableHead className="w-32">
                    Availability
                  </TableHead>
                  <TableHead className="w-48 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-40 text-center text-slate-500 text-sm">
                      <div className="flex flex-col items-center justify-center gap-2 py-4">
                        <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                        <span className="text-xs font-medium">Loading rooms inventory...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : rooms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-40 text-center text-slate-500 text-sm">
                      <div className="py-6 text-xs text-slate-500 font-medium">
                        No rooms found matching filter criteria.
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <SortableContext items={rooms.map((r) => r.id)} strategy={verticalListSortingStrategy}>
                    {rooms.map((room, index) => (
                      <SortableRoomRow
                        key={room.id}
                        room={room}
                        index={index}
                        onFullscreenMediaRequested={setFullscreenMedia}
                        onPreviewRequested={setPreviewRoom}
                        onEditRequested={handleOpenEditModal}
                        onDeleteRequested={setDeleteTargetRoom}
                        isDragDisabled={isDragDisabled}
                      />
                    ))}
                  </SortableContext>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>

        <div className="px-4 py-2.5 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between">
          <span>
            Showing {rooms.length} room entries {!isDragDisabled && '(Drag grip handle to reorder)'}
          </span>
        </div>
      </div>

      {/* Room Form Modal */}
      <RoomFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedRoom}
        mode={modalMode}
      />

      {/* Room Details Preview Dialog */}
      <Dialog open={!!previewRoom} onOpenChange={(open) => !open && setPreviewRoom(null)} size="3xl">
        {previewRoom && (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>{previewRoom.name}</DialogTitle>
                <Badge variant="outline">{previewRoom.type}</Badge>
              </div>
              <DialogDescription>
                ID: {previewRoom.id} • Rate: NPR {previewRoom.pricePerNight.toLocaleString()} / night • Capacity: {previewRoom.capacity} Guests
              </DialogDescription>
            </DialogHeader>

            <DialogBody className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 space-y-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFullscreenMedia({
                        src: previewRoom.image?.url || '',
                        title: previewRoom.name,
                      })
                    }
                    className="relative group w-full rounded overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 cursor-pointer focus:outline-none"
                    title="Click to view full media"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewRoom.image?.url}
                      alt={previewRoom.name}
                      className="w-full h-36 object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-white text-xs font-medium">
                      <ZoomIn className="w-4 h-4" />
                      <span>View Full Image</span>
                    </div>
                  </button>

                  {previewRoom.galleryImages && previewRoom.galleryImages.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[11px] font-semibold text-slate-500 block">Gallery Photos</span>
                      <div className="grid grid-cols-4 gap-1.5">
                        {previewRoom.galleryImages.map((gMedia, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() =>
                              setFullscreenMedia({
                                src: gMedia.url,
                                title: `${previewRoom.name} - Gallery Photo ${idx + 1}`,
                              })
                            }
                            className="relative group aspect-square rounded overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 cursor-pointer"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={gMedia.url}
                              alt=""
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            />
                            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <ZoomIn className="w-3 h-3 text-white" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 space-y-3">
                  {previewRoom.shortDescription && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">
                      "{previewRoom.shortDescription}"
                    </p>
                  )}

                  <div>
                    <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Amenities</h4>
                    <div className="flex flex-wrap gap-1">
                      {previewRoom.amenities.map((a) => (
                        <Badge key={a} variant="secondary" className="text-xs">
                          {a}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Full Description</h4>
                    <div
                      className="prose dark:prose-invert prose-xs max-w-none bg-slate-50 dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 overflow-y-auto max-h-48"
                      dangerouslySetInnerHTML={{ __html: previewRoom.description }}
                    />
                  </div>
                </div>
              </div>
            </DialogBody>

            <DialogFooter>
              <Button size="sm" variant="outline" onClick={() => setPreviewRoom(null)}>
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  const target = previewRoom;
                  setPreviewRoom(null);
                  handleOpenEditModal(target);
                }}
              >
                <Pencil className="w-3.5 h-3.5 mr-1.5" />
                Edit Room
              </Button>
            </DialogFooter>
          </>
        )}
      </Dialog>

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteDialog
        isOpen={!!deleteTargetRoom}
        onClose={() => setDeleteTargetRoom(null)}
        onConfirm={handleConfirmDeleteRoom}
        title="Delete Room Entry"
        itemName={deleteTargetRoom?.name}
        description="Are you sure you want to remove this room category entry from your lodge inventory?"
      />

      {/* Full Media Lightbox Modal */}
      <FullMediaPreviewModal
        isOpen={!!fullscreenMedia}
        onClose={() => setFullscreenMedia(null)}
        src={fullscreenMedia?.src}
        title={fullscreenMedia?.title}
      />
    </div>
  );
}
