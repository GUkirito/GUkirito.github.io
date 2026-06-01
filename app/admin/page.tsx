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
      <div className="flex items-center justify-center h-64 text-ink-muted">
        加载�?..
      </div>
    );
  }

  if (!session) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-ink-heading tracking-tight">
          文章管理
        </h2>
        <span className="text-sm text-ink-muted">
          �?{posts.length} �?
        </span>
      </div>

      {error && (
        <div className="bg-red-400/10 text-red-400 border border-red-400/20 rounded-lg p-3 mb-4 text-sm">
          {error}
        </div>
      )}

      <div className="bg-surface-card rounded-xl border border-surface-border">
        <PostList posts={posts} loading={loading} onDelete={handleDelete} />
      </div>
    </div>
  );
}