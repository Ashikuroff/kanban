'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card as CardType } from '../types';

interface SortableCardProps {
  card: CardType;
  onDelete: (cardId: string) => void;
  onEdit: (card: CardType) => void;
  onToggleCompleted: (cardId: string) => void;
}

export function SortableCard({ card, onDelete, onEdit, onToggleCompleted }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-gray-50 border border-gray-200 rounded p-3 mb-2 cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-50' : ''
      } ${card.completed ? 'opacity-60 line-through' : ''}`}
      onDoubleClick={() => onEdit(card)}
      role="button"
      aria-label={`Edit card: ${card.title}`}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-dark-navy">{card.title}</h3>
        <div className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={card.completed || false}
            onChange={() => onToggleCompleted(card.id)}
            className="w-4 h-4"
            aria-label={`Mark ${card.title} as ${card.completed ? 'incomplete' : 'complete'}`}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(card.id);
            }}
            className="text-red-500 hover:text-red-700 text-sm"
            aria-label={`Delete card: ${card.title}`}
          >
            ✕
          </button>
        </div>
      </div>
      <p className="text-gray-text text-sm mt-1">{card.details}</p>
      {card.completed && <span className="text-green-600 text-xs">✓ Completed</span>}
    </div>
  );
}