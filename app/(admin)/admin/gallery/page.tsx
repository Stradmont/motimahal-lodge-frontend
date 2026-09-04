'use client';

import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import AdminPageHeader from '@/components/admin/layout/AdminPageHeader';
import AdminFilterBar from '@/components/admin/layout/AdminFilterBar';

interface GalleryItem {
  id: string;
  title: string;
  category: 'Rooms' | 'Restaurant' | 'Riverfront' | 'Amenities' | 'Events';
  imageUrl: string;
  uploadedDate: string;
  featured?: boolean;
}

const mockGallery: GalleryItem[] = [
  {
    id: 'GAL-01',
    title: 'Riverfront Sunset View from Lodge Terrace',
    category: 'Riverfront',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    uploadedDate: '2026-09-01',
    featured: true,
  },
  {
    id: 'GAL-02',
    title: 'Deluxe Suite King Bed & Traditional Decor',
    category: 'Rooms',
    imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    uploadedDate: '2026-08-28',
    featured: true,
  },
  {
    id: 'GAL-03',
    title: 'Signature Clay Oven Tandoori Platter',
    category: 'Restaurant',
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    uploadedDate: '2026-08-25',
    featured: true,
  },
  {
    id: 'GAL-04',
    title: 'Lush Garden Lounge & Outdoor Seating',
    category: 'Amenities',
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    uploadedDate: '2026-08-20',
  },
  {
    id: 'GAL-05',
    title: 'Chitwan Jungle Safari Excursion Group',
    category: 'Events',
    imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
    uploadedDate: '2026-08-15',
  },
  {
    id: 'GAL-06',
    title: 'Evening Riverside Dining Setup',
    category: 'Restaurant',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    uploadedDate: '2026-08-10',
  },
];

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>(mockGallery);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toast, setToast] = useState('');

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<GalleryItem['category']>('Rooms');
  const [newUrl, setNewUrl] = useState('');

  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filterOptions = [
    { key: 'All', label: 'All' },
    { key: 'Rooms', label: 'Rooms' },
    { key: 'Restaurant', label: 'Restaurant' },
    { key: 'Riverfront', label: 'Riverfront' },
    { key: 'Amenities', label: 'Amenities' },
    { key: 'Events', label: 'Events' },
  ];

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;

    const newItem: GalleryItem = {
      id: `GAL-0${items.length + 1}`,
      title: newTitle,
      category: newCategory,
      imageUrl: newUrl,
      uploadedDate: new Date().toISOString().split('T')[0],
      featured: false,
    };

    setItems([newItem, ...items]);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewUrl('');
    showToast('Photo entry created');
  };

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
    showToast('Photo deleted');
  };

  const toggleFeatured = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, featured: !item.featured } : item
      )
    );
    showToast('Featured status updated');
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-zinc-900 text-zinc-50 border border-zinc-700 px-4 py-2 rounded-sm text-sm font-medium shadow-md">
          {toast}
        </div>
      )}

      {/* Reusable Page Header */}
      <AdminPageHeader
        title="Gallery Media Manager"
        description="Curate high-resolution lodge photography, category tags, and featured images."
        action={
          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="text-sm h-9"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Photo
          </Button>
        }
      />

      {/* Reusable Control & Search Bar */}
      <AdminFilterBar
        filterOptions={filterOptions}
        activeFilter={activeCategory}
        onFilterChange={setActiveCategory}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search photo titles..."
      />

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="border border-zinc-200 dark:border-zinc-800 rounded-sm bg-white dark:bg-zinc-950 overflow-hidden flex flex-col justify-between"
          >
            <div className="relative h-44 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2">
                <Badge variant="default">{item.category}</Badge>
              </div>
              {item.featured && (
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary">Featured</Badge>
                </div>
              )}
            </div>

            <div className="p-3.5 space-y-3">
              <div>
                <h4 className="font-medium text-zinc-900 dark:text-zinc-100 text-sm line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Uploaded {item.uploadedDate}
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFeatured(item.id)}
                  className="h-8 text-xs px-2"
                >
                  {item.featured ? 'Featured' : 'Make Featured'}
                </Button>

                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(item.id)}
                  className="h-8 w-8"
                  title="Delete image"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Photo Modal Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <form onSubmit={handleAddPhoto} className="space-y-4 font-sans">
          <DialogHeader>
            <DialogTitle>Add Photo to Gallery</DialogTitle>
            <DialogDescription>
              Enter image title, URL, and category tag.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Photo Title
              </label>
              <Input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Garden Lounge Seating"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) =>
                  setNewCategory(e.target.value as GalleryItem['category'])
                }
                className="w-full h-9 rounded-sm border border-zinc-300 bg-white px-3 py-1 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 focus:outline-none font-sans"
              >
                <option value="Rooms">Rooms</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Riverfront">Riverfront</option>
                <option value="Amenities">Amenities</option>
                <option value="Events">Events</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Image URL
              </label>
              <Input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Photo
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
