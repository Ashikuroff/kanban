import { Card as CardType } from '../types';
import { useDraggable } from '@dnd-kit/core';

interface CardProps {
  card: CardType;
  onDeleteCard: (cardId: string) => void;
}

export function Card({ card, onDeleteCard }: CardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: card.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`border rounded p-3 bg-white shadow-sm cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <h3 className="font-medium">{card.title}</h3>
      <p className="text-gray-600 mt-1">{card.details}</p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (window.confirm('Are you sure you want to delete this card?')) {
            onDeleteCard(card.id);
          }
        }}
        className="mt-2 px-2 py-1 bg-purple-secondary text-white text-xs rounded hover:bg-opacity-80"
        aria-label={`Delete card: ${card.title}`}
      >
        Delete
      </button>
    </div>
  );
}