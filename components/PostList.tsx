"use client";

import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

interface PostListProps {
  posts: PostMeta[];
  loading: boolean;
  onDelete: (slug: string) => void;
}

export default function PostList({ posts, loading, onDelete }: PostListProps) {
  if (loading) {
    return (
      <div className="text-ink-muted py-8 text-center text-sm">加载中...</div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-ink-muted py-8 text-center text-sm">
        还没有文章，
        <Link
          href="/admin/new"
          className="text-accent hover:underline font-medium"
        >
          写一篇
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-surface-border text-left text-ink-muted text-xs">
            <th className="pb-3 font-medium">标题</th>
            <th className="pb-3 font-medium w-24">日期</th>
            <th className="pb-3 font-medium w-28 hidden sm:table-cell">
              分类 / 标签
            </th>
            <th className="pb-3 font-medium w-24 text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.slug} className="border-b border-surface-light">
              <td className="py-3 pr-4">
                <div className="text-ink-body font-medium leading-snug">
                  {post.title}
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
                    <span
                      key={c}
                      className="inline-block px-1.5 py-0.5 text-xs rounded
                                 bg-amber-400/10 text-amber-500"
                    >
                      {c}
                    </span>
                  ))}
                  {post.tags?.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="inline-block px-1.5 py-0.5 text-xs rounded
                                 bg-accent-muted text-ink-muted"
                    >
                      {t}
                    </span>
                  ))}
                  {post.tags && post.tags.length > 3 && (
                    <span className="text-ink-faint text-xs">
                      +{post.tags.length - 3}
                    </span>
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
                    if (
                      window.confirm(
                        `确定删除「${post.title}」？此操作不可撤销。`
                      )
                    ) {
                      onDelete(post.slug);
                    }
                  }}
                  className="text-red-400 hover:text-red-300 transition-colors duration-150 text-xs"
                >
                  删除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}