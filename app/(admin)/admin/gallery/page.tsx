'use client';

import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Eye, Layers } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter } from '@/components/ui/dialog';
import AdminPageHeader from '@/components/admin/layout/AdminPageHeader';
import AdminFilterBar from '@/components/admin/layout/AdminFilterBar';
import ConfirmDeleteDialog from '@/components/admin/common/ConfirmDeleteDialog';
import FullMediaPreviewModal from '@/components/admin/common/FullMediaPreviewModal';
import GallerySectionModal from '@/components/admin/gallery/GallerySectionModal';
import { AdminDataTable, AdminColumn } from '@/components/admin/common/AdminDataTable';
import {
  GallerySectionItem,
  CreateGallerySectionInput,
  GallerySectionStatus,
} from '@/lib/types/gallery';
import { useGallery } from '@/hooks/useGallery';

export default function AdminGalleryPage() {
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const { sections, isLoading, createSection, updateSection, deleteSection } = useGallery({
    status: activeFilter,
    search: searchTerm,
  });

  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedSection, setSelectedSection] = useState<GallerySectionItem | null>(null);

  const [previewSection, setPreviewSection] = useState<GallerySectionItem | null>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [deleteTargetSection, setDeleteTargetSection] = useState<GallerySectionItem | null>(null);

  const filterOptions = [
    { key: 'ALL', label: 'All Sections' },
    ...Object.values(GallerySectionStatus).map((st) => ({
      key: st,
      label: `${st.charAt(0)}${st.slice(1).toLowerCase()}`,
    })),
  ];

  const handleOpenCreateModal = () => {
    setSelectedSection(null);
    setModalMode('create');
    setIsSectionModalOpen(true);
  };

  const handleOpenEditModal = (sec: GallerySectionItem) => {
    setSelectedSection(sec);
    setModalMode('edit');
    setIsSectionModalOpen(true);
  };

  const handleFormSubmit = async (data: CreateGallerySectionInput) => {
    if (!selectedSection) {
      const res = await createSection(data);
      if (res.success) {
        toast.success(res.message || `Gallery section "${data.title}" created`);
        setIsSectionModalOpen(false);
      } else {
        toast.error(res.message || 'Failed to create gallery section');
      }
    } else {
      const res = await updateSection(selectedSection.id, data);
      if (res.success) {
        toast.success(res.message || `Gallery section "${data.title}" updated`);
        setIsSectionModalOpen(false);
      } else {
        toast.error(res.message || 'Failed to update gallery section');
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetSection) return;
    const res = await deleteSection(deleteTargetSection.id);
    if (res.success) {
      toast.success(res.message || `Gallery section "${deleteTargetSection.title}" deleted`);
      setDeleteTargetSection(null);
    } else {
      toast.error(res.message || 'Failed to delete gallery section');
    }
  };

  const columns: AdminColumn<GallerySectionItem>[] = [
    {
      key: 'title',
      header: 'Gallery section & website location',
      render: (sec) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5 text-slate-500" />
          </div>
          <div>
            <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
              {sec.title}
            </span>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-0.5">
              <span>{sec.slug}</span>
              {sec.description && <span className="truncate max-w-md">• {sec.description}</span>}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      width: '140px',
      render: (sec) => (
        <Badge variant="secondary" className="capitalize text-xs font-mono">
          {sec.category || 'general'}
        </Badge>
      ),
    },
    {
      key: 'mediaIds',
      header: 'Collection media',
      width: '180px',
      render: (sec) => (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono">
            {sec.mediaIds.length} {sec.mediaIds.length === 1 ? 'image' : 'images'}
          </Badge>
          {sec.mediaItems && sec.mediaItems.length > 0 && (
            <div className="flex -space-x-2 overflow-hidden">
              {sec.mediaItems.slice(0, 3).map((item, idx) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={idx}
                  src={item.url}
                  alt={item.name}
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-950 object-cover"
                />
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '140px',
      render: (sec) => (
        <>
          {sec.status === GallerySectionStatus.ACTIVE && <Badge variant="success">Active</Badge>}
          {sec.status === GallerySectionStatus.DRAFT && <Badge variant="secondary">Draft</Badge>}
          {sec.status === GallerySectionStatus.INACTIVE && <Badge variant="outline">Inactive</Badge>}
        </>
      ),
    },
    {
      key: 'updatedAt',
      header: 'Last updated',
      width: '160px',
      render: (sec) => (
        <span className="text-xs text-slate-500 font-mono">
          {new Date(sec.updatedAt || sec.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      width: '140px',
      render: (sec) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPreviewSection(sec)}
            title="Preview Collection"
            className="h-8 w-8"
          >
            <Eye className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleOpenEditModal(sec)}
            title="Edit Section"
            className="h-8 w-8"
          >
            <Pencil className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteTargetSection(sec)}
            title="Delete Section"
            className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <AdminPageHeader
        title="Gallery Section Management"
        description="Organize website photography into dedicated placement sections and collections."
        action={
          <Button size="sm" onClick={handleOpenCreateModal} className="cursor-pointer">
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Create Gallery Section
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
        searchPlaceholder="Search section title or location slug..."
      />

      {/* Spacious Centralized Table */}
      <AdminDataTable<GallerySectionItem>
        columns={columns}
        data={sections}
        keyExtractor={(sec) => sec.id}
        isLoading={isLoading}
        emptyMessage="No gallery sections found matching criteria."
        onRowClick={handleOpenEditModal}
        footer={<span>Total {sections.length} website gallery sections</span>}
      />

      {/* Create / Edit Section Modal */}
      <GallerySectionModal
        isOpen={isSectionModalOpen}
        onClose={() => setIsSectionModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedSection}
        mode={modalMode}
      />

      {/* Collection Preview Dialog */}
      <Dialog open={!!previewSection} onOpenChange={(open) => !open && setPreviewSection(null)} size="3xl">
        {previewSection && (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>{previewSection.title}</DialogTitle>
                <Badge variant="outline" className="text-xs font-mono">
                  {previewSection.mediaIds.length} assets
                </Badge>
              </div>
              <DialogDescription className="font-mono text-[11px]">
                Location: /{previewSection.slug} • Status: {previewSection.status}
              </DialogDescription>
            </DialogHeader>

            <DialogBody className="space-y-4 select-none">
              <div className="border border-slate-200 dark:border-slate-800 rounded-md bg-slate-950 p-3 min-h-60 max-h-96 overflow-y-auto">
                {previewSection.mediaItems && previewSection.mediaItems.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {previewSection.mediaItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setLightboxSrc(item.url)}
                        className="group relative aspect-square rounded border border-slate-800 overflow-hidden cursor-pointer bg-slate-900"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                        <div className="absolute inset-x-0 bottom-0 bg-slate-950/70 p-1 text-[10px] text-white font-mono truncate">
                          {item.name}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-500 py-12">
                    No images attached to this collection.
                  </div>
                )}
              </div>
            </DialogBody>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setPreviewSection(null)}>
                Close Preview
              </Button>
            </DialogFooter>
          </>
        )}
      </Dialog>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteDialog
        isOpen={!!deleteTargetSection}
        onClose={() => setDeleteTargetSection(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Gallery Section"
        itemName={deleteTargetSection?.title}
        description="Are you sure you want to delete this gallery section? Note: Centralized Media assets will remain intact in the Media Library."
      />

      {/* Full Lightbox */}
      <FullMediaPreviewModal
        isOpen={!!lightboxSrc}
        onClose={() => setLightboxSrc(null)}
        src={lightboxSrc || undefined}
        title="Gallery Asset Inspection"
      />
    </div>
  );
}
