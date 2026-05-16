"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import PostEditor from "@/components/PostEditor";

export default function EditPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: session } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/posts/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Post not found");
        return res.json();
      })
      .then((data) => {
        setTitle(data.title || "");
        setDescription(data.description || "");
        setContent(data.content || "");
      })
      .catch(() => setMessage({ type: "error", text: "加载文章失败" }))
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleSubmit(data: {
    title: string;
    description: string;
    content: string;
  }) {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/posts/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Update failed");
      }

      setMessage({ type: "success", text: "保存成功" });
    } catch (err: unknown) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "保存失败",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/posts/${slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      router.push("/admin");
    } catch (err: unknown) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "删除失败",
      });
      setSaving(false);
    }
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        请先登录
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        加载中...
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <h2 className="text-xl font-bold text-gray-900 mb-6">编辑文章</h2>

      {message && (
        <div
          className={`border rounded-lg p-3 mb-4 text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <PostEditor
          initialTitle={title}
          initialDescription={description}
          initialContent={content}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          saving={saving}
          submitLabel="保 存"
        />
      </div>
    </div>
  );
}
