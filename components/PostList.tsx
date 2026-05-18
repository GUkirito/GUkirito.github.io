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
    return <div className="text-ink-muted py-8 text-center">加载中...</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="text-ink-muted py-8 text-center">
        还没有文章，
        <Link href="/admin/new" className="text-accent hover:underline font-medium">
          写一篇
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-surface-border text-left text-ink-muted">
            <th className="pb-3 font-medium">标题</th>
            <th className="pb-3 font-medium w-28">日期</th>
            <th className="pb-3 font-medium w-32 text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.slug} className="border-b border-surface-light">
              <td className="py-3 pr-4">
                <span className="text-ink-body">{post.title}</span>
                {post.description && (
                  <span className="text-ink-faint text-xs ml-2 truncate max-w-xs inline-block align-middle">
                    — {post.description}
                  </span>
                )}
              </td>
              <td className="py-3 text-ink-muted whitespace-nowrap">
                {post.date || "-"}
              </td>
              <td className="py-3 text-right whitespace-nowrap">
                <Link
                  href={`/admin/edit/${post.slug}`}
                  className="text-accent hover:text-accent-hover mr-3 transition-colors duration-150 font-medium"
                >
                  编辑
                </Link>
                <button
                  onClick={() => {
                    if (window.confirm(`确定删除「${post.title}」？此操作不可撤销。`)) {
                      onDelete(post.slug);
                    }
                  }}
                  className="text-red-400 hover:text-red-300 transition-colors duration-150"
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