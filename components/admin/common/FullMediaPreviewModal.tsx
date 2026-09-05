'use client';

import React from 'react';
import { ExternalLink, Copy, Check } from 'lucide-react';
import { Dialog, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/dialog';
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
      <DialogHeader>
        <div className="flex items-center justify-between pr-4">
          <DialogTitle className="text-sm font-semibold truncate max-w-sm sm:max-w-md">
            {title || 'Media Asset Preview'}
          </DialogTitle>
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyUrl}
              title="Copy image URL"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  Copy URL
                </>
              )}
            </Button>
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-8 px-2.5 rounded-md border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1" />
              Open Original
            </a>
          </div>
        </div>
      </DialogHeader>

      <DialogBody className="p-4 flex items-center justify-center bg-slate-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={title || 'Media preview'}
          className="max-h-[65vh] max-w-full object-contain rounded-sm"
        />
      </DialogBody>

      <DialogFooter>
        <Button type="button" variant="outline" size="sm" onClick={onClose}>
          Close Preview
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
