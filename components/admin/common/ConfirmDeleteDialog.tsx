'use client';

import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter } from '@/components/ui/dialog';

interface ConfirmDeleteDialogProps {
  open?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  title?: string;
  description?: string;
  itemName?: string;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export default function ConfirmDeleteDialog({
  open,
  isOpen,
  onOpenChange,
  onClose,
  title = 'Confirm Deletion',
  description,
  itemName,
  onConfirm,
  isDeleting = false,
}: ConfirmDeleteDialogProps) {
  const isDialogOpen = isOpen ?? open ?? false;

  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
    if (!newOpen && onClose) {
      onClose();
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange} size="md">
      <DialogHeader>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4.5 h-4.5" />
          </div>
          <div>
            <DialogTitle className="text-base font-semibold text-slate-900 dark:text-slate-50">
              {title}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 mt-0.5">
              This action is permanent and cannot be undone.
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <DialogBody>
        {description ? (
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {description}
          </p>
        ) : itemName ? (
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Are you sure you want to delete <span className="font-semibold text-slate-900 dark:text-slate-100">&quot;{itemName}&quot;</span>? This will permanently remove the item from your records.
          </p>
        ) : (
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Are you sure you want to delete this item? This will permanently remove the item from your records.
          </p>
        )}
      </DialogBody>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleOpenChange(false)}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={async () => {
            await onConfirm();
          }}
          disabled={isDeleting}
          className="bg-rose-600 hover:bg-rose-700 text-white font-medium cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5 mr-1.5" />
          {isDeleting ? 'Deleting...' : 'Delete Item'}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
