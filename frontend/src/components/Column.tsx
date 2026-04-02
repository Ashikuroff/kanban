'use client';

import { Column as ColumnType, Card as CardType } from '../types';
import { Card } from './Card';
import { useDroppable } from '@dnd-kit/core';

interface ColumnProps {
  column: ColumnType;
  cards: CardType[];
  onAddCard: (title: string, details: string) => void;
  onDeleteCard: (cardId: string) => void;
}

export function Column({ column, cards, onAddCard, onDeleteCard }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-lg font-semibold text-dark-navy mb-4">{column.title}</h2>
      <div
        ref={setNodeRef}
        className={`space-y-2 min-h-[100px] transition-colors ${
          isOver ? 'bg-blue-50 border-blue-300' : ''
        }`}
      >
        {cards.map(card => (
          <Card
            key={card.id}
            card={card}
            onDeleteCard={onDeleteCard}
          />
        ))}
      </div>
      <button
        onClick={() => {
          const title = prompt('Enter card title:');
          const details = prompt('Enter card details:');
          if (title !== null && details !== null && title.trim() !== '') {
            onAddCard(title.trim(), details.trim());
          }
        }}
        className="mt-2 w-full bg-purple-secondary text-white text-sm px-3 py-1 rounded hover:bg-opacity-80"
      >
        Add Card
      </button>
    </div>
  );
}