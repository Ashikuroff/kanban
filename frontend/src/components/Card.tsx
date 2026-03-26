import { Card as CardType } from '../types';

interface CardProps {
  card: CardType;
}

export function Card({ card }: CardProps) {
  return (
    <div className={`bg-gray-50 border border-gray-200 rounded p-3 mb-2 shadow-lg ${card.completed ? 'opacity-60 line-through' : ''}`}>
      <h3 className="font-medium text-dark-navy">{card.title}</h3>
      <p className="text-gray-text text-sm mt-1">{card.details}</p>
      {card.completed && <span className="text-green-600 text-xs">✓ Completed</span>}
    </div>
  );
}