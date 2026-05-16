"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNav() {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    `block px-3 py-2 rounded-lg text-sm font-medium transition ${
      pathname === href
        ? "bg-blue-50 text-blue-700"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <Link href="/admin" className="text-lg font-bold text-gray-900">
          Admin
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        <Link href="/admin" className={linkClass("/admin")}>
          文章列表
        </Link>
        <Link href="/admin/new" className={linkClass("/admin/new")}>
          + 新建文章
        </Link>
      </nav>

      <div className="p-3 border-t border-gray-100">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-500
                     hover:bg-gray-100 hover:text-gray-700 transition"
        >
          退出登录
        </button>
      </div>
    </aside>
  );
}
