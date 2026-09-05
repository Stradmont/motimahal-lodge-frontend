'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button, Dropdown, Input, Tooltip } from 'antd';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Check,
  ChevronDown,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Table as TableIcon,
  Trash2,
  Underline as UnderlineIcon,
} from 'lucide-react';
import ImageResize from 'tiptap-extension-resize-image';
import MediaPickerModal from '@/components/admin/common/MediaPickerModal';
import { MediaItem, MediaSelectorMode } from '@/lib/types/media';

interface MenuBarProps {
  editor: Editor | null;
  showMediaUpload?: boolean;
}

const MenuBar: React.FC<MenuBarProps> = ({ editor, showMediaUpload = true }) => {
  const ec = () => editor!.chain().focus();
  const [isLinkMenuOpen, setIsLinkMenuOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const linkMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (linkMenuRef.current && !linkMenuRef.current.contains(event.target as Node)) {
        setIsLinkMenuOpen(false);
      }
    };
    if (isLinkMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isLinkMenuOpen]);

  if (!editor) return null;

  const handleLinkSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setIsLinkMenuOpen(false);
    }
  };

  const handleRemoveLink = () => {
    editor.chain().focus().unsetLink().run();
    setIsLinkMenuOpen(false);
  };

  // Called when media is selected in reusable MediaPickerModal
  const handleMediaConfirm = (selectedItems: MediaItem[]) => {
    if (selectedItems && selectedItems.length > 0) {
      const mediaUrl = selectedItems[0].url;
      if (mediaUrl && editor) {
        editor.chain().focus().setImage({ src: mediaUrl }).run();
      }
    }
    setIsMediaPickerOpen(false);
  };

  const ToolbarButton = ({
    onClick,
    active = false,
    children,
    title,
    disabled = false,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title?: string;
    disabled?: boolean;
  }) => (
    <Tooltip title={title} placement="bottom" mouseEnterDelay={0.4}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={cn(
          'h-7 w-7 flex items-center justify-center rounded-md transition-all text-xs font-semibold select-none cursor-pointer',
          active
            ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 font-bold shadow-2xs'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100',
          disabled && 'opacity-30 cursor-not-allowed'
        )}
      >
        {children}
      </button>
    </Tooltip>
  );

  return (
    <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 font-sans">
      {/* Headings */}
      <div className="flex items-center gap-0.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md p-0.5 shadow-2xs">
        <ToolbarButton
          onClick={() => ec().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => ec().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => ec().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="h-3.5 w-3.5" />
        </ToolbarButton>
      </div>

      {/* Formatting */}
      <div className="flex items-center gap-0.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md p-0.5 shadow-2xs">
        <ToolbarButton
          onClick={() => ec().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold"
        >
          <Bold className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => ec().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic"
        >
          <Italic className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => ec().toggleUnderline().run()}
          active={editor.isActive('underline')}
          title="Underline"
        >
          <UnderlineIcon className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => ec().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Blockquote"
        >
          <Quote className="h-3.5 w-3.5" />
        </ToolbarButton>
      </div>

      {/* Lists */}
      <div className="flex items-center gap-0.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md p-0.5 shadow-2xs">
        <ToolbarButton
          onClick={() => ec().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => ec().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Ordered List"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolbarButton>
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-0.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md p-0.5 shadow-2xs">
        <ToolbarButton
          onClick={() => ec().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          <AlignLeft className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => ec().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
        >
          <AlignCenter className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => ec().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
        >
          <AlignRight className="h-3.5 w-3.5" />
        </ToolbarButton>
      </div>

      {/* Links & Tables */}
      <div className="flex items-center gap-0.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md p-0.5 shadow-2xs">
        <div className="relative" ref={linkMenuRef}>
          <ToolbarButton
            onClick={() => {
              if (editor.isActive('link')) {
                setLinkUrl(editor.getAttributes('link').href || '');
              }
              setIsLinkMenuOpen(!isLinkMenuOpen);
            }}
            active={editor.isActive('link')}
            title="Insert Link"
          >
            <LinkIcon className="h-3.5 w-3.5" />
          </ToolbarButton>

          {isLinkMenuOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-3 animate-in fade-in zoom-in duration-150">
              <div className="space-y-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Link URL</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://example.com"
                      value={linkUrl}
                      onChange={(e: any) => setLinkUrl(e.target.value)}
                      onKeyDown={(e: any) => e.key === 'Enter' && handleLinkSubmit()}
                      autoFocus
                      className="h-8 text-xs font-sans"
                    />
                    <Button
                      type="primary"
                      onClick={() => handleLinkSubmit()}
                      className="h-8 w-8 p-0 flex items-center justify-center shrink-0"
                      disabled={!linkUrl}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                {editor.isActive('link') && (
                  <Button
                    type="text"
                    danger
                    onClick={handleRemoveLink}
                    className="w-full justify-start h-7 text-[11px] font-bold"
                    icon={<Trash2 className="h-3.5 w-3.5" />}
                  >
                    Remove Link
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        <Dropdown
          trigger={['click']}
          menu={{
            items: [
              {
                key: 'insertTable',
                label: 'Insert Table (3x3)',
                icon: <TableIcon className="h-3.5 w-3.5" />,
                onClick: () => ec().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
              },
              { type: 'divider' },
              {
                key: 'addRowBefore',
                label: 'Add Row Before',
                disabled: !editor.isActive('table'),
                onClick: () => ec().addRowBefore().run(),
              },
              {
                key: 'addRowAfter',
                label: 'Add Row After',
                disabled: !editor.isActive('table'),
                onClick: () => ec().addRowAfter().run(),
              },
              {
                key: 'deleteRow',
                label: 'Delete Row',
                danger: true,
                disabled: !editor.isActive('table'),
                onClick: () => ec().deleteRow().run(),
              },
              { type: 'divider' },
              {
                key: 'addColumnBefore',
                label: 'Add Column Before',
                disabled: !editor.isActive('table'),
                onClick: () => ec().addColumnBefore().run(),
              },
              {
                key: 'addColumnAfter',
                label: 'Add Column After',
                disabled: !editor.isActive('table'),
                onClick: () => ec().addColumnAfter().run(),
              },
              {
                key: 'deleteColumn',
                label: 'Delete Column',
                danger: true,
                disabled: !editor.isActive('table'),
                onClick: () => ec().deleteColumn().run(),
              },
              { type: 'divider' },
              {
                key: 'deleteTable',
                label: 'Delete Entire Table',
                danger: true,
                disabled: !editor.isActive('table'),
                onClick: () => ec().deleteTable().run(),
              },
            ],
          }}
        >
          <div className="flex">
            <ToolbarButton
              onClick={() => { }}
              active={editor.isActive('table')}
              title="Table Controls"
            >
              <TableIcon className="h-3.5 w-3.5" />
            </ToolbarButton>
          </div>
        </Dropdown>
      </div>

      {/* Insert Image / Media Button (Reuses Centralized MediaPickerModal) */}
      {showMediaUpload && (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsMediaPickerOpen(true)}
            className="h-7 px-2.5 flex items-center gap-1.5 transition-all rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 text-xs font-semibold cursor-pointer shadow-2xs"
            title="Insert image from Media Library"
          >
            <ImageIcon className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>Insert Image</span>
          </button>

          {/* Integrated Reusable Media Selector Modal */}
          <MediaPickerModal
            isOpen={isMediaPickerOpen}
            onClose={() => setIsMediaPickerOpen(false)}
            mode={MediaSelectorMode.SINGLE}
            onConfirm={handleMediaConfirm}
            title="Select Image to Embed in Blog Content"
          />
        </div>
      )}
    </div>
  );
};

export interface AppRichTextEditorProps {
  value?: string;
  onChange: (value: string) => void;
  onMediaUpload?: (file: File) => Promise<string>;
  placeholder?: string;
  showMediaUpload?: boolean;
  height?: string;
}

export const AppRichTextEditor = ({
  value,
  onChange,
  placeholder = 'Write article content here...',
  showMediaUpload = true,
  height = '400px',
}: AppRichTextEditorProps) => {
  const safeValue = value ?? '';
  const lastExternalValue = useRef<string>(safeValue);

  const handleUpdate = useCallback(
    ({ editor }: { editor: Editor }) => {
      const html = editor.getHTML();
      lastExternalValue.current = html;
      onChange(html);
    },
    [onChange]
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-amber-600 dark:text-amber-400 underline cursor-pointer font-medium',
        },
      }),
      ImageResize.configure({}),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: safeValue,
    onUpdate: handleUpdate,
  });

  // Sync content when value changes externally (e.g., initial blog load)
  useEffect(() => {
    if (editor && safeValue !== lastExternalValue.current) {
      lastExternalValue.current = safeValue;
      editor.commands.setContent(safeValue);
    }
  }, [safeValue, editor]);

  return (
    <div
      className={cn(
        'border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 flex flex-col transition-all shadow-2xs overflow-hidden font-sans',
        'focus-within:border-slate-400 dark:focus-within:border-slate-500'
      )}
    >
      <MenuBar editor={editor} showMediaUpload={showMediaUpload} />
      <div
        style={{ minHeight: height }}
        className="p-4 overflow-y-auto max-h-[600px] text-sm leading-relaxed text-slate-900 dark:text-slate-100 font-sans cursor-text focus:outline-none"
        onClick={() => editor?.chain().focus().run()}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default AppRichTextEditor;