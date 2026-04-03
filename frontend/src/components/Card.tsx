'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Card as CardType } from '../types';

interface CardProps {
  card: CardType;
  onDeleteCard?: (cardId: string) => void;
  isOverlay?: boolean;
}

export function Card({ card, onDeleteCard, isOverlay = false }: CardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: 'card',
      cardId: card.id,
      columnId: card.columnId,
    },
    disabled: isOverlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <article
      ref={isOverlay ? undefined : setNodeRef}
      style={isOverlay ? undefined : style}
      className={`rounded-3xl border border-white/70 bg-white px-4 py-4 shadow-[0_18px_45px_rgba(3,33,71,0.12)] transition ${
        isDragging ? 'opacity-40' : 'opacity-100'
      } ${isOverlay ? 'rotate-1 shadow-[0_28px_60px_rgba(3,33,71,0.22)]' : ''}`}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-[#d7dfeb] bg-[#f4f7fb] text-lg text-[#032147] transition hover:border-[#209dd7] hover:bg-white"
          aria-label={`Drag card ${card.title}`}
          {...attributes}
          {...listeners}
        >
          <span aria-hidden="true">⋮⋮</span>
        </button>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold tracking-[0.01em] text-[#032147]">{card.title}</h3>
          <p className="mt-2 text-sm leading-6 text-[#5b6881]">{card.details}</p>
        </div>
        {onDeleteCard ? (
          <button
            type="button"
            onClick={() => onDeleteCard(card.id)}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#888888] transition hover:bg-[#fff5d8] hover:text-[#032147]"
            aria-label={`Delete card ${card.title}`}
          >
            <span aria-hidden="true">×</span>
          </button>
        ) : null}
      </div>
    </article>
  );
}
