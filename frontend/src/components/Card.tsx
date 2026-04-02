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
      className={`border rounded p-3 bg-white shadow-sm ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex justify-between items-start gap-2 mb-2">
        <h3 className="font-medium flex-1">{card.title}</h3>

        <button
          {...attributes}
          {...listeners}
          className="p-1 text-gray-500 hover:text-gray-700"
          aria-label={`Drag card: ${card.title}`}
          onClick={(e) => e.stopPropagation()}
        >
          ☰
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm('Are you sure you want to delete this card?')) {
              onDeleteCard(card.id);
            }
          }}
          className="px-2 py-1 bg-purple-secondary text-white text-xs rounded hover:bg-opacity-80"
          aria-label={`Delete card: ${card.title}`}
        >
          Delete
        </button>
      </div>

      <p className="text-gray-600 mt-1">{card.details}</p>
    </div>
  );
}