'use client';

import React from 'react';
import { Modal } from 'antd';
import { LogOut } from 'lucide-react';

interface LogoutConfirmationModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  /** Optional: name of the signed-in user to personalise the message */
  userName?: string;
}

export default function LogoutConfirmationModal({
  open,
  onConfirm,
  onCancel,
  userName,
}: LogoutConfirmationModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      width={400}
      closable
      maskClosable
      style={{
        borderRadius: '1rem',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        background: 'var(--card)',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
      }}
      styles={{
        mask: { backdropFilter: 'blur(4px)' },
        body: { padding: 0 },
      }}
    >

      <div className="px-7 py-7">
        {/* Icon */}
        <div className="flex items-center justify-center mb-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-accent/10 border border-primary-accent/20">
            <LogOut className="h-7 w-7 text-primary-accent" />
          </div>
        </div>

        {/* Text */}
        <div className="text-center mb-7">
          <h2 className="text-base font-bold text-foreground mb-2">
            Sign out of Motimahal?
          </h2>
          <p className="text-xs text-muted leading-relaxed">
            {userName
              ? `${userName}, you'll be signed out of your current session.`
              : "You'll be signed out of your current session."}
            {' '}You can sign back in at any time.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            id="logout-modal-cancel"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold text-foreground border border-border bg-muted-light hover:bg-muted-light/80 transition-colors cursor-pointer"
          >
            Stay signed in
          </button>
          <button
            id="logout-modal-confirm"
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-primary-accent hover:bg-primary-accent/90 transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </div>
    </Modal>
  );
}
