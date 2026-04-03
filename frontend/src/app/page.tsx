import KanbanBoard from '../components/KanbanBoard';

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(236,173,10,0.16),transparent_26%),radial-gradient(circle_at_top_right,rgba(32,157,215,0.18),transparent_30%),linear-gradient(180deg,#f8fbff_0%,#edf2f8_100%)] py-6 sm:py-8">
      <KanbanBoard />
    </main>
  );
}
