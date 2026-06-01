"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNav() {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    `block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
      pathname === href
        ? "bg-accent-muted text-accent"
        : "text-ink-muted hover:bg-surface-light hover:text-ink-body"
    }`;

  return (
    <aside className="w-56 bg-surface-card border-r border-surface-border flex flex-col shrink-0">
      <div className="px-4 py-4 border-b border-surface-light">
        <Link
          href="/admin"
          className="text-base font-semibold text-ink-heading tracking-tight"
        >
          Admin
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="block px-3 py-2 rounded-md text-sm font-medium
                     border border-white/10 text-ink-muted
                     hover:border-accent/40 hover:text-accent
                     transition-colors duration-150"
        >
          查看博客首页
        </Link>

        <div className="pt-3 mt-1 border-t border-surface-light">
          <Link href="/admin" className={linkClass("/admin")}>
            文章列表
          </Link>
          <Link href="/admin/new" className={linkClass("/admin/new")}>
            + 新建文章
          </Link>
        </div>
      </nav>

      <div className="p-3 border-t border-surface-light">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full text-left px-3 py-2 rounded-md text-sm text-ink-faint
                     hover:bg-surface-light hover:text-ink-muted transition-colors duration-150"
        >
          退出登录
        </button>
      </div>
    </aside>
  );
}