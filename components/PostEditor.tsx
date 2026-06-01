"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useCallback, useRef, FormEvent } from "react";

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
  initialDraft?: boolean;
  isNew?: boolean;
  slug?: string;
  submitLabel?: string;
  onSubmit: (data: {
    title: string;
    description: string;
    content: string;
    date: string;
    categories: string[];
    tags: string[];
    draft: boolean;
  }) => Promise<void>;
  onDelete?: () => Promise<void>;
  saving?: boolean;
}

const DRAFT_KEY = "post-draft";

export default function PostEditor({
  initialTitle = "",
  initialDescription = "",
  initialContent = "",
  initialDate = "",
  initialCategories = [],
  initialTags = [],
  initialDraft = false,
  isNew = false,
  slug: editSlug,
  submitLabel = "发布",
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
  const [draft, setDraft] = useState(initialDraft);

  const [dirty, setDirty] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const initRef = useRef(false);

  // Load localStorage draft on mount (new only)
  useEffect(() => {
    if (isNew && !initRef.current) {
      initRef.current = true;
      try {
        const saved = localStorage.getItem(DRAFT_KEY);
        if (saved) {
          const d = JSON.parse(saved);
          if (d.title) setTitle(d.title);
          if (d.description) setDescription(d.description);
          if (d.content) setContent(d.content);
          if (d.date) setDate(d.date);
          if (d.categories) setCategoriesStr(
            Array.isArray(d.categories) ? d.categories.join(", ") : d.categories
          );
          if (d.tags) setTagsStr(
            Array.isArray(d.tags) ? d.tags.join(", ") : d.tags
          );
          if (typeof d.draft === "boolean") setDraft(d.draft);
        }
      } catch { /* ignore */ }
      setLoaded(true);
    } else {
      setLoaded(true);
    }
  }, [isNew]);

  // Track dirty
  const markDirty = useCallback(() => !dirty && setDirty(true), [dirty]);

  // Unsaved changes warning
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  // Save draft to localStorage (new only, debounced)
  useEffect(() => {
    if (!isNew || !dirty || !loaded) return;
    const t = setTimeout(() => {
      const d = { title, description, content, date, categories: categoriesStr, tags: tagsStr, draft };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
    }, 800);
    return () => clearTimeout(t);
  }, [isNew, dirty, loaded, title, description, content, date, categoriesStr, tagsStr, draft]);

  function clearDraft() {
    setDirty(false);
    if (isNew) localStorage.removeItem(DRAFT_KEY);
  }

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

    await onSubmit({ title, description, content, date, categories, tags, draft });
    clearDraft();
  }

  // Computed values
  const wordCount = content.replace(/\s/g, "").length;
  const readMin = Math.max(1, Math.ceil(wordCount / 450));
  const descLen = description.length;
  const slugPreview = title.trim()
    ? (date ? date + "-" : "") + title.trim().replace(/\s+/g, "-").replace(/[^\w一-鿿\-]/g, "").slice(0, 60).replace(/-+$/, "") + ".md"
    : "";

  const inputClass =
    "w-full px-3 py-2 bg-surface-card border border-surface-border rounded-lg text-sm text-ink-body " +
    "placeholder:text-ink-faint " +
    "focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent " +
    "transition-colors duration-150";

  if (!loaded) {
    return <div className="text-ink-muted py-8 text-center text-sm">加载�?..</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-ink-body mb-1">
          标题
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => { setTitle(e.target.value); markDirty(); }}
          placeholder="文章标题"
          required
          className={inputClass}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-ink-body mb-1">
          摘要
          <span className="text-ink-faint font-normal ml-1">
            {descLen > 0 && `�?{descLen} �?{descLen > 160 ? "，建�?�?60" : ""}）`}
          </span>
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => { setDescription(e.target.value); markDirty(); }}
          placeholder="一句话简介，显示在首�?
          className={inputClass}
        />
      </div>

      {/* Date / Categories / Tags row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink-body mb-1">日期</label>
          <input type="date" value={date} onChange={(e) => { setDate(e.target.value); markDirty(); }} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-body mb-1">
            分类
            {categoriesStr.trim() && (
              <span className="text-ink-faint font-normal ml-1">
                {categoriesStr.split(/[,，]/).filter(Boolean).length} �?              </span>
            )}
          </label>
          <input type="text" value={categoriesStr} onChange={(e) => { setCategoriesStr(e.target.value); markDirty(); }} placeholder="AI概念, AI实践" className={inputClass} />
          {categoriesStr.trim() && (
            <div className="flex flex-wrap gap-1 mt-1">
              {categoriesStr.split(/[,，]/).filter(Boolean).map((c) => (
                <span key={c} className="inline-block px-1.5 py-0.5 text-xs rounded bg-accent-muted text-accent">{c.trim()}</span>
              ))}
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-body mb-1">
            标签
            {tagsStr.trim() && (
              <span className="text-ink-faint font-normal ml-1">
                {tagsStr.split(/[,，]/).filter(Boolean).length} �?              </span>
            )}
          </label>
          <input type="text" value={tagsStr} onChange={(e) => { setTagsStr(e.target.value); markDirty(); }} placeholder="LLM, 入门, 工作原理" className={inputClass} />
          {tagsStr.trim() && (
            <div className="flex flex-wrap gap-1 mt-1">
              {tagsStr.split(/[,，]/).filter(Boolean).map((t) => (
                <span key={t} className="inline-block px-1.5 py-0.5 text-xs rounded bg-accent-muted text-ink-muted">{t.trim()}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Slug preview */}
      {slugPreview && (
        <div className="text-xs text-ink-muted">
          文件名预览：<code className="bg-surface-light px-1 py-0.5 rounded text-ink-body">{slugPreview}</code>
        </div>
      )}

      {/* Draft toggle */}
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={draft}
          onChange={(e) => { setDraft(e.target.checked); markDirty(); }}
          className="w-4 h-4 rounded border-surface-border accent-accent"
        />
        <span className="text-sm text-ink-body">草稿（发布前不会显示在首页）</span>
      </label>

      {/* Body */}
      <div>
        <label className="block text-sm font-medium text-ink-body mb-1">
          正文（Markdown�?          <span className="text-ink-faint font-normal ml-1">
            {wordCount > 0 && ` · ${wordCount} �?· �?${readMin} 分钟`}
          </span>
        </label>
        <MDEditor
          value={content}
          onChange={(val) => { setContent(val || ""); markDirty(); }}
          height={480}
          preview="edit"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="submit"
          disabled={saving || !title.trim() || !content.trim()}
          className="px-6 py-2.5 bg-accent text-white rounded-lg text-sm font-medium
                     hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors duration-150"
        >
          {saving ? "保存�?.." : submitLabel}
        </button>

        {editSlug && (
          <a
            href={`/${editSlug}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 border border-surface-border rounded-lg text-sm text-ink-muted
                       hover:border-accent hover:text-accent transition-colors duration-150 no-underline"
          >
            查看文章
          </a>
        )}

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 border border-surface-border rounded-lg text-sm text-ink-muted
                     hover:border-accent hover:text-accent transition-colors duration-150 no-underline"
        >
          查看首页
        </a>

        {onDelete && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm("确定删除这篇文章？此操作不可撤销�?)) {
                onDelete();
              }
            }}
            className="px-6 py-2.5 text-red-400 border border-red-400/20 rounded-lg text-sm
                       hover:bg-red-400/10 transition-colors duration-150 ml-auto"
          >
            删除文章
          </button>
        )}
      </div>
    </form>
  );
}