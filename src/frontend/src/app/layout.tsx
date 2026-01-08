import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Todo Webapp",
  description: "Manage your todos with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-slate-50 text-slate-900 ${inter.className}`}>
        <div className="min-h-screen flex flex-col">
          <header className="border-b bg-white shadow-sm">
            <div className="mx-auto max-w-4xl px-4 py-4">
              <h1 className="text-xl font-semibold text-slate-800">Todo Webapp</h1>
            </div>
          </header>
          <main className="flex-1">
            <div className="mx-auto max-w-4xl px-4 py-8">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
