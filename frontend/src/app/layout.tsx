import type { Metadata } from 'next';
import './globals.css';
import { BoardProvider } from '../lib/store';

export const metadata: Metadata = {
  title: 'Kanban Board MVP',
  description: 'A polished single-board Kanban MVP built with Next.js.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-[#edf2f8] antialiased">
      <body className="min-h-full text-[#032147]">
        <BoardProvider>{children}</BoardProvider>
      </body>
    </html>
  );
}
