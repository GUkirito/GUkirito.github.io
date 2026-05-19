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
  initialDate?: string;
  initialCategories?: string[];
  initialTags?: string[];
  submitLabel?: string;
  onSubmit: (data: {
    title: string;
    description: string;
    content: string;
    date: string;
    categories: string[];
    tags: string[];
  }) => Promise<void>;
  onDelete?: () => Promise<void>;
  saving?: boolean;
}

export default function PostEditor({
  initialTitle = "",
  initialDescription = "",
  initialContent = "",
  initialDate = "",
  initialCategories = [],
  initialTags = [],
  submitLabel = "发 布",
  onSubmit,
  onDelete,
  saving = false,
}: PostEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [content, setContent] = useState(initialContent);
  const [date, setDate] = useState(initialDate);
  const [categoriesStr, setCategoriesStr] = useState(
    initialCategories.join(", ")
  );
  const [tagsStr, setTagsStr] = useState(initialTags.join(", "));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const categories = categoriesStr
      .split(/[,，]/)
      .map((s) => s.trim())
      .filter(Boolean);
    const tags = tagsStr
      .split(/[,，]/)
      .map((s) => s.trim())
      .filter(Boolean);

    await onSubmit({ title, description, content, date, categories, tags });
  }

  const inputClass =
    "w-full px-3 py-2 bg-surface-card border border-surface-border rounded-lg text-sm text-ink-body " +
    "placeholder:text-ink-faint " +
    "focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent " +
    "transition-colors duration-150";

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
          className={inputClass}
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
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink-body mb-1">
            日期
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-body mb-1">
            分类（逗号分隔）
          </label>
          <input
            type="text"
            value={categoriesStr}
            onChange={(e) => setCategoriesStr(e.target.value)}
            placeholder="AI概念, AI实践"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-body mb-1">
            标签（逗号分隔）
          </label>
          <input
            type="text"
            value={tagsStr}
            onChange={(e) => setTagsStr(e.target.value)}
            placeholder="LLM, 入门, 工作原理"
            className={inputClass}
          />
        </div>
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