'use client';

import React from 'react';
import { ExternalLink, Play, Tag, Globe, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VideoItem, VideoPlatform, VideoStatus } from '@/lib/types/video';

export function getPlatformBadge(platform: VideoPlatform) {
  switch (platform) {
    case VideoPlatform.YOUTUBE:
      return <Badge variant="destructive" className="bg-red-600 hover:bg-red-700">{platform}</Badge>;
    case VideoPlatform.INSTAGRAM:
      return <Badge variant="outline" className="border-pink-500 text-pink-600 dark:text-pink-400">{platform}</Badge>;
    case VideoPlatform.FACEBOOK:
      return <Badge variant="secondary" className="bg-blue-600 text-white hover:bg-blue-700">{platform}</Badge>;
    case VideoPlatform.TIKTOK:
      return <Badge variant="outline" className="border-slate-700 dark:border-slate-300">{platform}</Badge>;
    case VideoPlatform.VIMEO:
      return <Badge variant="outline" className="border-cyan-500 text-cyan-600 dark:text-cyan-400">{platform}</Badge>;
    default:
      return <Badge variant="outline">{platform}</Badge>;
  }
}

export function getEmbedUrl(url: string, platform: VideoPlatform): string | null {
  if (!url) return null;
  try {
    if (platform === VideoPlatform.YOUTUBE) {
      if (url.includes('v=')) {
        const videoId = url.split('v=')[1]?.split('&')[0];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0];
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    if (platform === VideoPlatform.VIMEO) {
      const match = url.match(/vimeo\.com\/(\d+)/);
      if (match && match[1]) {
        return `https://player.vimeo.com/video/${match[1]}`;
      }
    }
  } catch {
    return null;
  }
  return null;
}

interface VideoPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: VideoItem | null;
}

export default function VideoPreviewModal({ isOpen, onClose, video }: VideoPreviewModalProps) {
  const [copied, setCopied] = React.useState(false);

  if (!video) return null;

  const embedUrl = getEmbedUrl(video.videoUrl, video.platform);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(video.videoUrl);
    setCopied(true);
    toast.success('Video link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()} size="2xl">
      <DialogHeader>
        <div className="flex items-center justify-between gap-2 pr-4">
          <div className="flex items-center gap-2">
            {getPlatformBadge(video.platform)}
            <Badge variant="outline" className="text-xs font-mono">
              {video.category}
            </Badge>
          </div>
          {video.status === VideoStatus.PUBLISHED ? (
            <Badge variant="success">Published</Badge>
          ) : (
            <Badge variant="secondary">Draft</Badge>
          )}
        </div>
        <DialogTitle className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 mt-2">
          {video.title}
        </DialogTitle>
      </DialogHeader>

      <DialogBody className="space-y-4">
        {/* Video Player / Embedded Container or Thumbnail Showcase */}
        <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex items-center justify-center">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : video.thumbnail?.url ? (
            <div className="relative w-full h-full group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={video.thumbnail.url}
                alt={video.title}
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-slate-950/40 flex flex-col items-center justify-center gap-2 text-white">
                <a
                  href={video.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                >
                  <Play className="w-6 h-6 ml-0.5 text-slate-900 fill-slate-900" />
                </a>
                <span className="text-xs font-medium text-white/90 drop-shadow-md">
                  Watch on {video.platform}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-slate-400 p-6 text-center">
              <Globe className="w-10 h-10 stroke-1 text-slate-500" />
              <p className="text-xs font-medium text-slate-300">External Platform Video</p>
              <a
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-brand-green hover:underline mt-1"
              >
                <span>Open video link on {video.platform}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Video Description */}
        {video.description && (
          <div className="p-3 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide block">
              Description
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {video.description}
            </p>
          </div>
        )}

        {/* Video Metadata Footer / Link Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 border border-slate-200 dark:border-slate-800 rounded-md bg-white dark:bg-slate-950">
          <div className="flex items-center gap-2 min-w-0">
            <Globe className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs font-mono text-slate-600 dark:text-slate-400 truncate max-w-sm">
              {video.videoUrl}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button type="button" variant="outline" size="sm" onClick={handleCopyLink} className="text-xs h-8">
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  Copy Link
                </>
              )}
            </Button>
            <a href={video.videoUrl} target="_blank" rel="noopener noreferrer">
              <Button type="button" size="sm" className="text-xs h-8 bg-brand-green hover:bg-brand-green-dark text-white">
                <ExternalLink className="w-3.5 h-3.5 mr-1" />
                Open Link
              </Button>
            </a>
          </div>
        </div>
      </DialogBody>

      <DialogFooter>
        <Button type="button" variant="outline" size="sm" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
