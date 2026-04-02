'use client';

import dynamic from 'next/dynamic';

const KanbanBoard = dynamic(() => import('../components/KanbanBoard'), {
  ssr: false,
  loading: () => <div className="p-4">Loading Kanban Board...</div>
});

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-dark-navy text-white p-4">
        <h1 className="text-2xl font-bold">Kanban Board</h1>
      </header>
      <KanbanBoard />
    </div>
  );
}
