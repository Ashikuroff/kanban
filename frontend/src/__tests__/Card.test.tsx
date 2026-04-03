import { render, screen } from '@testing-library/react';
import { DndContext } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card } from '../components/Card';
import type { Card as CardType } from '../types';

const mockCard: CardType = {
  id: 'card-1',
  title: 'Test Card',
  details: 'Test details',
  columnId: 'column-1',
  order: 0,
};

describe('Card', () => {
  it('renders card title, details, and controls', () => {
    render(
      <DndContext>
        <SortableContext items={[mockCard.id]} strategy={verticalListSortingStrategy}>
          <Card card={mockCard} onDeleteCard={() => undefined} />
        </SortableContext>
      </DndContext>
    );

    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('Test details')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Drag card Test Card' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete card Test Card' })).toBeInTheDocument();
  });
});
