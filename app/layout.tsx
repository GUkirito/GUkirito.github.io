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
      <body className="bg-gray-100 text-gray-900 min-h-screen">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
