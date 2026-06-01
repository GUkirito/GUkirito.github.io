import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

export const metadata = {
  title: {
    template: "%s - AI 学习笔记",
    default: "AI 学习笔记",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
