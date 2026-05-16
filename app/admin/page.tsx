"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PostList from "@/components/PostList";
import type { PostMeta } from "@/lib/posts";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status !== "authenticated") return;

    fetch("/api/posts")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => setPosts(data.posts || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [status, router]);

  const handleDelete = useCallback(async (slug: string) => {
    try {
      const res = await fetch(`/api/posts/${slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setPosts((prev) => prev.filter((p) => p.slug !== slug));
    } catch {
      alert("删除失败，请稍后重试");
    }
  }, []);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        加载中...
      </div>
    );
  }

  if (!session) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">文章管理</h2>
        <span className="text-sm text-gray-500">
          共 {posts.length} 篇
        </span>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 mb-4 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <PostList posts={posts} loading={loading} onDelete={handleDelete} />
      </div>
    </div>
  );
}
