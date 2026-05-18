"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import PostEditor from "@/components/PostEditor";

export default function NewPostPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  if (!session) {
    return (
      <div className="flex items-center justify-center h-64 text-ink-muted">
        请先登录
      </div>
    );
  }

  async function handleSubmit(data: {
    title: string;
    description: string;
    content: string;
  }) {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Publish failed");
      }

      const result = await res.json();
      setMessage({
        type: "success",
        text: `发布成功！跳转到编辑页...`,
      });
      setTimeout(() => {
        router.push(`/admin/edit/${result.slug}`);
      }, 800);
    } catch (err: unknown) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "发布失败",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl">
      <h2 className="text-xl font-semibold text-ink-heading tracking-tight mb-6">
        新建文章
      </h2>

      {message && (
        <div
          className={`border rounded-lg p-3 mb-4 text-sm ${
            message.type === "success"
              ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
              : "bg-red-400/10 text-red-400 border-red-400/20"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-surface-card rounded-xl border border-surface-border p-6">
        <PostEditor
          onSubmit={handleSubmit}
          saving={saving}
          submitLabel="发 布"
        />
      </div>
    </div>
  );
}
