'use client';

import React from 'react';
import { X, ExternalLink, Copy, Check } from 'lucide-react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FullMediaPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  src?: string | null;
  title?: string;
}

export default function FullMediaPreviewModal({
  isOpen,
  onClose,
  src,
  title,
}: FullMediaPreviewModalProps) {
  const [copied, setCopied] = React.useState(false);

  if (!src) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(src);
    setCopied(true);
    toast.success('URL copied');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()} size="4xl">
      <div className="font-sans space-y-3">
        {/* Minimal Header Bar */}
        <div className="flex items-center justify-between px-1 pt-1 pb-1">
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-sm sm:max-w-md">
            {title || 'Media Asset Preview'}
          </span>

          <div className="flex items-center gap-1.5 pr-6">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleCopyUrl}
              title="Copy image URL"
              className="h-8 w-8 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </Button>
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              title="Open full size in new tab"
              className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Pure Image Viewing Stage */}
        <div className="relative rounded-lg overflow-hidden bg-slate-950 flex items-center justify-center p-3 min-h-[300px] max-h-[80vh] border border-slate-800/80 shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={title || 'Media preview'}
            className="max-h-[75vh] max-w-full object-contain rounded-sm"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';
            }}
          />
        </div>
      </div>
    </Dialog>
  );
}
