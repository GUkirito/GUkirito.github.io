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
    return <div className="text-gray-400 py-8 text-center">加载中...</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="text-gray-400 py-8 text-center">
        还没有文章，
        <Link href="/admin/new" className="text-blue-600 hover:underline">
          写一篇
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-gray-500">
            <th className="pb-3 font-medium">标题</th>
            <th className="pb-3 font-medium w-28">日期</th>
            <th className="pb-3 font-medium w-32 text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.slug} className="border-b border-gray-100">
              <td className="py-3 pr-4">
                <span className="text-gray-900">{post.title}</span>
                {post.description && (
                  <span className="text-gray-400 text-xs ml-2 truncate max-w-xs inline-block align-middle">
                    — {post.description}
                  </span>
                )}
              </td>
              <td className="py-3 text-gray-500 whitespace-nowrap">
                {post.date || "-"}
              </td>
              <td className="py-3 text-right whitespace-nowrap">
                <Link
                  href={`/admin/edit/${post.slug}`}
                  className="text-blue-600 hover:text-blue-800 mr-3 transition"
                >
                  编辑
                </Link>
                <button
                  onClick={() => {
                    if (window.confirm(`确定删除「${post.title}」？此操作不可撤销。`)) {
                      onDelete(post.slug);
                    }
                  }}
                  className="text-red-500 hover:text-red-700 transition"
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
