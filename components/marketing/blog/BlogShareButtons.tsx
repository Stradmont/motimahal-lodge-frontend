'use client';

import React, { useState } from 'react';
import { Share2, Copy, Check, MessageCircle } from 'lucide-react';
import { FacebookIcon, InstagramIcon } from '@/components/SocialIcons';
import { toast } from 'sonner';

function XTwitterIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

interface BlogShareButtonsProps {
  url: string;
  title: string;
  variant?: 'card' | 'top-bar' | 'floating-side' | 'mobile-bottom';
}

export default function BlogShareButtons({
  url,
  title,
  variant = 'card',
}: BlogShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Article link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      '_blank',
      'noopener,noreferrer,width=600,height=500'
    );
  };

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      '_blank',
      'noopener,noreferrer,width=600,height=400'
    );
  };

  const shareWhatsApp = () => {
    window.open(
      `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const shareInstagram = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied! Paste it in your Instagram story, DM, or post bio.');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('Failed to copy link for Instagram');
    }
  };

  // 1. TOP BAR VARIANT (Compact Inline Bar)
  if (variant === 'top-bar') {
    return (
      <div className="flex items-center gap-2 flex-wrap py-2">
        <span className="text-xs font-semibold text-stone-500 mr-1 flex items-center gap-1">
          <Share2 className="w-3.5 h-3.5 text-brand-green" />
          <span>Share:</span>
        </span>

        <button
          type="button"
          onClick={shareFacebook}
          className="p-1.5 rounded-lg bg-[#1877F2] text-white hover:opacity-90 transition-transform hover:scale-105 cursor-pointer"
          title="Share on Facebook"
        >
          <FacebookIcon className="w-3.5 h-3.5 fill-current" />
        </button>

        <button
          type="button"
          onClick={shareInstagram}
          className="p-1.5 rounded-lg bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white hover:opacity-90 transition-transform hover:scale-105 cursor-pointer"
          title="Share link on Instagram"
        >
          <InstagramIcon className="w-3.5 h-3.5 fill-current" />
        </button>

        <button
          type="button"
          onClick={shareWhatsApp}
          className="p-1.5 rounded-lg bg-[#25D366] text-white hover:opacity-90 transition-transform hover:scale-105 cursor-pointer"
          title="Share via WhatsApp"
        >
          <MessageCircle className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={shareTwitter}
          className="p-1.5 rounded-lg bg-stone-900 text-white hover:opacity-90 transition-transform hover:scale-105 cursor-pointer"
          title="Share on X (Twitter)"
        >
          <XTwitterIcon className="w-3.5 h-3.5 fill-current" />
        </button>

        <button
          type="button"
          onClick={handleCopyLink}
          className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700 text-xs font-medium hover:bg-stone-100 transition-all flex items-center gap-1 cursor-pointer"
          title="Copy link to clipboard"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-stone-500" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
    );
  }

  // 2. FLOATING SIDEBAR VARIANT (Sticky Desktop Dock - Right Mid Section)
  if (variant === 'floating-side') {
    return (
      <div className="hidden xl:flex flex-col gap-2.5 fixed right-4 2xl:right-12 top-1/2 -translate-y-1/2 z-30 bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-stone-200 shadow-xl text-stone-800 font-sans">
        <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest text-center py-1 font-heading">
          Share
        </div>

        <button
          type="button"
          onClick={shareFacebook}
          className="w-9 h-9 rounded-xl bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xs cursor-pointer"
          title="Share on Facebook"
        >
          <FacebookIcon className="w-4 h-4 fill-current" />
        </button>

        <button
          type="button"
          onClick={shareInstagram}
          className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xs cursor-pointer"
          title="Share link for Instagram"
        >
          <InstagramIcon className="w-4 h-4 fill-current" />
        </button>

        <button
          type="button"
          onClick={shareWhatsApp}
          className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xs cursor-pointer"
          title="Share via WhatsApp"
        >
          <MessageCircle className="w-4.5 h-4.5" />
        </button>

        <button
          type="button"
          onClick={shareTwitter}
          className="w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xs cursor-pointer"
          title="Share on X (Twitter)"
        >
          <XTwitterIcon className="w-4 h-4 fill-current" />
        </button>

        <button
          type="button"
          onClick={handleCopyLink}
          className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
          title="Copy link to clipboard"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-stone-600" />}
        </button>
      </div>
    );
  }

  // 3. MOBILE BOTTOM VARIANT (Sticky Floating Pill for Mobile)
  if (variant === 'mobile-bottom') {
    return (
      <div className="xl:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-stone-950/90 backdrop-blur-md border border-stone-800 text-white rounded-full px-4 py-2 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom duration-300">
        <span className="text-xs font-semibold text-stone-300 flex items-center gap-1.5 pl-1">
          <Share2 className="w-3.5 h-3.5 text-brand-gold" />
          <span>Share</span>
        </span>
        <div className="h-4 w-px bg-stone-800" />

        <button
          type="button"
          onClick={shareFacebook}
          className="p-1.5 rounded-full bg-[#1877F2] text-white active:scale-90 cursor-pointer"
          title="Facebook"
        >
          <FacebookIcon className="w-3.5 h-3.5 fill-current" />
        </button>

        <button
          type="button"
          onClick={shareInstagram}
          className="p-1.5 rounded-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white active:scale-90 cursor-pointer"
          title="Instagram"
        >
          <InstagramIcon className="w-3.5 h-3.5 fill-current" />
        </button>

        <button
          type="button"
          onClick={shareWhatsApp}
          className="p-1.5 rounded-full bg-[#25D366] text-white active:scale-90 cursor-pointer"
          title="WhatsApp"
        >
          <MessageCircle className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={shareTwitter}
          className="p-1.5 rounded-full bg-stone-800 text-white active:scale-90 cursor-pointer"
          title="X (Twitter)"
        >
          <XTwitterIcon className="w-3.5 h-3.5 fill-current" />
        </button>

        <button
          type="button"
          onClick={handleCopyLink}
          className="p-1.5 rounded-full bg-stone-800 text-stone-200 active:scale-90 cursor-pointer"
          title="Copy Link"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
    );
  }

  // 4. DEFAULT CARD VARIANT (Rich Summary Card at bottom of content)
  return (
    <div className="p-4 sm:p-6 bg-stone-50 rounded-2xl border border-brand-border space-y-4 my-8 shadow-xs">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-stone-800 font-heading font-bold text-sm sm:text-base">
          <Share2 className="h-4 w-4 text-brand-green" />
          <span>Enjoyed this article? Share with friends!</span>
        </div>
        <span className="text-xs text-stone-500 font-normal">Spread the travel guides & Chitwan safari tips</span>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Facebook */}
        <button
          type="button"
          onClick={shareFacebook}
          className="px-3.5 py-2 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs hover:shadow-md cursor-pointer active:scale-95"
          title="Share on Facebook"
        >
          <FacebookIcon className="w-4 h-4 fill-current" />
          <span>Facebook</span>
        </button>

        {/* Instagram */}
        <button
          type="button"
          onClick={shareInstagram}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs hover:shadow-md cursor-pointer active:scale-95"
          title="Copy link to share on Instagram"
        >
          <InstagramIcon className="w-4 h-4 fill-current" />
          <span>Instagram</span>
        </button>

        {/* WhatsApp */}
        <button
          type="button"
          onClick={shareWhatsApp}
          className="px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs hover:shadow-md cursor-pointer active:scale-95"
          title="Share via WhatsApp"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp</span>
        </button>

        {/* Twitter / X */}
        <button
          type="button"
          onClick={shareTwitter}
          className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs hover:shadow-md cursor-pointer active:scale-95"
          title="Share on X (Twitter)"
        >
          <XTwitterIcon className="w-4 h-4 fill-current" />
          <span>X / Twitter</span>
        </button>

        {/* Copy Link */}
        <button
          type="button"
          onClick={handleCopyLink}
          className="px-3.5 py-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-2 transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-95 ml-auto"
          title="Copy link to clipboard"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-stone-500" />}
          <span>{copied ? 'Copied!' : 'Copy Link'}</span>
        </button>
      </div>
    </div>
  );
}
