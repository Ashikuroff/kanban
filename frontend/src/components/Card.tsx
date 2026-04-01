import { Card as CardType } from '../types';

interface CardProps {
  card: CardType;
  onDeleteCard: (cardId: string) => void;
}

export function Card({ card, onDeleteCard }: CardProps) {
  return (
    <div className="border rounded p-3 bg-white shadow-sm">
      <h3 className="font-medium">{card.title}</h3>
      <p className="text-gray-600 mt-1">{card.details}</p>
      <button
        onClick={() => onDeleteCard(card.id)}
        className="mt-2 px-2 py-1 bg-purple-secondary text-white text-xs rounded hover:bg-opacity-80"
      >
        Delete
      </button>
    </div>
  );
}