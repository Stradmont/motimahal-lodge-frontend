'use client';

import React, { useState } from 'react';
import { Plus, Search, Play, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface VideoItem {
  id: string;
  title: string;
  category: 'Resort Tour' | 'Culinary' | 'Riverfront' | 'Culture';
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  featured?: boolean;
}

const mockVideos: VideoItem[] = [
  {
    id: 'VID-01',
    title: 'Moti Mahal Lodge Full Cinematic Aerial & Resort Tour',
    category: 'Resort Tour',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    duration: '3:45',
    featured: true,
  },
  {
    id: 'VID-02',
    title: 'Authentic Tandoori Cooking & Clay Oven Secrets',
    category: 'Culinary',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    duration: '2:15',
    featured: true,
  },
  {
    id: 'VID-03',
    title: 'Sunset Views & Narayani River Relaxation',
    category: 'Riverfront',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    duration: '1:50',
  },
  {
    id: 'VID-04',
    title: 'Chitwan Tharu Cultural Dance Evening Performance',
    category: 'Culture',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
    duration: '4:20',
  },
];

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>(mockVideos);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [playingVideo, setPlayingVideo] = useState<VideoItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toast, setToast] = useState('');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<VideoItem['category']>('Resort Tour');
  const [videoUrl, setVideoUrl] = useState('');

  const filteredVideos = videos.filter((v) => {
    const matchesCat = activeCategory === 'All' || v.category === activeCategory;
    const matchesSearch = v.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleDelete = (id: string) => {
    setVideos(videos.filter((v) => v.id !== id));
    showToast('Video deleted');
  };

  const toggleFeatured = (id: string) => {
    setVideos(
      videos.map((v) => (v.id === id ? { ...v, featured: !v.featured } : v))
    );
    showToast('Featured status updated');
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !videoUrl) return;

    const newVideo: VideoItem = {
      id: `VID-0${videos.length + 1}`,
      title,
      category,
      videoUrl,
      thumbnailUrl:
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      duration: '2:30',
      featured: false,
    };

    setVideos([newVideo, ...videos]);
    setIsAddModalOpen(false);
    setTitle('');
    setVideoUrl('');
    showToast('Video entry created');
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-zinc-900 text-zinc-50 border border-zinc-700 px-4 py-2 rounded-sm text-sm font-medium shadow-md">
          {toast}
        </div>
      )}

      {/* 1. Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Videos & Virtual Tours
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Manage resort video links, YouTube embeds, and promotional showcases.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          className="shrink-0"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Video
        </Button>
      </div>

      {/* 2. Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-1">
        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
          {['All', 'Resort Tour', 'Culinary', 'Riverfront', 'Culture'].map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className="text-xs h-8 whitespace-nowrap"
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search video titles..."
            className="pl-8 h-8 text-sm bg-white dark:bg-zinc-950"
          />
        </div>
      </div>

      {/* 3. Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="border border-zinc-200 dark:border-zinc-800 rounded-sm bg-white dark:bg-zinc-950 overflow-hidden flex flex-col justify-between"
          >
            <div className="relative h-44 bg-zinc-900 overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  size="icon"
                  onClick={() => setPlayingVideo(video)}
                  className="w-10 h-10 rounded-full bg-zinc-950/80 text-zinc-100 hover:bg-zinc-950"
                >
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </Button>
              </div>

              <div className="absolute top-2 left-2">
                <Badge variant="default">{video.category}</Badge>
              </div>

              {video.featured && (
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary">Featured</Badge>
                </div>
              )}
            </div>

            <div className="p-3.5 space-y-3">
              <h4 className="font-medium text-zinc-900 dark:text-zinc-100 text-sm line-clamp-2">
                {video.title}
              </h4>

              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFeatured(video.id)}
                  className="h-8 text-xs px-2"
                >
                  {video.featured ? 'Featured' : 'Highlight'}
                </Button>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setPlayingVideo(video)}
                    className="h-8 w-8"
                    title="Preview video"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(video.id)}
                    className="h-8 w-8"
                    title="Delete video"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Video Player Dialog */}
      <Dialog open={!!playingVideo} onOpenChange={(open) => !open && setPlayingVideo(null)}>
        {playingVideo && (
          <div className="space-y-3">
            <DialogHeader>
              <DialogTitle>{playingVideo.title}</DialogTitle>
              <DialogDescription>{playingVideo.category}</DialogDescription>
            </DialogHeader>
            <div className="aspect-video bg-black rounded-sm overflow-hidden">
              <iframe
                src={playingVideo.videoUrl}
                title={playingVideo.title}
                className="w-full h-full border-0"
                allowFullScreen
              />
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setPlayingVideo(null)}>
                Close Preview
              </Button>
            </DialogFooter>
          </div>
        )}
      </Dialog>

      {/* 5. Add Video Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <form onSubmit={handleAddVideo} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Add Video Embed</DialogTitle>
            <DialogDescription>
              Provide video title, category, and YouTube/Vimeo embed URL.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Video Title
              </label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Resort Sunset Aerial View"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as VideoItem['category'])}
                className="w-full h-9 rounded-sm border border-zinc-300 bg-white px-3 py-1 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 focus:outline-none"
              >
                <option value="Resort Tour">Resort Tour</option>
                <option value="Culinary">Culinary</option>
                <option value="Riverfront">Riverfront</option>
                <option value="Culture">Culture</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Embed Video URL
              </label>
              <Input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/embed/..."
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
              Save Video
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
