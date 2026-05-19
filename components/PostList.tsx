"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

interface PostListProps {
  posts: PostMeta[];
  loading: boolean;
  onDelete: (slug: string) => void;
}

export default function PostList({ posts, loading, onDelete }: PostListProps) {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterTag, setFilterTag] = useState("");

  const allCategories = useMemo(() => {
    const s = new Set<string>();
    posts.forEach((p) => p.categories?.forEach((c) => s.add(c)));
    return Array.from(s).sort();
  }, [posts]);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    posts.forEach((p) => p.tags?.forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, [posts]);

  const filtered = useMemo(() => {
    let list = posts;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) =>
        [p.title, p.description, ...(p.categories || []), ...(p.tags || [])]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }
    if (filterCategory) {
      list = list.filter((p) => (p.categories || []).includes(filterCategory));
    }
    if (filterTag) {
      list = list.filter((p) => (p.tags || []).includes(filterTag));
    }
    return list;
  }, [posts, search, filterCategory, filterTag]);

  const clearFilters = () => {
    setSearch("");
    setFilterCategory("");
    setFilterTag("");
  };

  const hasFilter = search || filterCategory || filterTag;

  if (loading) {
    return (
      <div className="text-ink-muted py-8 text-center text-sm">加载中...</div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-ink-muted py-8 text-center text-sm">
        还没有文章，
        <Link href="/admin/new" className="text-accent hover:underline font-medium">
          写一篇
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4 px-1">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索标题/摘要/分类/标签..."
          className="flex-1 min-w-[200px] px-3 py-1.5 bg-surface-bg border border-surface-border rounded-lg text-sm text-ink-body
                     placeholder:text-ink-faint
                     focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
                     transition-colors duration-150"
        />
        <select
          value={filterCategory}
          onChange={(e) => { setFilterCategory(e.target.value); setFilterTag(""); }}
          className="px-2 py-1.5 bg-surface-bg border border-surface-border rounded-lg text-sm text-ink-body
                     focus:outline-none focus:ring-2 focus:ring-accent/30"
        >
          <option value="">全部分类</option>
          {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={filterTag}
          onChange={(e) => { setFilterTag(e.target.value); setFilterCategory(""); }}
          className="px-2 py-1.5 bg-surface-bg border border-surface-border rounded-lg text-sm text-ink-body
                     focus:outline-none focus:ring-2 focus:ring-accent/30"
        >
          <option value="">全部标签</option>
          {allTags.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        {hasFilter && (
          <button
            onClick={clearFilters}
            className="text-xs text-ink-muted hover:text-accent transition-colors duration-150"
          >
            清除
          </button>
        )}
      </div>

      {/* Count */}
      <div className="flex items-center justify-between px-1 mb-2">
        <span className="text-xs text-ink-muted">
          共 {posts.length} 篇
          {hasFilter && <span>，筛选出 {filtered.length} 篇</span>}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border text-left text-ink-muted text-xs">
              <th className="pb-3 font-medium">标题</th>
              <th className="pb-3 font-medium w-24">日期</th>
              <th className="pb-3 font-medium w-28 hidden sm:table-cell">分类 / 标签</th>
              <th className="pb-3 font-medium w-28 text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-ink-muted text-sm">
                  {hasFilter ? "没有匹配的文章" : "还没有文章"}
                </td>
              </tr>
            ) : (
              filtered.map((post) => (
                <tr key={post.slug} className="border-b border-surface-light">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-ink-body font-medium leading-snug">
                        {post.title}
                      </span>
                      {post.draft && (
                        <span className="inline-block px-1.5 py-0.5 text-xs rounded bg-amber-400/10 text-amber-500 shrink-0">
                          草稿
                        </span>
                      )}
                    </div>
                    {post.description && (
                      <div className="text-ink-faint text-xs mt-0.5 line-clamp-1">
                        {post.description}
                      </div>
                    )}
                  </td>
                  <td className="py-3 text-ink-muted whitespace-nowrap text-xs">
                    {post.date || "-"}
                  </td>
                  <td className="py-3 hidden sm:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {post.categories?.map((c) => (
                        <span key={c} className="inline-block px-1.5 py-0.5 text-xs rounded bg-amber-400/10 text-amber-500">
                          {c}
                        </span>
                      ))}
                      {post.tags?.slice(0, 3).map((t) => (
                        <span key={t} className="inline-block px-1.5 py-0.5 text-xs rounded bg-accent-muted text-ink-muted">
                          {t}
                        </span>
                      ))}
                      {post.tags && post.tags.length > 3 && (
                        <span className="text-ink-faint text-xs">+{post.tags.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 text-right whitespace-nowrap">
                    <Link
                      href={`/admin/edit/${post.slug}`}
                      className="text-accent hover:text-accent-hover mr-3 transition-colors duration-150 text-xs font-medium"
                    >
                      编辑
                    </Link>
                    <button
                      onClick={() => {
                        if (window.confirm(`确定删除「${post.title}」？此操作不可撤销。`)) {
                          onDelete(post.slug);
                        }
                      }}
                      className="text-red-400 hover:text-red-300 transition-colors duration-150 text-xs"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}