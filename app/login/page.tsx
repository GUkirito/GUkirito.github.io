"use client";

import { Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

function LoginContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const rejectedUser = searchParams.get("user");

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/admin");
    }
  }, [status, router]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="bg-surface-card rounded-xl border border-surface-border shadow-lg p-8 w-full max-w-sm text-center">
        <h1 className="text-xl font-bold text-ink-heading tracking-tight mb-1">
          AI 学习笔记
        </h1>
        <p className="text-ink-muted text-sm mb-6">后台管理</p>

        {error === "unauthorized" && rejectedUser && (
          <div className="bg-red-400/10 text-red-400 border border-red-400/20 rounded-lg p-3 mb-4 text-sm">
            <p className="font-medium mb-1">登录被拒�?/p>
            <p>
              GitHub 账号{" "}
              <code className="bg-surface-light px-1.5 py-0.5 rounded text-ink-body text-xs">
                {rejectedUser}
              </code>{" "}
              不在白名单中，仅允许{" "}
              <code className="bg-surface-light px-1.5 py-0.5 rounded text-ink-body text-xs">
                gukirito
              </code>{" "}
              登录�?
            </p>
          </div>
        )}

        {error && error !== "unauthorized" && (
          <div className="bg-red-400/10 text-red-400 border border-red-400/20 rounded-lg p-3 mb-4 text-sm">
            登录失败：{error === "no_login" ? "无法获取 GitHub 账号信息" : error}
          </div>
        )}

        {status === "loading" ? (
          <div className="text-ink-muted py-4 text-sm">检查登录状�?..</div>
        ) : (
          <button
            onClick={() => signIn("github", { callbackUrl: "/admin" })}
            className="inline-flex items-center gap-2 bg-ink-heading text-surface-bg px-6 py-3 rounded-lg
                       hover:bg-ink-body transition-colors duration-150 font-medium text-sm"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Sign in with GitHub
          </button>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen text-ink-muted text-sm">
          加载�?..
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}