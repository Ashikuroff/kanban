import KanbanBoard from '../components/KanbanBoard';

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
