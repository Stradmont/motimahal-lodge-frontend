'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Pencil, ExternalLink, GripVertical, Play, Eye, Video } from 'lucide-react';
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
import AdminPageHeader from '@/components/admin/layout/AdminPageHeader';
import AdminFilterBar from '@/components/admin/layout/AdminFilterBar';
import ConfirmDeleteDialog from '@/components/admin/common/ConfirmDeleteDialog';

import { VideoItem, VideoPlatform, VideoStatus } from '@/lib/types/video';
import VideoFormModal, { VideoFormData } from '@/components/admin/videos/VideoFormModal';
import VideoPreviewModal, { getPlatformBadge } from '@/components/admin/videos/VideoPreviewModal';
import { useVideo } from '@/hooks/useVideo';

interface SortableVideoRowProps {
  vid: VideoItem;
  index: number;
  onPreviewRequested: (vid: VideoItem) => void;
  onEditRequested: (vid: VideoItem) => void;
  onDeleteRequested: (vid: VideoItem) => void;
  isDragDisabled: boolean;
}

function SortableVideoRow({
  vid,
  index,
  onPreviewRequested,
  onEditRequested,
  onDeleteRequested,
  isDragDisabled,
}: SortableVideoRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: vid.id, disabled: isDragDisabled });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    position: 'relative',
    zIndex: isDragging ? 40 : 1,
  };

  const defaultThumbnail =
    vid.thumbnail?.url ||
    '/gallery/reel-dcy.jpg';

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
      {/* 1. Order Column */}
      <TableCell className="py-3.5 px-4 text-sm align-middle w-24">
        <div className="flex items-center gap-2">
          <button
            type="button"
            {...attributes}
            {...listeners}
            disabled={isDragDisabled}
            className={`p-1.5 rounded transition-colors ${
              isDragDisabled
                ? 'cursor-not-allowed text-slate-300 dark:text-slate-700'
                : 'cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isDragDisabled ? 'Filter active (reordering disabled)' : 'Drag to reorder'}
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <span className="font-mono text-xs font-semibold text-slate-500 w-5 text-center">
            {index + 1}
          </span>
        </div>
      </TableCell>

      {/* 2. Video Title, Category & Thumbnail */}
      <TableCell className="py-3.5 px-4 text-sm align-middle">
        <div className="flex items-center gap-3">
          <div
            onClick={() => onPreviewRequested(vid)}
            className="group relative w-20 h-14 rounded-md overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shrink-0 cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={defaultThumbnail}
              alt={vid.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/60 flex items-center justify-center transition-colors">
              <div className="w-6 h-6 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-xs">
                <Play className="w-3 h-3 ml-0.5 fill-slate-900" />
              </div>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-900 dark:text-slate-100 text-sm hover:text-brand-green cursor-pointer truncate" onClick={() => onPreviewRequested(vid)}>
                {vid.title}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-normal">
                {vid.category}
              </Badge>
              {vid.thumbnailMediaId && (
                <span className="text-[10px] font-mono text-slate-400">
                  Media ID: {vid.thumbnailMediaId}
                </span>
              )}
            </div>
          </div>
        </div>
      </TableCell>

      {/* 3. Platform & Link Column */}
      <TableCell className="py-3.5 px-4 text-sm align-middle w-48">
        <div className="space-y-1">
          {getPlatformBadge(vid.platform)}
          <a
            href={vid.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-brand-green hover:underline truncate max-w-[180px]"
            title={vid.videoUrl}
          >
            <span className="truncate">{vid.videoUrl.replace(/^https?:\/\/(www\.)?/, '')}</span>
            <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
        </div>
      </TableCell>

      {/* 4. Status Column */}
      <TableCell className="py-3.5 px-4 text-sm align-middle w-32">
        {vid.status === VideoStatus.PUBLISHED ? (
          <Badge variant="success">Published</Badge>
        ) : (
          <Badge variant="secondary">Draft</Badge>
        )}
      </TableCell>

      {/* 5. Actions Column */}
      <TableCell className="py-3.5 px-4 text-sm align-middle w-36 text-right">
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPreviewRequested(vid)}
            title="Preview Video"
            className="h-8 w-8 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEditRequested(vid)}
            title="Edit Video"
            className="h-8 w-8 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDeleteRequested(vid)}
            title="Delete Video"
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function AdminVideosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const { videos, isLoading, createVideo, updateVideo, reorderVideos, deleteVideo } = useVideo();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);

  const [previewVideo, setPreviewVideo] = useState<VideoItem | null>(null);
  const [deleteTargetVideo, setDeleteTargetVideo] = useState<VideoItem | null>(null);

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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = videos.findIndex((item) => item.id === active.id);
    const newIndex = videos.findIndex((item) => item.id === over.id);
    const reordered = arrayMove(videos, oldIndex, newIndex).map((item, idx) => ({
      ...item,
      orderIndex: idx + 1,
    }));

    const res = await reorderVideos(reordered);
    if (res.success) {
      toast.success(res.message || 'Video order updated');
    } else {
      toast.error(res.message || 'Failed to update order');
    }
  };

  const isFiltered = activeFilter !== 'All' || searchTerm.trim() !== '';

  const filteredVideos = videos.filter((vid) => {
    const matchesFilter =
      activeFilter === 'All'
        ? true
        : activeFilter === VideoStatus.PUBLISHED
        ? vid.status === VideoStatus.PUBLISHED
        : activeFilter === VideoStatus.DRAFT
        ? vid.status === VideoStatus.DRAFT
        : vid.platform === activeFilter;

    const matchesSearch =
      vid.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vid.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vid.platform.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const filterOptions = [
    { key: 'All', label: 'All Videos' },
    { key: VideoStatus.PUBLISHED, label: 'Published' },
    { key: VideoStatus.DRAFT, label: 'Drafts' },
    { key: VideoPlatform.YOUTUBE, label: 'YouTube' },
    { key: VideoPlatform.INSTAGRAM, label: 'Instagram' },
    { key: VideoPlatform.FACEBOOK, label: 'Facebook' },
  ];

  const handleOpenCreateModal = () => {
    setEditingVideo(null);
    setFormMode('create');
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (vid: VideoItem) => {
    setEditingVideo(vid);
    setFormMode('edit');
    setIsFormModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetVideo) return;
    const res = await deleteVideo(deleteTargetVideo.id);
    if (res.success) {
      toast.success(res.message || `Deleted video showcase "${deleteTargetVideo.title}"`);
      setDeleteTargetVideo(null);
    } else {
      toast.error(res.message || 'Failed to delete video showcase');
    }
  };

  const handleFormSubmit = async (data: VideoFormData) => {
    if (formMode === 'create') {
      const res = await createVideo(data);
      if (res.success) {
        toast.success(res.message || 'Created new video showcase');
        setIsFormModalOpen(false);
        return true;
      } else {
        toast.error(res.message || 'Failed to create video showcase');
        return false;
      }
    } else if (editingVideo) {
      const res = await updateVideo(editingVideo.id, data);
      if (res.success) {
        toast.success(res.message || 'Updated video showcase details');
        setIsFormModalOpen(false);
        return true;
      } else {
        toast.error(res.message || 'Failed to update video showcase');
        return false;
      }
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <AdminPageHeader
        title="Videos & Virtual Tours"
        description="Manage hotel tour videos, jungle safari reels, dining clips, and cover thumbnails."
        action={
          <Button onClick={handleOpenCreateModal} size="sm" className="bg-brand-green hover:bg-brand-green-dark text-white">
            <Plus className="w-4 h-4 mr-1.5" />
            Add Video
          </Button>
        }
      />

      {/* Filter Bar */}
      <AdminFilterBar
        filterOptions={filterOptions}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Filter video title, category..."
      />

      {/* Main Table with @dnd-kit Drag and Drop */}
      <div className="w-full border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 overflow-hidden shadow-xs font-sans">
        <div className="w-full overflow-x-auto">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <Table className="w-full text-left border-collapse text-sm">
              <TableHeader className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-24">
                    Order
                  </TableHead>
                  <TableHead>
                    Video showcase details & cover
                  </TableHead>
                  <TableHead className="w-48">
                    Platform & link
                  </TableHead>
                  <TableHead className="w-32">
                    Status
                  </TableHead>
                  <TableHead className="w-36 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-40 text-center text-slate-500 text-sm">
                      Loading video showcases...
                    </TableCell>
                  </TableRow>
                ) : filteredVideos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-40 text-center text-slate-500 text-sm">
                      <div className="flex flex-col items-center justify-center gap-1.5 py-4">
                        <Video className="w-8 h-8 text-slate-400 stroke-1" />
                        <span className="font-medium text-slate-700 dark:text-slate-300">No video showcases found</span>
                        <span className="text-xs text-slate-500">
                          {isFiltered ? 'Try clearing filter or search criteria.' : 'Click "Add Video" to configure your first video.'}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <SortableContext items={filteredVideos.map((v) => v.id)} strategy={verticalListSortingStrategy}>
                    {filteredVideos.map((vid, index) => (
                      <SortableVideoRow
                        key={vid.id}
                        vid={vid}
                        index={index}
                        onPreviewRequested={setPreviewVideo}
                        onEditRequested={handleOpenEditModal}
                        onDeleteRequested={setDeleteTargetVideo}
                        isDragDisabled={isFiltered}
                      />
                    ))}
                  </SortableContext>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>

        {/* Footer Summary */}
        <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {filteredVideos.length} of {videos.length} video showcase entries
          </span>
          {isFiltered && (
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
              * Drag-and-drop reordering is disabled while search/filter is active
            </span>
          )}
        </div>
      </div>

      {/* Video Form Modal (Create / Edit with Centralized Media Selector for Thumbnail) */}
      <VideoFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingVideo}
        mode={formMode}
      />

      {/* Video Preview Modal */}
      <VideoPreviewModal
        isOpen={!!previewVideo}
        onClose={() => setPreviewVideo(null)}
        video={previewVideo}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteDialog
        isOpen={!!deleteTargetVideo}
        onClose={() => setDeleteTargetVideo(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Video Showcase"
        description={`Are you sure you want to remove "${deleteTargetVideo?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}
