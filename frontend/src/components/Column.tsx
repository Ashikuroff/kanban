'use client';

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Column as ColumnType, Card as CardType } from '../types';
import { SortableCard } from './SortableCard';

interface ColumnProps {
  column: ColumnType;
  onAddCard: (columnId: string) => void;
  onDeleteCard: (cardId: string) => void;
  onRenameColumn: (columnId: string) => void;
  onEditCard: (card: CardType) => void;
  onToggleCompleted: (cardId: string) => void;
}

export function Column({ column, onAddCard, onDeleteCard, onRenameColumn, onEditCard, onToggleCompleted }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-80 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2
          className="text-lg font-semibold text-dark-navy cursor-pointer"
          onClick={() => onRenameColumn(column.id)}
        >
          {column.name}
        </h2>
        <button
          onClick={() => onAddCard(column.id)}
          className="bg-purple-secondary text-white px-2 py-1 rounded text-sm hover:bg-opacity-80"
        >
          + Add Card
        </button>
      </div>
      <div ref={setNodeRef} className="flex-1 min-h-32">
        <SortableContext items={column.cards.map(card => card.id)} strategy={verticalListSortingStrategy}>
          {column.cards.map((card) => (
            <SortableCard key={card.id} card={card} onDelete={onDeleteCard} onEdit={onEditCard} onToggleCompleted={onToggleCompleted} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}