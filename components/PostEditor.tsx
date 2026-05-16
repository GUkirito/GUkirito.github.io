"use client";

import dynamic from "next/dynamic";
import { useState, FormEvent } from "react";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          标题
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="文章标题"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          摘要（可选）
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="一句话简介，显示在首页"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
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
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium
                     hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
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
            className="px-6 py-2.5 text-red-600 border border-red-200 rounded-lg text-sm
                       hover:bg-red-50 transition"
          >
            删除文章
          </button>
        )}
      </div>
    </form>
  );
}
