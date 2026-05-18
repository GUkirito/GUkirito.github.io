"use client";

import dynamic from "next/dynamic";
import { useState, FormEvent } from "react";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-surface-light animate-pulse rounded-lg" />
  ),
});

interface PostEditorProps {
  initialTitle?: string;
  initialDescription?: string;
  initialContent?: string;
  submitLabel?: string;
  onSubmit: (data: {
    title: string;
    description: string;
    content: string;
  }) => Promise<void>;
  onDelete?: () => Promise<void>;
  saving?: boolean;
}

export default function PostEditor({
  initialTitle = "",
  initialDescription = "",
  initialContent = "",
  submitLabel = "发 布",
  onSubmit,
  onDelete,
  saving = false,
}: PostEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [content, setContent] = useState(initialContent);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    await onSubmit({ title, description, content });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-ink-body mb-1">
          标题
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="文章标题"
          required
          className="w-full px-3 py-2 bg-surface-card border border-surface-border rounded-lg text-sm text-ink-body
                     placeholder:text-ink-faint
                     focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
                     transition-colors duration-150"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink-body mb-1">
          摘要（可选）
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="一句话简介，显示在首页"
          className="w-full px-3 py-2 bg-surface-card border border-surface-border rounded-lg text-sm text-ink-body
                     placeholder:text-ink-faint
                     focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
                     transition-colors duration-150"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink-body mb-1">
          正文（Markdown）
        </label>
        <MDEditor
          value={content}
          onChange={(val) => setContent(val || "")}
          height={480}
          preview="edit"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving || !title.trim() || !content.trim()}
          className="px-6 py-2.5 bg-accent text-white rounded-lg text-sm font-medium
                     hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors duration-150"
        >
          {saving ? "保存中..." : submitLabel}
        </button>

        {onDelete && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm("确定删除这篇文章？此操作不可撤销。")) {
                onDelete();
              }
            }}
            className="px-6 py-2.5 text-red-400 border border-red-400/20 rounded-lg text-sm
                       hover:bg-red-400/10 transition-colors duration-150"
          >
            删除文章
          </button>
        )}
      </div>
    </form>
  );
}