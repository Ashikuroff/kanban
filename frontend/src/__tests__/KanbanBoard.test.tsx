import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import KanbanBoard from '../components/KanbanBoard';
import { BoardProvider } from '../lib/store';
import type { BoardState } from '../types';

function renderBoard() {
  return render(
    <BoardProvider>
      <KanbanBoard />
    </BoardProvider>
  );
}

describe('KanbanBoard', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders the five fixed columns and seeded cards', () => {
    renderBoard();

    expect(screen.getByDisplayValue('Ideas')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Planned')).toBeInTheDocument();
    expect(screen.getByDisplayValue('In Progress')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Review')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Complete')).toBeInTheDocument();
    expect(screen.getByText('Refine onboarding visuals')).toBeInTheDocument();
    expect(screen.getByText('Build drag interactions')).toBeInTheDocument();
  });

  it('renames a column inline', async () => {
    const user = userEvent.setup();
    renderBoard();

    const ideasInput = screen.getByDisplayValue('Ideas');
    await user.clear(ideasInput);
    await user.type(ideasInput, 'Backlog');

    expect(screen.getByDisplayValue('Backlog')).toBeInTheDocument();
  });

  it('adds a new card through the inline composer', async () => {
    const user = userEvent.setup();
    renderBoard();

    const addButtons = screen.getAllByRole('button', { name: 'Add card' });
    await user.click(addButtons[0]);
    await user.type(screen.getByPlaceholderText('Card title'), 'Ship board polish');
    await user.type(screen.getByPlaceholderText('Details'), 'Tune spacing and motion.');
    await user.click(screen.getByRole('button', { name: 'Save card' }));

    expect(screen.getByText('Ship board polish')).toBeInTheDocument();
    expect(screen.getByText('Tune spacing and motion.')).toBeInTheDocument();
  });

  it('deletes a card', async () => {
    const user = userEvent.setup();
    renderBoard();

    await user.click(screen.getByRole('button', { name: 'Delete card Refine onboarding visuals' }));

    expect(screen.queryByText('Refine onboarding visuals')).not.toBeInTheDocument();
  });

  it('loads persisted cards after refresh', async () => {
    const persistedState: BoardState = {
      columns: [
        { id: 'column-1', title: 'Ideas', order: 0 },
        { id: 'column-2', title: 'Planned', order: 1 },
        { id: 'column-3', title: 'In Progress', order: 2 },
        { id: 'column-4', title: 'Review', order: 3 },
        { id: 'column-5', title: 'Complete', order: 4 },
      ],
      cards: [
        {
          id: 'card-persisted',
          title: 'Persisted card',
          details: 'Should survive a refresh.',
          columnId: 'column-2',
          order: 0,
        },
      ],
    };

    window.localStorage.setItem('kanban-board', JSON.stringify(persistedState));

    renderBoard();

    await waitFor(() => {
      expect(screen.getByText('Persisted card')).toBeInTheDocument();
    });
  });
});
