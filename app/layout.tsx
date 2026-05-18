import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

export const metadata = {
  title: "Admin - AI 学习笔记",
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
